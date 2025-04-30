import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { GradeData, GradeResponse } from '../types/grades';

/**
 * 학생 성적 조회 함수
 */
export const getStudentGrades = async (studentId: string, semester?: string): Promise<GradeData[]> => {
  try {
    const response = await apiClient.get<GradeResponse>(
      API_ENDPOINTS.GRADES.GET_STUDENT_GRADES,
      { params: { studentId, semester } }
    );
    
    if (response.data.code === 20000) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || '성적 정보를 불러오는데 실패했습니다.');
  } catch (error) {
    console.error('성적 정보 조회 오류:', error);
    throw error;
  }
};

/**
 * 학생 성적 정보 업데이트하기
 */
export const updateStudentGrade = async (studentId: string, gradeData: GradeData): Promise<GradeData> => {
  try {
    const response = await apiClient.put(
      `/students/${studentId}/grades/${gradeData.id}`,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error('성적 정보 업데이트 오류:', error);
    throw error;
  }
};

/**
 * 학생 성적 정보 추가하기
 */
export const addStudentGrade = async (studentId: string, gradeData: Omit<GradeData, 'id'>): Promise<GradeData> => {
  try {
    const response = await apiClient.post(
      `/students/${studentId}/grades`,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error('성적 정보 추가 오류:', error);
    throw error;
  }
};

/**
 * 학생 성적 정보 삭제하기
 */
export const deleteStudentGrade = async (studentId: string, gradeId: string): Promise<void> => {
  try {
    await apiClient.delete(`/students/${studentId}/grades/${gradeId}`);
  } catch (error) {
    console.error('성적 정보 삭제 오류:', error);
    throw error;
  }
};

/**
 * 성적 업데이트 함수
 */
export const updateGrade = async (gradeData: GradeData): Promise<GradeResponse> => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.GRADES.UPDATE_GRADE,
      gradeData
    );
    return response.data;
  } catch (error) {
    console.error('성적 업데이트 오류:', error);
    throw error;
  }
};
