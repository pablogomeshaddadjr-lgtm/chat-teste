import { GoogleGenAI } from "@google/genai";

// Guidelines: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Guidelines: Assume this variable is pre-configured, valid, and accessible.
// Guidelines: Use this process.env.API_KEY string directly when initializing.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBotResponse = async (
  prompt: string, 
  context: string = "You are PromptBot, a helpful AI assistant for PromptClub."
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: context + " Keep answers concise (under 300 chars usually) and fun. Use emojis.",
      }
    });
    return response.text || "🤖 I'm speechless.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "🤖 I encountered a glitch in the matrix.";
  }
};