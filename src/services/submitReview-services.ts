import httpClient from "./api/httpClient";
interface AiReview {
  isFlagged: boolean;
  confidence: number;
  summary: string;
}
interface Review {
  rating: number;
  comment: string;
  aiReview: AiReview;
}
export interface SubmitReviewPayload {
  appointmentId: string;
  token: string;
  lawyerReview: Review;
  systemReview: Review;
}
