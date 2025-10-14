import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import { response } from 'express';

// Implementation Detail
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Public Interface
type ChatResponse = {
  id: string;
  message: string;
};
export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const { id, output_text: message } = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.3,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, id);

    return { id, message };
  },
};
