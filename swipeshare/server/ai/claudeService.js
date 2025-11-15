/**
 * ClaudeService
 * Handles all communication with Anthropic's Claude API
 */

class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
    this.requestCache = new Map(); // Cache results for 5 minutes
  }

  /**
   * Generic method to call Claude API
   * @param {string} prompt - The prompt to send
   * @param {number} maxTokens - Max tokens for response
   * @returns {Promise<string>} - Claude's response text
   */
  async callClaude(prompt, maxTokens = this.maxTokens) {
    // Check cache first
    const cacheKey = this.generateCacheKey(prompt);
    const cached = this.requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < 300000)) { // 5 min
      return cached.response;
    }

    // try to make the API call
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content[0].text;

      // Cache the result
      this.requestCache.set(cacheKey, {
        response: responseText,
        timestamp: Date.now()
      });

      return responseText;

    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  /**
   * Parse JSON from Claude's response (handles markdown code blocks)
   * @param {string} responseText - Raw response from Claude
   * @returns {Object} - Parsed JSON object
   */
  parseJSONResponse(responseText) {
    try {
      // Remove markdown code blocks if present
      let cleaned = responseText.trim();
      cleaned = cleaned.replace(/```json\n?/g, '');
      cleaned = cleaned.replace(/```\n?/g, '');
      cleaned = cleaned.trim();
      
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw response:', responseText);
      throw new Error('Failed to parse AI response');
    }
  }

  generateCacheKey(prompt) {
    // Simple hash for caching
    return prompt.substring(0, 100);
  }

  clearCache() {
    this.requestCache.clear();
  }
}

export default new ClaudeService();
