import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  instructions?: string;
  temperature?: number;
  maxTokens?: number;
  previousResponseId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

export const llmClient = {
  generateText({
    model = 'gpt-4o-mini',
    prompt,
    temperature = 0.5,
    maxTokens = 150,
    instructions = '',
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    return client.responses
      .create({
        model,
        input: prompt,
        temperature,
        instructions,
        previous_response_id: previousResponseId,
        max_output_tokens: maxTokens,
      })
      .then(({ output_text, id }) => {
        return { text: output_text, id };
      });
  },
};
