import apiClient from "./apiClient";

// 상담 기록 응답 인터페이스
export interface CounselRecordResponse {
  code: number;
  message: string;
  data: {
    counsels: CounselRecord[];
  };
}

// 상담 기록 인터페이스
export interface CounselRecord {
  grade: number;
  createdAt: string;
  context: string;
  plan: string;
  tags: string[];
  shared: boolean;
}

// 상담 등록 요청 인터페이스
export interface CreateCounselRequest {
  context: string;
  plan: string;
  tags: string[];
  isShared: boolean;
}

// 상담 등록 응답 인터페이스
export interface CreateCounselResponse {
  code: number;
  message: string;
  data: {
    counselId: string;
  };
}

/**
 * 학생의 상담 기록을 조회합니다.
 * @param studentId 학생 ID
 * @param grade 학년 (0은 전체 학년)
 * @returns 상담 기록 응답
 */
export const getCounselRecords = async (
  studentId: string,
  grade: number = 0
): Promise<CounselRecordResponse> => {
  try {
    const response = await apiClient.get(
      `/counsel/${studentId}?grade=${grade}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch counsel records:", error);
    throw error;
  }
};

/**
 * 학생의 상담 기록을 등록합니다.
 * @param studentId 학생 ID
 * @param counselData 상담 데이터 (context, plan, tags, isShared)
 * @returns 상담 등록 응답
 */
export const createCounselRecord = async (
  studentId: string,
  counselData: CreateCounselRequest
): Promise<CreateCounselResponse> => {
  try {
    const response = await apiClient.post(
      `/counsel/${studentId}`,
      counselData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create counsel record:", error);
    throw error;
  }
};
