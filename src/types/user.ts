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
}

export interface UserResponse {
  code: number;
  message: string;
  data?: UserInfo;
}
