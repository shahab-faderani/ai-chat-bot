import type { Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },
  async summarizeReviews(productId: number): Promise<string> {
    // get the last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');

    // send the reviews to an LLM to generate a summary
    const { text } = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt: template.replace('{{reviews}}', joinedReviews),
      temperature: 0.2,
      maxTokens: 500,
    });

    return text;
  },
};
