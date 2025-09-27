
import { GoogleGenAI, Content } from "@google/genai";
import { AIModel } from '../types';

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const modelPersonas: Record<AIModel, string> = {
  [AIModel.Gemini]: 'You are a helpful and versatile AI assistant, similar to ChatGPT. Provide clear, concise, and informative answers. Your language should be polite and professional. You are speaking Farsi.',
  [AIModel.Qwen]: 'You are a highly creative and knowledgeable AI. Your answers should be detailed, insightful, and often include creative examples or perspectives. You are speaking Farsi.',
  [AIModel.DeepSeek]: 'You are an expert AI specializing in code and technical topics. Prioritize accuracy and provide code examples when relevant. Your tone is direct and technical. You are speaking Farsi.',
  [AIModel.Grok]: 'You are an AI with a witty and slightly rebellious personality. You answer questions with a touch of humor and aren\'t afraid to be unconventional. You are speaking Farsi.',
};

export const generateResponse = async (history: Content[], model: AIModel): Promise<string> => {
  if (!ai) {
    return "کلید API یافت نشد. لطفاً مطمئن شوید که متغیر محیطی API_KEY به درستی تنظیم شده است.";
  }
  
  try {
    const geminiModel = ai.models;
    const systemInstruction = modelPersonas[model];
    
    const result = await geminiModel.generateContent({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
          systemInstruction: systemInstruction,
        }
    });

    return result.text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        return `خطا در ارتباط با Gemini: ${error.message}`;
    }
    return 'یک خطای ناشناخته در ارتباط با هوش مصنوعی رخ داد.';
  }
};
