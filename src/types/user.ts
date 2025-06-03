// 사용자 관련 타입 정의

export interface UserInfo {
  name: string;
  userId: number;
  userType: "STUDENT" | "TEACHER" | "PARENT";
  grade?: number;
  classNum?: number;
  number?: number;
  birthDate?: string;
  address?: string;
  contact?: string;
  parentContact?: string;
  subject?: string; // 교사 담당 과목
  roleInfo?: string; // 사용자 역할 정보 (예: "1학년 1반 담임", "수학 담당", "1학년 1반")
}

export interface UserResponse {
  code: number;
  message: string;
  data?: UserInfo;
}
