import apiClient from "./apiClient";

// 피드백 정보 타입 정의
export interface Feedback {
  grade: number;
  createdAt: string;
  scoreFeed: string;
  behaviorFeed: string;
  attendanceFeed: string;
  attitudeFeed: string;
  othersFeed: string;
  sharedWithStudent: boolean;
  sharedWithParent: boolean;
}

// 피드백 목록 응답 타입
export interface GetFeedbackResponse {
  code: number;
  message: string;
  data: {
    feedbacks: Feedback[];
  };
}

// 피드백 등록 요청 타입
export interface CreateFeedbackRequest {
  scoreFeed: string;
  behaviorFeed: string;
  attendanceFeed: string;
  attitudeFeed: string;
  OthersFeed: string;
  isSharedWithStudent: boolean;
  isSharedWithParent: boolean;
}

// 피드백 등록 응답 타입
export interface CreateFeedbackResponse {
  code: number;
  message: string;
  data: Record<string, unknown>;
}

// 학생 피드백 목록 조회
export const getFeedbackList = async (
  studentId: string,
  grade: number = 0
): Promise<GetFeedbackResponse> => {
  try {
    const response = await apiClient.get<GetFeedbackResponse>(
      `/feedback/${studentId}?grade=${grade}`
    );
    return response.data;
  } catch (error) {
    console.error("피드백 목록 조회 중 오류 발생:", error);
    throw error;
  }
};

// 학생 피드백 등록
export const createFeedback = async (
  studentId: string,
  feedbackData: CreateFeedbackRequest
): Promise<CreateFeedbackResponse> => {
  try {
    const response = await apiClient.post<CreateFeedbackResponse>(
      `/feedback/${studentId}`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("피드백 등록 중 오류 발생:", error);
    throw error;
  }
};
