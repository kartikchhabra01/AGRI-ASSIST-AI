/**
 * AI Service
 * Integrates with Gemini API using @google/generative-ai SDK
 * Supports text, images, multi-language, and conversation context
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set. AI features will be unavailable.');
}

const getGenAI = () => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. AI features are unavailable.');
  }
  return genAI;
};

// Agriculture-focused system prompt
const SYSTEM_PROMPT = `You are AGRI ASSIST AI, an expert agricultural assistant specializing in helping farmers with crop management, disease diagnosis, fertilization, irrigation, pest control, soil health, weather impact, organic farming, and general crop management.

Your expertise includes:
- Crop disease identification and treatment
- Fertilizer recommendations and application timing
- Irrigation scheduling and water management
- Pest identification and control methods
- Soil health analysis and improvement
- Weather impact on crops and adaptation strategies
- Organic farming practices
- Crop selection and rotation
- Harvest timing and post-harvest handling

Guidelines:
1. Provide concise, practical, farmer-friendly advice
2. Use simple language that farmers can understand
3. Include specific actionable steps when possible
4. Mention safety precautions when recommending chemicals
5. Suggest organic alternatives when available
6. If uncertain, recommend consulting local agricultural extension
7. For image analysis, describe visible symptoms and suggest likely causes
8. Responses should be formatted with clear headings and bullet points when appropriate
9. If the user asks questions unrelated to agriculture, politely redirect them back to farming topics

Respond in the language specified by the user (default: English).`;

/**
 * Generate AI response with conversation context
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} language - Language code (en, hi, pa, bn, ta)
 * @param {string} image - Optional base64 encoded image
 * @returns {Promise<string>} AI response
 */
const generateResponse = async (messages, language = 'en', image = null) => {
  try {
    const languagePrompt = getLanguagePrompt(language);
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${languagePrompt}`;

    // Clean Base64 image - remove data URL prefix if present
    let cleanImage = null;
    if (image) {
      cleanImage = image.replace(/^data:image\/[a-z]+;base64,/, '');

      // Check image size (max 4MB for Gemini)
      const imageSizeKB = cleanImage.length * 0.75 / 1024;
      if (imageSizeKB > 4096) {
        throw new Error('Image size exceeds 4MB limit. Please upload a smaller image.');
      }
    }

    // If image is provided, use vision model with single request
    if (cleanImage) {
      const model = getGenAI().getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: fullSystemPrompt
      });

      const lastUserMessage = messages[messages.length - 1];
      const prompt = lastUserMessage?.content || 'Analyze this crop image';

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanImage,
            mimeType: 'image/jpeg'
          }
        }
      ]);

      return result.response.text();
    }

    // Text-only conversation with history
    const model = getGenAI().getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: fullSystemPrompt
    });

    // If there's no history (first message), use simple generateContent
    if (messages.length === 1) {
      const result = await model.generateContent(messages[0].content);
      return result.response.text();
    }

    // Multi-turn conversation with history
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error Details:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    throw new Error(`Gemini API Error (${error.status || 'Unknown'}): ${error.message}`);
  }
};

/**
 * Get language-specific prompt
 * @param {string} language - Language code
 * @returns {string} Language prompt
 */
const getLanguagePrompt = (language) => {
  const languagePrompts = {
    en: 'Please respond in English.',
    hi: 'कृपया हिंदी में उत्तर दें।',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।',
    bn: 'অনুগ্রহ করে বাংলায় উত্তর দিন।',
    ta: 'தயவு செய்து தமிழில் பதிலளிக்கவும்.'
  };
  return languagePrompts[language] || languagePrompts.en;
};

/**
 * Get structured diagnosis for legacy advisory queries
 * @param {string} crop - Crop name
 * @param {string} issue - Issue description
 * @returns {Promise<{diagnosis: string, recommendation: string}>}
 */
const getDiagnosis = async (crop, issue) => {
  const prompt = `Crop: ${crop}
Issue: ${issue}

Provide a structured response with exactly these two sections:

**Diagnosis:**
Describe the likely disease, pest, or problem affecting this crop.

**Recommendation:**
Provide specific treatment steps, prevention tips, and when to consult an expert.`;

  const response = await generateResponse([{ role: 'user', content: prompt }]);

  const diagnosisMatch = response.match(/\*\*Diagnosis:\*\*\s*([\s\S]*?)(?=\*\*Recommendation:\*\*|$)/i);
  const recommendationMatch = response.match(/\*\*Recommendation:\*\*\s*([\s\S]*)/i);

  return {
    diagnosis: diagnosisMatch ? diagnosisMatch[1].trim() : response.split('\n\n')[0]?.trim() || response,
    recommendation: recommendationMatch ? recommendationMatch[1].trim() : response.split('\n\n').slice(1).join('\n\n').trim() || response
  };
};

/**
 * Analyze crop image with Gemini Vision
 * @param {string} image - Base64 encoded image
 * @param {string} userQuery - Optional user query about the image
 * @param {string} language - Language code
 * @returns {Promise<string>} Image analysis result
 */
const analyzeImage = async (image, userQuery = '', language = 'en') => {
  try {
    const model = getGenAI().getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT + '\n\n' + getLanguagePrompt(language)
    });

    const prompt = `Analyze this crop image and provide:\n1. Visible symptoms and observations\n2. Likely disease or condition\n3. Recommended treatment\n4. Prevention tips\n\n${userQuery ? `User question: ${userQuery}` : ''}`;

    // Clean Base64 image
    const cleanImage = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanImage,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Image Analysis Error Details:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    throw new Error(`Image Analysis Error (${error.status || 'Unknown'}): ${error.message}`);
  }
};

module.exports = {
  generateResponse,
  getDiagnosis,
  analyzeImage
};
