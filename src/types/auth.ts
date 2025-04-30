// 인증 관련 타입 정의

export interface LoginPayload {
  email: string;
  password: string;
  token?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  code: number;
  message: string;
  data?: {
    userName?: string;
    userType?: string;
    grade?: number;
    classNum?: number;
    acceessToken?: string; // 백엔드 오타 그대로 유지
    accessToken?: string;
    refreshToken?: string;
  };
}
