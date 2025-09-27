
export enum AIModel {
  Gemini = 'Gemini (ChatGPT-like)',
  Qwen = 'Qwen',
  DeepSeek = 'DeepSeek',
  Grok = 'Grok',
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
