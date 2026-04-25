import { feedbackRepository } from '@/infrastructure/repositories/feedback-repository-impl';
import type { Feedback } from '@/domain/models';

export const submitFeedbackUseCase = async (feedbackData: Omit<Feedback, "id" | "createdAt">): Promise<Feedback> => {
  return await feedbackRepository.submitFeedback(feedbackData);
};
