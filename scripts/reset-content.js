/* Overwrites _data/*.csv with the generic starter tables, so you can fill in
   your own details. Destructive — run once, at the start of a new site.
   Usage: npm run reset-content -- --yes */
const fs = require('fs');
const path = require('path');

if (process.argv.indexOf('--yes') === -1) {
  console.error('This overwrites every file in _data/. Re-run with:  npm run reset-content -- --yes');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const from = path.join(root, 'starter-data');
const to = path.join(root, '_data');
fs.readdirSync(from).filter(function (f) { return f.endsWith('.csv'); }).forEach(function (f) {
  fs.copyFileSync(path.join(from, f), path.join(to, f));
  console.log('reset', '_data/' + f);
});
console.log('\nNow edit _data/*.csv, then run:  npm run build');
