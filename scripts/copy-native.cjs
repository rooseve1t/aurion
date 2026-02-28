const fs = require('fs');
const path = require('path');

const paths = [
  '/node_modules/better-sqlite3/build/Release/better_sqlite3.node',
  '/app/node_modules/better-sqlite3/build/Release/better_sqlite3.node',
  '/app/applet/node_modules/better-sqlite3/build/Release/better_sqlite3.node',
  'node_modules/better-sqlite3/build/Release/better_sqlite3.node'
];

let copied = false;
for (const src of paths) {
  if (fs.existsSync(src)) {
    console.log(`Found at: ${src}`);
    const dest = path.join('build', 'better_sqlite3.node');
    fs.copyFileSync(src, dest);
    console.log(`Copied to ${dest}`);
    copied = true;
    break;
  }
}

if (!copied) {
  console.error('Could not find better_sqlite3.node in any common location.');
}
