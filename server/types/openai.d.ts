// Type definitions for OpenAI API

declare module 'openai/resources/chat' {
  export interface ChatCompletionSystemMessageParam {
    role: 'system';
    content: string;
  }
  
  export interface ChatCompletionUserMessageParam {
    role: 'user';
    content: string;
  }
  
  export interface ChatCompletionAssistantMessageParam {
    role: 'assistant';
    content: string;
  }
}