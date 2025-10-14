import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

// Implementation Detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

// Public Interface
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parsResult = chatSchema.safeParse(req.body);
    if (!parsResult.success) {
      res.status(400).json({ error: parsResult.error.format() });
      return;
    }

    try {
      const { prompt, conversationId } = req.body;
      const { message } = await chatService.sendMessage(prompt, conversationId);

      res.json({ message });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      res.status(500).json({ error: 'Failed to get response from AI model' });
    }
  },
};
