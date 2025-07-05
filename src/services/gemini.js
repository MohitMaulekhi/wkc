const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const geminiService = {
    async generateResponse(prompt, conversationHistory = []) {
        if (!API_KEY) {
            throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
        }

        try {
            // Prepare the conversation context
            const systemPrompt = `You are a helpful AI assistant for the WKC (Walmart-Kinetic-Connect) platform. 
      This is an inventory management system for sellers and Walmart. 
      You can help users with:
      - Inventory management questions
      - Product categorization
      - Pricing strategies
      - Stock management
      - Platform features
      - Best practices for sellers
      
      Be concise, helpful, and professional. Keep responses under 200 words unless more detail is specifically requested.`;

            const messages = [
                { role: 'user', parts: [{ text: systemPrompt }] },
                ...conversationHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }]
                })),
                { role: 'user', parts: [{ text: prompt }] }
            ];

            const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: messages,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No response generated from Gemini API');
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    },

    // Helper method to format conversation for the API
    formatConversation(messages) {
        return messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }
}; 