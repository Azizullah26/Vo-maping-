const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up invalid Node.js built-in packages...');

const problemPackages = ['fs', 'path', 'child_process'];
let cleaned = false;

// Check if these packages were installed in node_modules
problemPackages.forEach(pkg => {
  const pkgPath = path.join(process.cwd(), 'node_modules', pkg);
  if (fs.existsSync(pkgPath)) {
    console.log(`⚠️  Removing invalid package: ${pkg}`);
    fs.rmSync(pkgPath, { recursive: true, force: true });
    cleaned = true;
  }
});

if (cleaned) {
  console.log('✅ Cleanup complete - Node.js built-ins removed from node_modules');
} else {
  console.log('✅ No cleanup needed - all dependencies are valid');
}
