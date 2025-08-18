import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testAPI() {
  console.log('🧪 Testing API Endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What does it mean to be created in God\'s image?',
        history: []
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response Success!');
      console.log('Response length:', data.response?.length || 0);
      console.log('Citations found:', data.processed?.citations?.length || 0);
      console.log('Strong\'s references:', data.processed?.strongsReferences?.length || 0);
      console.log('\nFirst 200 characters of response:');
      console.log(data.response?.substring(0, 200) + '...');
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', response.status);
      console.log('Error details:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev');
    return false;
  }
  return false;
}

// Main test
async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }
  
  console.log('🔑 Checking environment...');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('❌ OPENAI_API_KEY not found in .env.local');
    console.log('Please copy env.example to .env.local and add your API key');
    process.exit(1);
  }
  
  if (apiKey === 'your_openai_api_key_here') {
    console.log('❌ Please replace the placeholder API key with your actual key');
    process.exit(1);
  }
  
  console.log('✅ Environment configured correctly');
  console.log('Model:', process.env.OPENAI_MODEL || 'gpt-4o (default)');
  
  await testAPI();
}

main();
