import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello World!' });
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' });
});

const conversations = new Map<string, string>();
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsResult = chatSchema.safeParse(req.body);
  if (!parsResult.success) {
    res.status(400).json({ error: parsResult.error.format() });
    return;
  }
  const { prompt, conversationId } = req.body;
  try {
    const { id, output_text } = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.3,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, id);
    res.json({ message: output_text });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from AI model' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
