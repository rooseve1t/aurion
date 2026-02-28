import fs from 'fs';
import https from 'https';

const fileId = '1qP0mdNJzHR11LuT46grHXCnwsZ1p1ksM';
const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  if (res.statusCode === 303 || res.statusCode === 302) {
    console.log('Redirecting to:', res.headers.location);
    https.get(res.headers.location, (res2) => {
      console.log('Status Code 2:', res2.statusCode);
      console.log('Headers 2:', res2.headers);
      
      const file = fs.createWriteStream('downloaded_file');
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed');
      });
    });
  } else {
    const file = fs.createWriteStream('downloaded_file');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download completed');
    });
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
