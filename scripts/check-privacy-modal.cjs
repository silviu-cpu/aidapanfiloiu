const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, imports = {}) {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const box = { exports: {}, ...imports.globals, require: (name) => {
    if (!(name in imports)) throw Error(`Unexpected import: ${name}`);
    return imports[name];
  }};
  vm.runInNewContext(compiled, box);
  return box.exports;
}
function elements(tree, type) {
  if (!tree) return [];
  if (Array.isArray(tree)) return tree.flatMap((entry) => elements(entry, type));
  return [...(tree.type === type ? [tree.props] : []), ...elements(tree.props?.children, type)];
}
const privacy = load('lib/privacy.ts');
for (const lang of ['ro', 'en']) {
  assert.equal(privacy.privacyNotice[lang].sections.length, 6);
  for (const section of privacy.privacyNotice[lang].sections) assert(section.title && section.text);
  for (const nested of [false, true]) {
    let open = false;
    let context;
    let effectIndex = 0;
    const effects = [];
    const pending = [];
    const style = { overflow: nested ? 'hidden' : '' };
    const appointment = { open: nested };
    const dialog = {
      open: false,
      showModal() { this.open = true; },
      close() { this.open = false; },
      getBoundingClientRect: () => ({ left: 10, right: 600, top: 10, bottom: 500 }),
    };
    const ref = { current: dialog };
    const node = (type, props) => ({ type, props });
    const mod = load('components/site/PrivacyModal.tsx', {
      react: {
        createContext: () => (context = { Provider: 'provider', current: null }),
        useContext: (value) => value.current,
        useState: () => [open, (next) => { open = next; }],
        useRef: () => ref,
        useEffect: (fn, deps) => {
          const index = effectIndex++;
          const previous = effects[index];
          if (!previous || deps.some((dep, i) => dep !== previous.deps[i])) {
            pending.push(() => { previous?.cleanup?.(); effects[index] = { deps, cleanup: fn() }; });
          }
        },
      },
      'react/jsx-runtime': { jsx: node, jsxs: node },
      'next/navigation': { usePathname: () => '/contact' },
      'lucide-react': { X: () => null },
      '@/components/LocaleProvider': { useTranslation: () => ({ lang }) },
      '@/lib/privacy': privacy,
      globals: { document: { documentElement: { style }, querySelectorAll: () => nested ? [appointment] : [] } },
    });
    function render() {
      effectIndex = 0;
      const tree = mod.PrivacyProvider({ children: null });
      context.current = tree.props.value;
      while (pending.length) pending.shift()();
      return tree;
    }
    render();
    const trigger = mod.PrivacyLink({ children: 'Privacy' });
    assert.equal(trigger.props.type, 'button', 'Reading privacy must not submit the form');
    trigger.props.onClick();
    let tree = render();
    assert(dialog.open);
    assert.equal(style.overflow, 'hidden');
    assert.equal(elements(tree, 'h2')[0].children, privacy.privacyNotice[lang].title);
    assert(elements(tree, 'a')[0].href.includes(lang === 'ro' ? 'ron' : 'eng'));
    elements(tree, 'dialog')[0].onClick({ target: dialog, currentTarget: dialog, clientX: 100, clientY: 100 });
    assert(open, 'Clicking inside the dialog does not dismiss it');
    elements(tree, 'dialog')[0].onClose(); // Native Escape/close event.
    render();
    assert(!dialog.open);
    assert.equal(style.overflow, nested ? 'hidden' : '');
    assert.equal(appointment.open, nested, 'Closing privacy preserves the appointment modal');
    trigger.props.onClick();
    tree = render();
    elements(tree, 'dialog')[0].onClick({ target: dialog, currentTarget: dialog, clientX: 0, clientY: 0 });
    render();
    assert(!dialog.open, 'Backdrop click dismisses privacy');
    console.log(`PASS ${lang}, ${nested ? 'inside appointment' : 'standalone'}: open, close, scroll lock, correct copy, safe form trigger`);
  }
}
