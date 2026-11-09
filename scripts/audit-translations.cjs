const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const dict = JSON.parse(fs.readFileSync('lib/en.json', 'utf8'));
const found = new Map();
const fields = new Set(['name', 'title', 'short', 'text', 'treatment', 'label', 'forWhat', 'where', 'shows', 'when', 'prep', 'quote', 'role', 'languages', 'value', 'detail', 'q', 'a', 'years', 'services', 'tag', 'area', 'consult', 'surgery']);
const unchanged = /^(?:[\d\s+–-]+|Dr\.|MedLife|Royal Hospital|Clinica|Enayati|Bd\.|Mihaela|Aida Panfiloiu|WhatsApp|Email|Phone|Contact|Legal|Cg|Cp|Ao|Lp|Cc|Pc|Co|Mc|Tp|Up)/;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(ts|tsx)$/.test(file) && !/i18n\.ts$/.test(file)) {
      const source = fs.readFileSync(file,'utf8');
      const tree = ts.createSourceFile(file,source,99,true,4);
      function walk(node) {
        if (ts.isStringLiteral(node) || ts.isJsxText(node)) {
          const text = (ts.isStringLiteral(node) ? node.text : node.getText(tree)).replace(/\s+/g,' ').trim();
          const display = ts.isStringLiteral(node) && (
            (ts.isCallExpression(node.parent) && node.parent.expression.getText(tree) === 't') ||
            (ts.isPropertyAssignment(node.parent) && fields.has(node.parent.name.getText(tree)))
          );
          if ((/[ăâîșțĂÂÎȘȚ]/.test(text) || display) && !dict[text] && !unchanged.test(text) && !text.startsWith('/') && !text.includes('className')) found.set(text,file);
        }
        ts.forEachChild(node,walk);
      }
      walk(tree);
    }
  }
}
scan('app');scan('components');scan('lib');
for (const [text,file] of found) console.log(JSON.stringify(text)+': "",');
console.log('Missing:',found.size);
