// 성적 관련 타입 정의

export interface GradeData {
  id: string;
  subject: string;
  score: number;
  grade: string;
  semester: string;
  studentId: string;
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GradeResponse {
  code: number;
  message: string;
  data?: GradeData[];
}

export interface GradeSummary {
  average: number;
  highest: number;
  lowest: number;
  totalSubjects: number;
}
