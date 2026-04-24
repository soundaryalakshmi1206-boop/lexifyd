const fs = require('fs');
const acorn = require('acorn');
const code = fs.readFileSync('c:/Users/Asus/lexifyd/frontend2/src/data/lexical_db.js', 'utf8');
try {
  acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' });
} catch (e) {
  if (e.loc) {
    console.log('Error at line ' + e.loc.line + ' column ' + e.loc.column);
  }
  console.log(e.message);
}
