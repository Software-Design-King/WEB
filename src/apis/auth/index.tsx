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

    // 상세 로깅을 위한 설정 추가
    const options = {
      headers: {
        Authorization: `${code}`,
        "Content-Type": "application/json",
        RedirectUrl: REDIRECT_URL,
      },
      // 요청 타임아웃 설정 (10초)
      timeout: 10000,
      // 오류 응답도 처리하도록 설정
      validateStatus: function (status: number) {
        // 모든 HTTP 상태 코드를 성공으로 처리 (reject하지 않음)
        return true;
      }
    };
    
    console.log("요청 옵션:", options);
    
    const response = await axios.post(
      "https://www.software-design-king.p-e.kr/user/login",
      {}, // 빈 객체 대신 명시적으로 필요한 데이터가 있다면 여기에 추가
      options
    );

    // 응답 상세 로깅
    console.log("=== 카카오 로그인 응답 시작 ===");
    console.log("상태:", response.status, response.statusText);
    console.log("헤더:", JSON.stringify(response.headers, null, 2));
    console.log("데이터 존재 여부:", !!response.data);
    console.log("데이터 타입:", typeof response.data);
    console.log("데이터 내용:", JSON.stringify(response.data, null, 2));
    console.log("=== 카카오 로그인 응답 종료 ===");

    console.log("원시 응답:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      hasData: !!response.data,
      dataType: typeof response.data
    });

    // 응답 검증
    if (!response || !response.data) {
      throw new Error("서버 응답이 유효하지 않습니다.");
    }

    // 401 응답 특별 처리 (카카오 토큰 포함)
    if (response.status === 401) {
      console.log("401 응답 특별 처리:", response.data);
      return response.data; // 401도 정상적으로 반환
    }

    // 성공적인 응답 로깅
    console.log("카카오 로그인 성공:", response.status);

    return response.data;
  } catch (error) {
    // 에러 세부 정보 로깅
    if (axios.isAxiosError(error)) {
      console.error("Axios 에러:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : '응답 없음',
        request: error.request ? '요청 있음' : '요청 없음'
      });
    } else {
      console.error("Kakao login error:", error);
    }
    throw error;
  }
};
