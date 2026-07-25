/**
 * Diagnostic script to list available Gemini models
 * This script checks the Gemini API for available models and API key validity
 */

require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('GEMINI_API_KEY found:', API_KEY ? 'YES (first 8 chars: ' + API_KEY.substring(0, 8) + '...)' : 'NO');
console.log('\nFetching available models from Gemini API...\n');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Status Message:', res.statusMessage);
    console.log('\nResponse Headers:');
    console.log(JSON.stringify(res.headers, null, 2));
    console.log('\nResponse Body:');
    
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      
      console.log('\n=== ANALYSIS ===');
      
      if (parsed.error) {
        console.log('ERROR DETECTED:');
        console.log('  Code:', parsed.error.code);
        console.log('  Message:', parsed.error.message);
        console.log('  Status:', parsed.error.status);
        if (parsed.error.details) {
          console.log('  Details:', JSON.stringify(parsed.error.details, null, 2));
        }
      } else if (parsed.models) {
        console.log('SUCCESS: Models retrieved');
        console.log('  Total models available:', parsed.models.length);
        console.log('\n  Available models:');
        parsed.models.forEach(model => {
          console.log(`    - ${model.name} (${model.displayName})`);
          console.log(`      Description: ${model.description}`);
          console.log(`      Supported generation methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        });
        
        const flashModels = parsed.models.filter(m => m.name.includes('flash'));
        console.log(`\n  Flash models found: ${flashModels.length}`);
        flashModels.forEach(m => console.log(`    - ${m.name}`));
        
        const gemini35Flash = parsed.models.find(m => m.name.includes('3.5-flash'));
        console.log(`\n  gemini-3.5-flash available: ${gemini35Flash ? 'YES' : 'NO'}`);
      }
    } catch (e) {
      console.log('Failed to parse JSON response:');
      console.log(data);
    }
  });

}).on('error', (error) => {
  console.error('Request failed:', error.message);
  process.exit(1);
});
