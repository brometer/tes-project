const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'apps', 'web', '.git');
console.log('Exists:', fs.existsSync(p));

const ls = require('child_process').execSync('git ls-files apps/web').toString();
console.log('Tracked files in apps/web:', ls.split('\n').length);
