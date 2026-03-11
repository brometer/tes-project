/**
 * Fix script to resolve git submodule and node_modules issues.
 * Run this from the root of the finance-ai project.
 */
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    if (output.trim()) console.log(output.trim());
    return true;
  } catch (err) {
    console.log('  (Warning):', err.stderr?.trim() || err.message);
    return false;
  }
}

console.log('=== Step 1: Remove node_modules from git cache ===');
run('git rm -r --cached node_modules');

console.log('\n=== Step 2: Remove apps/web submodule gitlink ===');
run('git rm --cached apps/web');

console.log('\n=== Step 3: Remove temp files from git cache ===');
run('git rm --cached test.js');
run('git rm --cached check_git.js');

console.log('\n=== Step 4: Add apps/web/ as normal files (trailing slash!) ===');
run('git add apps/web/');

console.log('\n=== Step 5: Add all remaining changes ===');
run('git add .');

console.log('\n=== Step 6: Commit ===');
run('git commit -m "fix: properly add apps/web files and remove node_modules from tracking"');

console.log('\n=== Step 7: Push ===');
run('git push origin master');

console.log('\n=== DONE! Check Vercel for the new deployment. ===');
