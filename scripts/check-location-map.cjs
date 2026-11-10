const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const english = require('../lib/en.json');
function compile(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const box = { exports: {}, require: (name) => {
    if (!(name in imports)) throw Error(`Unexpected import: ${name}`);
    return imports[name];
  }};
  vm.runInNewContext(code, box);
  return box.exports;
}
const content = compile('lib/content.ts');
let selectedId;
let lang = 'ro';
const jsx = (type, props) => ({ type, props });
const map = compile('components/site/LocationsMap.tsx', {
  react: { useState: (initial) => [selectedId ?? initial, (value) => { selectedId = value; }] },
  'react/jsx-runtime': { jsx, jsxs: jsx },
  'lucide-react': { Info: () => null },
  '@/lib/content': content,
  '@/components/LocaleProvider': { useTranslation: () => ({ lang, t: (text) => lang === 'en' ? english[text] ?? text : text }) },
});
function elements(tree, type) {
  if (!tree) return [];
  if (Array.isArray(tree)) return tree.flatMap((entry) => elements(entry, type));
  return [...(tree.type === type ? [tree.props] : []), ...elements(tree.props?.children, type)];
}
for (lang of ['ro', 'en']) {
  selectedId = undefined;
  assert.equal(elements(map.default(), 'iframe').length, 1);
  for (let index = 0; index < content.locations.length; index++) {
    const location = content.locations[index];
    elements(map.default(), 'button')[index].onClick();
    const tree = map.default();
    const buttons = elements(tree, 'button');
    assert.equal(buttons.filter((button) => button['aria-pressed']).length, 1);
    assert.equal(buttons[index]['aria-pressed'], true);
    const frame = elements(tree, 'iframe')[0];
    const src = new URL(frame.src);
    assert.equal(src.hostname, 'www.google.com');
    assert.equal(src.searchParams.get('q'), location.mapQuery);
    assert.equal(src.searchParams.get('hl'), lang);
    assert.equal(src.searchParams.get('output'), 'embed');
    assert(frame.title.includes(location.name));
    const directions = elements(tree, 'a')[0];
    assert.equal(new URL(directions.href).searchParams.get('destination'), location.mapQuery);
    assert.equal(directions.target, '_blank');
  }
  console.log(`PASS ${lang}: five selectable locations, one active button, matching map and directions`);
}
