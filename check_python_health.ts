import fetch from 'node-fetch';

async function checkHealth() {
  try {
    const res = await fetch('http://127.0.0.1:8000/health');
    const data = await res.json();
    console.log('Python Core Health:', data);
  } catch (e) {
    console.error('Python Core is still offline:', e.message);
  }
}

checkHealth();
