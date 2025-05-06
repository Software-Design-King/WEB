import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/api";
import { GradeData, GradeResponse } from "../types/grades";

// 권도훈 학생의 성적 데이터
const kwonDohunGrades = {
  "2025-1학기": [
    { id: "1", subject: "국어", score: 92, grade: "A", rank: "5/30", semester: "2025-1학기", studentId: "12345" },
    { id: "2", subject: "영어", score: 89, grade: "B", rank: "7/30", semester: "2025-1학기", studentId: "12345" },
    { id: "3", subject: "수학", score: 95, grade: "A", rank: "3/30", semester: "2025-1학기", studentId: "12345" },
    { id: "4", subject: "과학", score: 94, grade: "A", rank: "4/30", semester: "2025-1학기", studentId: "12345" },
    { id: "5", subject: "사회", score: 88, grade: "B", rank: "8/30", semester: "2025-1학기", studentId: "12345" },
    { id: "6", subject: "음악", score: 95, grade: "A", rank: "2/30", semester: "2025-1학기", studentId: "12345" },
    { id: "7", subject: "미술", score: 90, grade: "A", rank: "6/30", semester: "2025-1학기", studentId: "12345" },
    { id: "8", subject: "체육", score: 88, grade: "B", rank: "9/30", semester: "2025-1학기", studentId: "12345" },
  ],
  "2024-2학기": [
    { id: "9", subject: "국어", score: 90, grade: "A", rank: "6/30", semester: "2024-2학기", studentId: "12345" },
    { id: "10", subject: "영어", score: 87, grade: "B", rank: "8/30", semester: "2024-2학기", studentId: "12345" },
    { id: "11", subject: "수학", score: 93, grade: "A", rank: "4/30", semester: "2024-2학기", studentId: "12345" },
    { id: "12", subject: "과학", score: 92, grade: "A", rank: "5/30", semester: "2024-2학기", studentId: "12345" },
    { id: "13", subject: "사회", score: 86, grade: "B", rank: "9/30", semester: "2024-2학기", studentId: "12345" },
    { id: "14", subject: "음악", score: 93, grade: "A", rank: "3/30", semester: "2024-2학기", studentId: "12345" },
    { id: "15", subject: "미술", score: 88, grade: "B", rank: "7/30", semester: "2024-2학기", studentId: "12345" },
    { id: "16", subject: "체육", score: 86, grade: "B", rank: "10/30", semester: "2024-2학기", studentId: "12345" },
  ],
  "2024-1학기": [
    { id: "17", subject: "국어", score: 88, grade: "B", rank: "7/30", semester: "2024-1학기", studentId: "12345" },
    { id: "18", subject: "영어", score: 85, grade: "B", rank: "9/30", semester: "2024-1학기", studentId: "12345" },
    { id: "19", subject: "수학", score: 91, grade: "A", rank: "5/30", semester: "2024-1학기", studentId: "12345" },
    { id: "20", subject: "과학", score: 90, grade: "A", rank: "6/30", semester: "2024-1학기", studentId: "12345" },
    { id: "21", subject: "사회", score: 84, grade: "B", rank: "10/30", semester: "2024-1학기", studentId: "12345" },
    { id: "22", subject: "음악", score: 92, grade: "A", rank: "4/30", semester: "2024-1학기", studentId: "12345" },
    { id: "23", subject: "미술", score: 86, grade: "B", rank: "8/30", semester: "2024-1학기", studentId: "12345" },
    { id: "24", subject: "체육", score: 85, grade: "B", rank: "11/30", semester: "2024-1학기", studentId: "12345" },
  ],
};

/**
 * 학생 성적 조회 함수
 */
export const getStudentGrades = async (
  studentId: string,
  semester?: string
): Promise<GradeData[]> => {
  // 테스트용 데이터 반환 (권도훈)
  if (studentId === "12345") {
    if (semester && kwonDohunGrades[semester]) {
      return kwonDohunGrades[semester];
    } else if (!semester) {
      // 학기가 지정되지 않은 경우 최신 학기 데이터 반환
      return kwonDohunGrades["2025-1학기"];
    }
  }

  // 실제 API 호출 (개발 중에는 사용하지 않음)
  try {
    const response = await apiClient.get<GradeResponse>(
      API_ENDPOINTS.GRADES.GET_STUDENT_GRADES,
      { params: { studentId, semester } }
    );

    if (response.data.code === 20000) {
      return response.data.data || [];
    }
    throw new Error(
      response.data.message || "성적 정보를 불러오는데 실패했습니다."
    );
  } catch (error) {
    console.error("성적 정보 조회 오류:", error);
    throw error;
  }
};

/**
 * 학생 성적 정보 업데이트하기
 */
export const updateStudentGrade = async (
  studentId: string,
  gradeData: GradeData
): Promise<GradeData> => {
  try {
    const response = await apiClient.put(
      `/students/${studentId}/grades/${gradeData.id}`,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error("성적 정보 업데이트 오류:", error);
    throw error;
  }
};

/**
 * 학생 성적 정보 추가하기
 */
export const addStudentGrade = async (
  studentId: string,
  gradeData: Omit<GradeData, "id">
): Promise<GradeData> => {
  try {
    const response = await apiClient.post(
      `/students/${studentId}/grades`,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error("성적 정보 추가 오류:", error);
    throw error;
  }
};

/**
 * 학생 성적 정보 삭제하기
 */
export const deleteStudentGrade = async (
  studentId: string,
  gradeId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/students/${studentId}/grades/${gradeId}`);
  } catch (error) {
    console.error("성적 정보 삭제 오류:", error);
    throw error;
  }
};

/**
 * 성적 업데이트 함수
 */
export const updateGrade = async (
  gradeData: GradeData
): Promise<GradeResponse> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.GRADES.UPDATE_GRADE,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error("성적 업데이트 오류:", error);
    throw error;
  }
};
