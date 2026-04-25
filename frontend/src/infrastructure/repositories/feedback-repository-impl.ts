import type { Feedback } from "@/domain/models";
import { delay } from "@/infrastructure/utils/delay";

const MOCK_FEEDBACKS: Feedback[] = [];

export const feedbackRepository = {
  async submitFeedback(data: Omit<Feedback, "id" | "createdAt">): Promise<Feedback> {
    await delay(500);
    const newFeedback: Feedback = {
      id: `fb-${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    MOCK_FEEDBACKS.push(newFeedback);
    return newFeedback;
  },

  async getFeedbackByWorkOrderId(workOrderId: string): Promise<Feedback | undefined> {
    await delay(500);
    return MOCK_FEEDBACKS.find(fb => fb.workOrderId === workOrderId);
  }
};
