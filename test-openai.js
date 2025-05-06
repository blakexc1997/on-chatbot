const OpenAI = require('openai');
require('dotenv').config();

console.log('🔑 API Key:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ MISSING');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  try {
    console.log('⏳ Sending test message to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello from a test script!' }],
    });
    console.log('✅ OpenAI responded:', response.choices[0].message.content);
  } catch (err) {
    console.error('❌ OpenAI error:', err.response?.data || err.message || err);
  }
})();
