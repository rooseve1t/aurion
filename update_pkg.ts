import fs from 'fs';

const currentPkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const extractedPkg = JSON.parse(fs.readFileSync('aurion-os-extracted/package.json', 'utf-8'));

currentPkg.dependencies = {
  ...currentPkg.dependencies,
  ...extractedPkg.dependencies
};

currentPkg.devDependencies = {
  ...currentPkg.devDependencies,
  ...extractedPkg.devDependencies
};

// Remove manus specific plugins as they won't work outside their environment
delete currentPkg.devDependencies['@builder.io/vite-plugin-jsx-loc'];
delete currentPkg.devDependencies['vite-plugin-manus-runtime'];

fs.writeFileSync('package.json', JSON.stringify(currentPkg, null, 2));
console.log('package.json updated');
