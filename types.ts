
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

export interface Conversation {
  id: string;
  title: string;
  model: AIModel;
  messages: Message[];
}
