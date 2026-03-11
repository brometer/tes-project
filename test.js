const { execSync } = require('child_process');
try {
  const status = execSync('git status', { encoding: 'utf-8' });
  console.log('STATUS:', status);
} catch (err) {
  console.log('ERROR:', err.message);
}
