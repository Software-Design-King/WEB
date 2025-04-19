import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/api";
import { AuthResponse } from "../types/auth";

/**
 * 카카오 로그인 콜백 처리
 */
export const handleKakaoCallback = async (
  code: string
): Promise<AuthResponse> => {
  try {
    const REDIRECT_URL =
      import.meta.env.VITE_KAKAO_REDIRECT_URL ||
      "http://localhost:5173/auth/kakao/callback";

    console.log("카카오 인증 코드로 로그인 시도:", code.substring(0, 10) + "...");
    
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      {}, // 빈 객체로 요청 본문 전송
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: code, // 인증 코드는 그대로 전송 (Bearer 접두사 없이)
          RedirectUrl: REDIRECT_URL,
        },
      }
    );
    console.log("카카오 로그인 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * 카카오 로그인 페이지로 리다이렉트
 */
export const redirectToKakaoLogin = () => {
  const KAKAO_CLIENT_ID = "5e2053f8ae5352d5fd4d7f5a8a311ce7";
  const REDIRECT_URI =
    import.meta.env.VITE_KAKAO_REDIRECT_URL ||
    "http://localhost:5173/auth/kakao/callback";

  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code`;

  window.location.href = kakaoAuthUrl;
};
