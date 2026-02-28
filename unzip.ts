import AdmZip from 'adm-zip';

try {
  const zip = new AdmZip('downloaded_file');
  zip.extractAllTo('aurion-os-extracted', true);
  console.log('Extraction complete');
} catch (err) {
  console.error('Extraction failed:', err);
}
