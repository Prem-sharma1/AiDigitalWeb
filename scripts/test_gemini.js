const fs = require('fs');
const path = require('path');

function readEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      config[key] = value.trim();
    }
  });
  return config;
}

async function testGemini() {
  const env = readEnv();
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('No GEMINI_API_KEY found in .env');
    return;
  }
  
  console.log('Testing Gemini API key...');
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say hello in 5 words.' }]
        }]
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('Gemini API call success!');
      console.log('Response:', JSON.stringify(data.candidates[0].content.parts[0].text));
    } else {
      console.log(`Gemini API call failed with status: ${res.status}`);
      const text = await res.text();
      console.log('Error details:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testGemini();
