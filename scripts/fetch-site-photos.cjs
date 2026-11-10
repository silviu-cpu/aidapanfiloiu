const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const photos = [
  ['operating-room', '18112241'],
  ['consultation', '7088834'],
  ['wound-care', '5721552'],
  ['ultrasound', '7089029'],
  ['medical-research', '5327916'],
  ['patient-support', '11030158'],
];

async function main() {
  for (const [name, id] of photos) {
    const dest = path.join('public', 'images', `${name}.webp`);
    try { await fs.access(dest); console.log(`Already downloaded: ${name}`); continue; } catch {}
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
    const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    await sharp(data).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toFile(dest);
    console.log(`${name}: ${Math.round((await fs.stat(dest)).size / 1024)} KB`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
