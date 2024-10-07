const functions = require('firebase-functions');
const Groq = require('groq-sdk');

// Load API key from Firebase environment config
const apiKey = functions.config().groq.api_key;

if (!apiKey) {
  throw new Error('API key is missing! Ensure you have set it using Firebase CLI.');
}

// Initialize Groq client with the API key
const client = new Groq({
  apiKey: apiKey,
});

exports.generateMealPlan = functions.https.onRequest((req, res) => {
  console.log('Incoming request:', req.method);

  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request');
    res.status(204).send(''); // Respond with HTTP 204 No Content
    return;
  }

  // Handle actual request
  if (req.method !== 'POST') {
    console.log('Invalid request method:', req.method);
    return res.status(405).send('Method Not Allowed');
  }

  console.log('Handling POST request with body:', req.body);

  // Handle POST request for generating meal plan
  (async () => {
    try {
      const params = {
        messages: req.body.messages,
        model: 'llama3-8b-8192',
      };

      console.log('Calling Groq API with params:', params);

      const response = await client.chat.completions.create(params);

      console.log('Received response from Groq API:', response);

      if (response && response.choices && response.choices.length > 0) {
        console.log('Responding with meal plan');
        res.status(200).json({ mealPlan: response.choices[0].message.content });
      } else {
        console.log('No response from model');
        res.status(400).send('No response from model.');
      }
    } catch (error) {
      console.error('Error generating completion:', error);
      res.status(500).send('Internal server error');
    }
  })();
});
