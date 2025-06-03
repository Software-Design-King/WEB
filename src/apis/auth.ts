import axios from "axios";
import { storage } from "../utils/storage";
import { UserInfo } from "../types/user";

// 기본 API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 카카오 관련 환경 변수
const KAKAO_CLIENT_ID =
  import.meta.env.VITE_KAKAO_CLIENT_ID || "5e2053f8ae5352d5fd4d7f5a8a311ce7";
const KAKAO_REDIRECT_URI =
  import.meta.env.VITE_KAKAO_REDIRECT_URI ||
  "http://localhost:5173/auth/kakao/callback";

// 로그인 응답 타입 정의
export interface LoginResponse {
  code: number;
  success: boolean;
  token?: string;
  userInfo?: UserInfo;
  needSignup?: boolean;
  message?: string;
}

// 로그인 API
// 여기서 code는 인가코드
export const login = async (code: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/login`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${code}`,
          RedirectUrl: KAKAO_REDIRECT_URI,
        },
        validateStatus: () => true, // 모든 상태 코드를 허용하여 에러가 throw되지 않게 함
      }
    );

    // 응답 로깅
    console.log("로그인 응답:", response);

    // 성공 응답 (20000)
    if (response.data.code === 20000) {
      // 백엔드에서 오는 오타 처리 (acceessToken vs accessToken)
      const accessToken =
        response.data.data.accessToken || response.data.data.acceessToken;
      const refreshToken = response.data.data.refreshToken;

      if (accessToken) {
        storage.setToken(accessToken);
        if (refreshToken) {
          storage.set("refreshToken", refreshToken);
        }

        // 서버에서 받은 사용자 정보 추출
        const serverUserInfo = response.data.data;

        // 사용자 정보 반환 - 서버에서 제공하는 값 우선 사용, 없으면 입력 데이터 사용
        return {
          code: response.data.code,
          success: true,
          token: accessToken,
          userInfo: {
            name: serverUserInfo.userName || "",
            userType: serverUserInfo.userType,
            userId: serverUserInfo.userId || 0,
            grade: serverUserInfo.grade || 0,
            classNum: serverUserInfo.classNum || 0,
            number: serverUserInfo.number || 0,
          },
        };
      }
    }

    // 401/40100 응답 (신규 사용자)
    if (response.data.code === 401 || response.data.code === 40100) {
      // 토큰은 message에 포함되어 있음
      return {
        code: response.data.code,
        success: false,
        needSignup: true,
        message:
          response.data.message ||
          (response.data.data ? response.data.data.message : null),
      };
    }

    // 기타 에러 응답
    return {
      code: response.data.code || response.status,
      success: false,
      message: response.data.message || "로그인에 실패했습니다",
    };
  } catch (error) {
    console.error("로그인 오류:", error);
    return {
      code: 500,
      success: false,
      message: "로그인 처리 중 오류가 발생했습니다",
    };
  }
};

// 로그아웃
export const logout = () => {
  storage.clearAuth();
};

// 카카오 로그인으로 리다이렉트
export const redirectToKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoAuthUrl;
};

// 카카오 콜백 처리
export const handleKakaoCallback = async (
  code: string
): Promise<LoginResponse> => {
  return login(code);
};

// 회원가입 데이터 타입
export interface SignupData {
  // 공통 필수 필드
  userType: "STUDENT" | "TEACHER" | "PARENT";
  grade: number;
  classNum: number;
  number?: number;

  // 학생/교사용 필드
  userName?: string; // 학생명 또는 교사명
  gender?: "MALE" | "FEMALE";
  birthDate?: string;
  contact?: string;

  // 학생 전용 필드
  age?: number;
  address?: string;
  parentContact?: string;

  // 학부모 전용 필드
  childName?: string; // 자녀 이름

  // 교사 전용 필드
  subject?: string; // 담당 과목

  // 학생 가입 시 선생님에게 받은 가입 코드
  enrollCode?: string;
}

// 회원가입
export const signup = async (
  userData: SignupData,
  kakaoToken: string
): Promise<LoginResponse> => {
  try {
    // 백엔드 API 형식에 맞게 데이터 변환
    const apiData = {
      ...userData,
      kakaoToken: kakaoToken, // 요청 본문에 kakaoToken 추가
    };

    // API 엔드포인트 선택 (학부모인 경우 다른 엔드포인트 사용)
    const apiEndpoint =
      userData.userType === "PARENT"
        ? `/user/enroll/parent`
        : `/user/enroll/student-teacher`;

    // 디버깅: 요청 데이터 로깅
    console.log("회원가입 API 엔드포인트:", `${API_BASE_URL}${apiEndpoint}`);
    console.log("회원가입 요청 데이터:", JSON.stringify(apiData, null, 2));
    console.log("kakaoToken:", kakaoToken);

    // 헤더에 Authorization 추가 시도
    const response = await axios.post(
      `${API_BASE_URL}${apiEndpoint}`,
      apiData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // 모든 상태 코드에 대해 응답 받기
        validateStatus: (status) => true,
      }
    );

    // 디버깅: 응답 상세 로깅
    console.log("회원가입 응답 상태:", response.status);
    console.log("회원가입 응답 헤더:", response.headers);
    console.log("회원가입 응답 데이터:", response.data);

    // 백엔드 응답 구조: { code, message, data: { accessToken, refreshToken, userId } }
    const responseData = response.data;
    const accessToken = responseData.data?.accessToken || responseData.data?.acceessToken;

    if (accessToken) {
      storage.setToken(accessToken);

      const refreshToken = responseData.data?.refreshToken;
      if (refreshToken) {
        storage.set("refreshToken", refreshToken);
      }

      // 서버에서 받은 사용자 정보 추출
      const serverUserInfo = responseData.data;

      // 사용자 정보 반환 - 서버에서 제공하는 값 우선 사용, 없으면 입력 데이터 사용
      return {
        code: responseData.code || 200,
        success: true,
        token: accessToken,
        userInfo: {
          name: serverUserInfo.userName || userData.userName || "",
          userType: serverUserInfo.userType || userData.userType,
          userId: serverUserInfo.userId || 0,
          grade: serverUserInfo.grade || userData.grade || 0,
          classNum: serverUserInfo.classNum || userData.classNum || 0,
          number: serverUserInfo.number || userData.number || 0,
        },
      };
    }

    return {
      code: 400,
      success: false,
      message: "회원가입 처리 중 오류가 발생했습니다",
    };
  } catch (error) {
    console.error("회원가입 오류:", error);
    return {
      code: 500,
      success: false,
      message: "회원가입 처리 중 오류가 발생했습니다",
    };
  }
};
