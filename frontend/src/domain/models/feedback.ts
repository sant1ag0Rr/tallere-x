export interface Feedback {
  id: string;
  clientId: string;
  workOrderId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}
