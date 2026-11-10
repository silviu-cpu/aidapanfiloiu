const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const english = require('../lib/en.json');
const compiled = ts.transpileModule(fs.readFileSync('lib/symptoms.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const scope = { exports: {} };
vm.runInNewContext(compiled, scope);
const { symptoms, toggleSymptom, selectedSymptoms } = scope.exports;

// A patient can combine concerns from different specialties and remove just one.
let selection = [];
selection = toggleSymptom(selection, 'hernie');
selection = toggleSymptom(selection, 'procto');
selection = toggleSymptom(selection, 'plagi');
assert.equal(selectedSymptoms(selection).length, 3);
assert.equal(new Set(selectedSymptoms(selection).map((symptom) => symptom.group)).size, 3);
const previous = selection;
selection = toggleSymptom(selection, 'procto');
assert.equal(previous.length, 3, 'State updates must preserve the previous selection');
assert.equal(selectedSymptoms(selection).length, 2);
assert(selection.includes('hernie'));
assert(selection.includes('plagi'));
assert(!selection.includes('procto'));

// All options can be selected, then cleared. No diagnostic choice is imposed.
selection = [];
for (const symptom of symptoms) selection = toggleSymptom(selection, symptom.id);
assert.equal(selectedSymptoms(selection).length, symptoms.length);
assert.equal(new Set(selection).size, selection.length);
for (const symptom of symptoms) selection = toggleSymptom(selection, symptom.id);
assert.equal(selectedSymptoms(selection).length, 0);
assert.equal(selectedSymptoms(['unknown']).length, 0);
for (const symptom of symptoms) assert(english[symptom.label], `Missing English label: ${symptom.label}`);
console.log('PASS: multiple selections, mixed groups, individual deselection, immutable state, select/clear all, English labels');

// Render the actual shared provider, category buttons and form pickers with controlled hooks.
const states = [];
let cursor = 0;
let context;
const node = (type, props) => ({ type, props });
const react = {
  createContext: () => (context = { Provider: 'provider', current: null }),
  useContext: (value) => value.current,
  useState: (initial) => {
    const index = cursor++;
    if (!(index in states)) states[index] = initial;
    return [states[index], (next) => { states[index] = typeof next === 'function' ? next(states[index]) : next; }];
  },
  useId: () => 'test-picker',
};
function load(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const box = { exports: {}, require: (name) => {
    if (name === 'react') return react;
    if (name === 'react/jsx-runtime') return { jsx: node, jsxs: node };
    if (name.includes('LocaleProvider')) return { useTranslation: () => ({ t: (text) => text }) };
    if (name === '@/lib/symptoms') return scope.exports;
    if (name in imports) return imports[name];
    throw Error(`Unexpected import ${name}`);
  }};
  vm.runInNewContext(code, box);
  return box.exports;
}
const picker = load('components/site/SymptomPicker.tsx');
const content = load('lib/content.ts');
const triage = load('components/site/Triage.tsx', {
  './SymptomPicker': picker,
  '@/lib/content': content,
  '@/components/site/Photo': { default: () => null },
  'lucide-react': { Phone: () => null, MessageCircle: () => null },
});
function renderProvider() {
  cursor = 0;
  context.current = picker.SymptomProvider({ children: null }).props.value;
}
function elements(tree, type) {
  if (!tree) return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => elements(child, type));
  if (typeof tree.type === 'function') return elements(tree.type(tree.props), type);
  return [...(tree.type === type ? [tree.props] : []), ...elements(tree.props?.children, type)];
}
renderProvider();
let buttons = elements(triage.default(), 'button');
buttons[0].onClick();
buttons[4].onClick();
renderProvider();
for (let form = 0; form < 2; form++) {
  const inputs = elements(picker.default({}), 'input');
  assert.equal(inputs.filter((input) => input.checked).length, 2, 'Each form reflects the hero selection');
  assert(inputs.find((input) => input.value === 'altceva').checked);
}
elements(picker.OtherConcernField(), 'textarea')[0].onChange({ target: { value: 'My own concern' } });
renderProvider();
assert.equal(elements(picker.OtherConcernField(), 'textarea')[0].value, 'My own concern');
assert.equal(elements(triage.default(), 'textarea')[0].value, 'My own concern', 'Other details appear in the hero too');
elements(picker.default({}), 'input').find((input) => input.value === 'hernie').onChange();
renderProvider();
assert.equal(elements(triage.default(), 'button')[0]['aria-pressed'], false, 'Form deselection updates the hero');
assert(elements(triage.default(), 'a').find((anchor) => anchor.href.includes('wa.me')).href.includes('My%20own%20concern'));
elements(triage.default(), 'button')[4].onClick();
renderProvider();
assert.equal(elements(picker.default({}), 'textarea').length, 0, 'Other field is hidden when deselected');
assert(!elements(triage.default(), 'a').find((anchor) => anchor.href.includes('wa.me')).href.includes('My%20own%20concern'));
console.log('PASS: hero/form/modal shared selection, editing from either surface, shared other text, deselection excludes other text');

const callback = load('components/site/CallbackForm.tsx', {
  './SymptomPicker': picker,
  './PrivacyModal': { PrivacyLink: ({ children }) => node('button', { type: 'button', children }) },
  'lucide-react': { CircleCheck: () => null },
});
for (const otherSelected of [false, true]) {
  if (context.current.selected.includes('altceva') !== otherSelected) context.current.toggle('altceva');
  renderProvider();
  for (const twoColumns of [false, true]) {
    cursor = 2;
    const fields = elements(callback.default({ twoColumns }), 'textarea');
    assert.equal(fields.length, otherSelected ? 1 : 0, 'The details field appears only when Other is selected');
    if (otherSelected) {
      assert.equal(fields[0].name, 'mesaj');
      assert.equal(fields[0].value, 'My own concern', 'The shared draft is preserved');
    }
  }
}
console.log('PASS: details field appears only for Other in contact form and modal; draft remains synchronised');

