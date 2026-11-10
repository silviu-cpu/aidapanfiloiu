// Uses local Chrome and the project's bundled CDP transport; --dev tests the configured Turbopack CSS pipeline.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const WebSocket = require('next/dist/compiled/ws');

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'aida-conditions-check-'));
const output = path.resolve('tmp/conditions-preview');
fs.mkdirSync(output, { recursive: true });
let browser, server, socket;
let sequence = 0;
const pending = new Map();

async function until(check, message, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try { const result = await check(); if (result) return result; } catch {}
    await pause(150);
  }
  throw Error(message);
}

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

async function main() {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.argv.includes('--dev') ? 'dev' : 'start', '--hostname', 'localhost', '--port', '3107'], { windowsHide: true, stdio: 'pipe' });
  let serverLog = '';
  server.stdout.on('data', (data) => { serverLog += data; });
  server.stderr.on('data', (data) => { serverLog += data; });
  await until(() => serverLog.includes('Ready in'), 'Server did not start: ' + serverLog);
  await fetch('http://localhost:3107/servicii');
  browser = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'pipe' });
  let browserLog = '';
  browser.stderr.on('data', (data) => { browserLog += data; });
  const endpoint = await until(() => browserLog.match(/DevTools listening on (ws:\/\/\S+)/)?.[1], 'Chrome did not expose CDP: ' + browserLog);
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.once('open', resolve); socket.once('error', reject); });
  socket.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    clearTimeout(item.timer);
    if (message.error) item.reject(Error(JSON.stringify(message.error))); else item.resolve(message.result);
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await call('Page.enable');
  await call('Runtime.enable');
  for (const scenario of [
    { lang: 'ro', width: 1440, height: 900, pinned: false, screenshot: 'desktop' },
    { lang: 'ro', width: 390, height: 844, pinned: false, screenshot: 'mobile' },
    { lang: 'ro', width: 1440, height: 1600, pinned: true },
    { lang: 'ro', width: 1440, height: 1600, pinned: false, reduce: true },
    { lang: 'en', width: 1440, height: 900, pinned: false },
  ]) {
    if (process.argv.includes('--pinned-only') && !scenario.pinned) continue;
    await call('Emulation.setDeviceMetricsOverride', { width: scenario.width, height: scenario.height, deviceScaleFactor: 1, mobile: false });
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: scenario.reduce ? 'reduce' : 'no-preference' }] });
    await call('Page.navigate', { url: `http://localhost:3107/${scenario.lang === 'en' ? 'en/' : ''}servicii` });
    const section = `document.querySelector('section[aria-label="${scenario.lang === 'en' ? 'Conditions treated' : 'Afecțiuni tratate'}"]')`;
    try {
      await until(() => evaluate(`document.readyState === 'complete' && Boolean(${section}?.querySelector('button[aria-haspopup="dialog"]'))`), 'Gallery was not hydrated');
    } catch (error) {
      console.error(await evaluate(`({url: location.href, ready: document.readyState, title: document.title, text: document.body.innerText.slice(0, 1800), sections: [...document.querySelectorAll('section[aria-label]')].map(el => el.getAttribute('aria-label'))})`));
      throw error;
    }
    await evaluate('document.fonts.ready');
    await pause(500);
    const metrics = await evaluate(`(() => {
      const section = ${section};
      const cards = [...section.querySelectorAll('article')];
      return {
        pinned: getComputedStyle(section.firstElementChild).position === 'sticky',
        count: cards.length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        cards: cards.map(card => ({ height: card.offsetHeight, clipped: card.scrollHeight > card.clientHeight + 1, headings: card.querySelectorAll('h4').length, locations: /MedLife|Royal Hospital|Clinica Victoria/.test(card.innerText), ctaHeight: card.querySelector('[aria-haspopup="dialog"]').offsetHeight }))
      };
    })()`);
    assert.equal(metrics.pinned, scenario.pinned, JSON.stringify({ scenario, metrics }));
    assert.equal(metrics.count, 6);
    assert.equal(metrics.overflow, false);
    for (const card of metrics.cards) {
      assert(card.height >= 860, JSON.stringify({scenario, card}));
      assert.equal(card.clipped, false);
      assert.equal(card.headings, 3);
      assert.equal(card.locations, false);
      assert(card.ctaHeight >= 48);
    }
    if (scenario.screenshot) {
      await evaluate(`(() => { const section = ${section}; window.scrollTo({ top: scrollY + section.getBoundingClientRect().top, behavior: 'instant' }); })()`);
      await pause(1200);
      const clip = await evaluate(`(() => { const rect = ${section}.querySelector('article').getBoundingClientRect(); return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height, scale: 1 }; })()`);
      const result = await call('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
      fs.writeFileSync(path.join(output, `${scenario.screenshot}.png`), Buffer.from(result.data, 'base64'));
    }
    await evaluate(`${section}.querySelector('button[aria-label="${scenario.lang === 'en' ? 'Next condition' : 'Afecțiunea următoare'}"]').click()`);
    await until(() => evaluate(`${section}.innerText.includes('02 / 06')`), 'Next-card navigation did not update');
    if (scenario.pinned) {
      assert(await evaluate(`getComputedStyle(${section}.querySelector('article').parentElement).transform !== 'none'`));
    }
    await evaluate(`${section}.querySelector('button[aria-haspopup="dialog"]').click()`);
    await until(() => evaluate(`Boolean(document.querySelector('dialog[open][aria-labelledby="appointment-title"]'))`), 'Booking button did not open the modal');
    await evaluate(`document.querySelector('dialog[open][aria-labelledby="appointment-title"]').close()`);
    console.log(`PASS ${scenario.lang} ${scenario.width}x${scenario.height}${scenario.reduce ? ' reduced motion' : ''}: full text, navigation, no locations, booking modal; pinned=${metrics.pinned}`);
  }
  console.log(`Screenshots: ${output}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch {}
    socket.close();
  }
  browser?.kill();
  server?.kill();
  // Only remove the unique profile directory this script created under the OS temp directory.
  const resolved = path.resolve(profile);
  if (path.dirname(resolved) === path.resolve(os.tmpdir()) && path.basename(resolved).startsWith('aida-conditions-check-')) {
    await pause(750);
    fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});
