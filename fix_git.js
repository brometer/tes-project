const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const out = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    if (out.trim()) console.log(out.trim());
  } catch (err) {
    console.log('  Warning:', err.stderr?.trim() || err.message);
  }
}

console.log('=== Removing apps/web/node_modules from git ===');
run('git rm -r --cached apps/web/node_modules');

console.log('\n=== Removing temp scripts ===');
run('git rm --cached fix_git.js');
run('git rm --cached check_git.js');
run('git rm --cached test.js');

console.log('\n=== Staging all changes ===');
run('git add .');

console.log('\n=== Commit & Push ===');
run('git commit -m "fix: remove web node_modules from git tracking"');
run('git push origin master');

console.log('\nDone! Vercel will redeploy.');
