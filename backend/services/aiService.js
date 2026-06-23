/**
 * AI Service
 * Integrates with Gemini API for crop advisory
 * Currently uses placeholder logic for Week 4
 */

const axios = require('axios');

// Placeholder AI response logic for Week 4
// In Week 5, this will be replaced with actual Gemini API integration
const getPlaceholderDiagnosis = (crop, issue) => {
  const cropIssueMap = {
    'rice': {
      'brown spots': {
        diagnosis: 'Possible fungal leaf blight (Bacterial Leaf Blight)',
        recommendation: 'Apply copper fungicide, improve drainage, avoid overhead irrigation, use resistant varieties'
      },
      'yellowing': {
        diagnosis: 'Possible nitrogen deficiency or iron deficiency',
        recommendation: 'Apply nitrogen fertilizer, check soil pH, consider iron sulfate application'
      },
      'stunted growth': {
        diagnosis: 'Possible nutrient deficiency or water stress',
        recommendation: 'Test soil nutrients, ensure proper irrigation, apply balanced NPK fertilizer'
      }
    },
    'wheat': {
      'rust': {
        diagnosis: 'Wheat rust (Puccinia triticina)',
        recommendation: 'Apply fungicides containing triazoles, remove infected plants, use resistant varieties'
      },
      'yellow spots': {
        diagnosis: 'Possible stripe rust or leaf rust',
        recommendation: 'Apply fungicide early, monitor spread, consider crop rotation'
      },
      'lodging': {
        diagnosis: 'Weak stems due to excess nitrogen or disease',
        recommendation: 'Reduce nitrogen application, use plant growth regulators, choose lodging-resistant varieties'
      }
    },
    'corn': {
      'leaf blight': {
        diagnosis: 'Northern Corn Leaf Blight',
        recommendation: 'Apply fungicide, rotate crops, use resistant hybrids, ensure proper plant spacing'
      },
      'stunted': {
        diagnosis: 'Possible nutrient deficiency or pest damage',
        recommendation: 'Test soil, apply appropriate fertilizer, check for rootworm damage'
      },
      'yellow leaves': {
        diagnosis: 'Possible nitrogen deficiency',
        recommendation: 'Apply nitrogen fertilizer, ensure proper irrigation timing'
      }
    },
    'cotton': {
      'boll rot': {
        diagnosis: 'Fungal boll rot',
        recommendation: 'Apply fungicide, improve air circulation, avoid late-season irrigation'
      },
      'leaf curl': {
        diagnosis: 'Cotton leaf curl virus',
        recommendation: 'Remove infected plants, control whitefly vectors, use resistant varieties'
      },
      'wilting': {
        diagnosis: 'Possible Fusarium wilt or water stress',
        recommendation: 'Test for Fusarium, improve drainage, ensure consistent irrigation'
      }
    }
  };

  const cropLower = crop.toLowerCase();
  const issueLower = issue.toLowerCase();

  // Check for exact matches
  if (cropIssueMap[cropLower]) {
    for (const [key, value] of Object.entries(cropIssueMap[cropLower])) {
      if (issueLower.includes(key)) {
        return value;
      }
    }
  }

  // Default response if no match found
  return {
    diagnosis: `Potential issue detected in ${crop}. Further analysis recommended.`,
    recommendation: 'Monitor the crop closely, consult local agricultural extension, consider soil testing, and review recent weather patterns. Apply appropriate preventive measures based on specific symptoms.'
  };
};

/**
 * Get AI diagnosis for crop issue
 * @param {string} crop - Crop name
 * @param {string} issue - Issue description
 * @returns {Promise<Object>} AI response with diagnosis and recommendation
 */
const getDiagnosis = async (crop, issue) => {
  try {
    // For Week 4, use placeholder logic
    // In Week 5, this will call the actual Gemini API
    const response = getPlaceholderDiagnosis(crop, issue);

    return {
      success: true,
      crop,
      issue,
      diagnosis: response.diagnosis,
      recommendation: response.recommendation
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to get AI diagnosis');
  }
};

/**
 * Future: Integration with Gemini API
 * This will be implemented in Week 5
 */
const getGeminiDiagnosis = async (crop, issue) => {
  try {
    const prompt = `As an agricultural expert, diagnose the following crop issue:
    Crop: ${crop}
    Issue: ${issue}
    
    Provide:
    1. Diagnosis
    2. Recommendation
    
    Format as JSON with keys: diagnosis, recommendation`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    // Parse and return the response
    // This will be implemented in Week 5
    return response.data;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get diagnosis from Gemini API');
  }
};

module.exports = {
  getDiagnosis,
  getGeminiDiagnosis
};
