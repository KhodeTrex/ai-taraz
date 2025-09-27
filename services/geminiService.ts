import { GoogleGenAI, Content } from "@google/genai";
import { AIModel } from '../types';

// ######################################################################
// #################### هشدار امنیتی مهم ####################
// قرار دادن کلید API به صورت مستقیم در کد، یک ریسک امنیتی بزرگ است.
// این کلید در کد نهایی برنامه شما برای کاربران قابل مشاهده خواهد بود.
// شدیداً توصیه می‌شود که از متغیرهای محیطی (Environment Variables) استفاده کنید.
//
// کلید شما در اینجا قرار داده شد.
const API_KEY = "AIzaSyAseDqoKgzH0SqLDhWtWFLEn8WojbVXhF4";
// ######################################################################


let ai: GoogleGenAI | null = null;
// تلاش برای مقداردهی اولیه سرویس هوش مصنوعی با کلید وارد شده در کد
try {
    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    } else {
        console.warn("کلید API در کد تنظیم نشده است.");
    }
} catch (e) {
    console.warn("خطا در مقداردهی اولیه GoogleGenAI. آیا کلید API معتبر است؟", e);
}


const modelPersonas: Record<AIModel, string> = {
  [AIModel.Gemini]: 'You are a helpful and versatile AI assistant, similar to ChatGPT. Provide clear, concise, and informative answers. Your language should be polite and professional. You are speaking Farsi.',
  [AIModel.Qwen]: 'You are a highly creative and knowledgeable AI. Your answers should be detailed, insightful, and often include creative examples or perspectives. You are speaking Farsi.',
  [AIModel.DeepSeek]: 'You are an expert AI specializing in code and technical topics. Prioritize accuracy and provide code examples when relevant. Your tone is direct and technical. You are speaking Farsi.',
  [AIModel.Grok]: 'You are an AI with a witty and slightly rebellious personality. You answer questions with a touch of humor and aren\'t afraid to be unconventional. You are speaking Farsi.',
};

const mockResponses: Record<AIModel, string> = {
    [AIModel.Gemini]: "این یک پاسخ شبیه‌سازی شده از Gemini است. من اینجا هستم تا به شما کمک کنم. چطور می‌توانم شما را راهنمایی کنم؟ (برای دریافت پاسخ واقعی، کلید API خود را تنظیم کنید.)",
    [AIModel.Qwen]: "این یک پاسخ شبیه‌سازی شده از Qwen است. من می‌توانم با دیدگاه‌های خلاقانه به سوالات شما پاسخ دهم. (برای دریافت پاسخ واقعی، کلید API خود را تنظیم کنید.)",
    [AIModel.DeepSeek]: "پاسخ شبیه‌سازی شده از DeepSeek: من در موضوعات فنی و کدنویسی تخصص دارم. (برای دریافت پاسخ واقعی، کلید API خود را تنظیم کنید.)",
    [AIModel.Grok]: "پاسخ شبیه‌سازی شده از Grok! من کمی شوخ‌طبع هستم. (برای دریافت پاسخ واقعی، کلید API خود را تنظیم کنید.)",
};

const generateMockResponse = (model: AIModel): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockResponses[model] || "متاسفانه مشکلی پیش آمده است.");
        }, 1000); // Simulate network delay
    });
};


export const generateResponse = async (history: Content[], model: AIModel): Promise<string> => {
  // اگر کلید API تنظیم نشده باشد، از سرویس شبیه‌سازی شده استفاده می‌شود.
  if (!ai) {
    console.log("کلید API معتبر یافت نشد. از پاسخ‌های شبیه‌سازی شده استفاده می‌شود.");
    return generateMockResponse(model);
  }
  
  // اگر کلید API تنظیم شده باشد، از Gemini API واقعی استفاده می‌شود.
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
        // ارائه یک خطای کاربرپسندتر در صورت مشکل در کلید API
        if (error.message.includes('API key not valid')) {
            return 'کلید API شما معتبر نیست. لطفاً آن را بررسی کنید.';
        }
        return `خطا در ارتباط با Gemini: ${error.message}`;
    }
    return 'یک خطای ناشناخته در ارتباط با هوش مصنوعی رخ داد.';
  }
};