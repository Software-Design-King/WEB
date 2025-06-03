import axios from "axios";
import { API_ENDPOINTS } from "../constants/api";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://www.software-design-king.p-e.kr";

// 출결 정보 응답 인터페이스
export interface AttendanceResponse {
  code: number;
  message: string;
  data: {
    attendanceDays: number;
    absenceDays: number;
    lateDays: number;
    earlyLeaveDays: number;
    sickLeaveDays: number;
    details: AttendanceDetail[];
  };
}

// 출결 세부 정보 인터페이스
export interface AttendanceDetail {
  date: string;
  type: "present" | "absent" | "late" | "earlyLeave" | "sickLeave";
  reason?: string;
  description?: string;
}

/**
 * 학생 출결 정보 조회
 * @param studentId 학생 ID
 */
export const getStudentAttendance = async (
  studentId: number
): Promise<AttendanceResponse> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get<AttendanceResponse>(
      `${BASE_URL}${API_ENDPOINTS.ATTENDANCE.GET_ATTENDANCE}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("출결 정보 조회 오류:", error);
    throw error;
  }
};
