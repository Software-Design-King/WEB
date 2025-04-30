//프로젝트 세팅
import axios from "axios";

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

export const login = async (payload: LoginPayload) => {
  const response = await axios.post(
    "https://www.software-design-king.p-e.kr/user/login",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${payload.token || ""}`,
        RedirectUrl:
          import.meta.env.VITE_KAKAO_REDIRECT_URL ||
          "http://localhost:5173/auth/kakao/callback",
      },
    }
  );
  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await axios.post(
    "https://www.software-design-king.p-e.kr/api/auth/register",
    payload
  );
  return response.data;
};

// Kakao 로그인 페이지로 리다이렉트하는 함수
export const redirectToKakaoLogin = () => {
  const KAKAO_CLIENT_ID = "5e2053f8ae5352d5fd4d7f5a8a311ce7";
  const REDIRECT_URI =
    import.meta.env.VITE_KAKAO_REDIRECT_URL ||
    "http://localhost:5173/auth/kakao/callback";

  // 리다이렉트 URI를 인코딩
  const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code`;

  // 디버깅을 위한 로그 추가
  console.log("카카오 로그인 URL:", kakaoAuthUrl);
  console.log("원본 리다이렉트 URI:", REDIRECT_URI);
  console.log("인코딩된 리다이렉트 URI:", encodedRedirectUri);

  window.location.href = kakaoAuthUrl;
};

// Kakao 로그인 콜백 처리 함수
export const handleKakaoCallback = async (code: string) => {
  try {
    const REDIRECT_URL =
      import.meta.env.VITE_KAKAO_REDIRECT_URL ||
      "http://localhost:5173/auth/kakao/callback";
    // 요청 전 디버깅 정보 로깅
    console.log("인증 코드로 로그인 시도:", code.substring(0, 10) + "...");
    console.log("리다이렉트 URL:", REDIRECT_URL);

    const response = await axios.post(
      "https://www.software-design-king.p-e.kr/user/login",
      {}, // 빈 객체 대신 명시적으로 필요한 데이터가 있다면 여기에 추가
      {
        headers: {
          Authorization: `${code}`,
          "Content-Type": "application/json",
          RedirectUrl: REDIRECT_URL,
        },
        // 요청 타임아웃 설정 (10초)
        timeout: 10000,
      }
    );

    // 응답 검증
    if (!response || !response.data) {
      throw new Error("서버 응답이 유효하지 않습니다.");
    }

    // 성공적인 응답 로깅
    console.log("카카오 로그인 성공:", response.status);

    return response.data;
  } catch (error) {
    // 에러 세부 정보 로깅
    if (axios.isAxiosError(error)) {
      console.error("Kakao login axios error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Kakao login error:", error);
    }
    throw error;
  }
};
