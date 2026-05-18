import type { Feedback } from "@/domain/models";
import { httpClient } from "../http/httpClient";

export const feedbackRepository = {
  async submitFeedback(data: Omit<Feedback, "id" | "createdAt">): Promise<Feedback> {
    return httpClient.post<Feedback>('/feedback', data);
  },

  async getFeedbackByWorkOrderId(workOrderId: string): Promise<Feedback | undefined> {
    try {
      // Assuming you might implement this endpoint or filter via query param
      const feedbacks = await httpClient.get<Feedback[]>(`/feedback?workOrderId=${workOrderId}`);
      return feedbacks.length > 0 ? feedbacks[0] : undefined;
    } catch (e) {
      return undefined;
    }
  }
};
