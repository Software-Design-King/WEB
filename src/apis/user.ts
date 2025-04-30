import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { UserInfo } from '../types/user';

/**
 * 사용자 정보 조회 함수
 */
export const getUserInfo = async (token?: string): Promise<UserInfo> => {
  try {
    // token이 전달되면 명시적으로 헤더에 설정, 아니면 apiClient 인터셉터가 처리
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : undefined;
    
    console.log('getUserInfo 호출됨, 토큰 사용 여부:', !!token);
    const response = await apiClient.get(API_ENDPOINTS.USER.INFO, config);
    
    if (response.data.code === 20000 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Failed to get user info: " + response.data.message);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export interface StudentEnrollment {
  userName: string;
  grade: number;
  classNum: number;
  number: number;
  userType: "STUDENT";
  age: number;
  kakaoToken: string;
  address: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  contact: string;
  parentContact: string;
}

export interface TeacherEnrollment {
  userName: string;
  grade: number;
  classNum: number;
  userType: "TEACHER";
  kakaoToken: string;
}

export interface ParentEnrollment {
  userName: string;
  userType: "PARENT";
  kakaoToken: string;
  children: Array<{
    name: string;
    grade: number;
    classNum: number;
    number: number;
  }>;
}

/**
 * 학생 또는 교사 등록 함수
 */
export const enrollStudentTeacher = async (payload: StudentEnrollment | TeacherEnrollment) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.USER.ENROLL.STUDENT_TEACHER,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Student/Teacher enrollment error:", error);
    throw error;
  }
};

/**
 * 학부모 등록 함수
 */
export const enrollParent = async (payload: ParentEnrollment) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.USER.ENROLL.PARENT,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Parent enrollment error:", error);
    throw error;
  }
};
