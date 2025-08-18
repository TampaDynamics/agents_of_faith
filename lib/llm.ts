import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LLMProvider {
  chat(messages: ChatMessage[]): Promise<ChatResponse>;
}

export class OpenAIChat implements LLMProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      // Try with newer parameter first, fallback to older if needed
      let response;
      const model = process.env.OPENAI_MODEL || 'gpt-4o';
      
      try {
        response = await this.client.chat.completions.create({
          model,
          messages,
          temperature: 0.7,
          max_completion_tokens: 2000,
          stream: false,
        });
      } catch (error: any) {
        // Fallback for older models that use max_tokens
        if (error.code === 'unsupported_parameter' && error.param === 'max_completion_tokens') {
          response = await this.client.chat.completions.create({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            stream: false,
          });
        } else {
          throw error;
        }
      }

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      return {
        content,
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error('Failed to complete chat');
    }
  }
}

// Factory function to get the appropriate LLM provider
export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  switch (provider) {
    case 'openai':
      return new OpenAIChat();
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
