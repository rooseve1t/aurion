const esbuild = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('🧹 Cleaning up...');
  if (fs.existsSync('dist-server')) {
    fs.rmSync('dist-server', { recursive: true, force: true });
  }
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
  }

  console.log('🎨 Building Frontend...');
  try {
    // Skip type checking for speed and to avoid unrelated errors
    execSync('npx vite build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Frontend build failed:', e);
    process.exit(1);
  }

  console.log('⚙️ Bundling Backend...');
  try {
    await esbuild.build({
      entryPoints: ['server.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'dist-server/index.js',
      format: 'cjs', // Force CJS for pkg compatibility
      external: [
        'better-sqlite3', 
        'sharp', 
        '@google/genai', 
        'vite', 
        'fsevents',
        'electron',
        'mock-aws-s3',
        'aws-sdk',
        'nock'
      ],
      loader: { '.ts': 'ts' },
      // Shim import.meta.url for CJS
      banner: {
        js: `
          const { fileURLToPath } = require('url');
          const path = require('path');
          // Shim for import.meta.url in CJS environment
          const import_meta_url = require('url').pathToFileURL(__filename).toString();
        `,
      },
      define: {
        'import.meta.url': 'import_meta_url'
      }
    });
  } catch (e) {
    console.error('Backend bundle failed:', e);
    process.exit(1);
  }

  console.log('📦 Packaging into Executable...');
  try {
    // Try to build for host first (Linux) to verify
    // Then try Windows if possible
    console.log('   Targeting: node18-linux-x64, node18-win-x64');
    
    // We use --public to speed up and avoid some asset processing issues
    execSync('npx pkg . --targets node18-linux-x64,node18-win-x64 --out-path build --public', { stdio: 'inherit' });
    
    // Copy native modules
    // WARNING: This copies the LINUX binary. Windows users need the Windows binary.
    const betterSqlitePath = 'node_modules/better-sqlite3/build/Release/better_sqlite3.node';
    if (fs.existsSync(betterSqlitePath)) {
        console.log('📦 Copying native modules (Linux version)...');
        fs.copyFileSync(betterSqlitePath, path.join('build', 'better_sqlite3.node'));
        
        // Create a warning file
        fs.writeFileSync(
            path.join('build', 'README_IMPORTANT.txt'), 
            `IMPORTANT:
The 'better_sqlite3.node' file in this folder is for LINUX.
If you are running the .exe on Windows, you MUST replace this file with the Windows version of 'better_sqlite3.node'.
You can install it on Windows via 'npm install better-sqlite3' and copying it from node_modules.`
        );
    }

    console.log('✅ Build Complete! Executables are in /build folder.');
  } catch (e) {
    console.error('Packaging failed. This is common in restricted environments.');
    console.error('Falling back to "Portable Zip" structure...');
    
    // Fallback: Create a portable folder structure
    const distPath = path.join('build', 'portable');
    fs.mkdirSync(distPath, { recursive: true });
    
    // Copy bundled server
    fs.copyFileSync('dist-server/index.js', path.join(distPath, 'server.js'));
    
    // Copy frontend dist
    fs.cpSync('dist', path.join(distPath, 'dist'), { recursive: true });
    
    // Copy native modules
    if (fs.existsSync('node_modules/better-sqlite3/build/Release/better_sqlite3.node')) {
        fs.copyFileSync(
            'node_modules/better-sqlite3/build/Release/better_sqlite3.node', 
            path.join(distPath, 'better_sqlite3.node')
        );
    }

    // Create start scripts
    fs.writeFileSync(path.join(distPath, 'start.bat'), '@echo off\r\nnode server.js\r\npause');
    fs.writeFileSync(path.join(distPath, 'start.sh'), '#!/bin/bash\nnode server.js');
    fs.chmodSync(path.join(distPath, 'start.sh'), '755');
    
    console.log(`⚠️  Could not create single .exe file. Created "Portable" folder instead at /build/portable.`);
    console.log(`   You can run this by installing Node.js and running start.bat (Windows) or start.sh (Linux).`);
  }
}

build();
