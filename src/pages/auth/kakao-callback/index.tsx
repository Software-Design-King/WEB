import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleKakaoCallback } from "../../../apis/auth";
import styled from "styled-components";
import axios, { CancelTokenSource } from "axios";
import UserInfoModal from "../../../components/auth/UserInfoModal";
import { useUserStore, UserInfo } from "../../../stores/userStore";

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f9fc;
`;

const LoadingText = styled.p`
  font-size: 18px;
  margin-top: 20px;
  color: #333;
`;

interface UserInfoSubmitData {
  userName: string;
  grade: number;
  classNum: number;
  number?: number;
  userType: string;
  age?: number;
  address?: string;
  gender?: string;
  birthDate?: string;
  contact?: string;
  parentContact?: string;
}

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kakaoToken, setKakaoToken] = useState<string>("");
  const isProcessingRef = useRef(false);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  // Zustand 상태 및 액션 가져오기
  const setUserInfo = useUserStore(state => state.setUserInfo);
  const loadUserInfo = useUserStore(state => state.loadUserInfo);

  useEffect(() => {
    const processKakaoLogin = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("이전 요청 취소");
      }
      cancelTokenSourceRef.current = axios.CancelToken.source();
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        if (!code) {
          setError("인증 코드를 찾을 수 없습니다.");
          return;
        }
        const processedCode = sessionStorage.getItem("processedKakaoCode");
        if (processedCode === code) {
          navigate("/");
          return;
        }
        sessionStorage.setItem("processedKakaoCode", code);
        const response = await handleKakaoCallback(code);
        if (response && response.code === 20000 && response.data) {
          console.log("카카오 로그인 응답 데이터:", response.data);
          // 백엔드에서 오는 오타 처리 (acceessToken vs accessToken)
          const accessToken =
            response.data.accessToken || response.data.acceessToken;
          const refreshToken = response.data.refreshToken;
          if (!accessToken) {
            console.error("토큰이 응답에 없습니다:", response.data);
            setError("로그인 처리 중 오류가 발생했습니다 (토큰 없음)");
            return;
          }
          // 토큰을 apiClient가 예상하는 키 이름으로 저장
          console.log("토큰 저장:", accessToken.substring(0, 20) + "...");
          localStorage.setItem("token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          // 반드시 최신 유저정보를 서버에서 조회 후 분기
          const token = localStorage.getItem("token");
          const userInfoResult = token ? await loadUserInfo(token) : null;
          console.log("사용자 정보 로드 완료:", userInfoResult?.userType);

          // Zustand에 사용자 정보 저장
          if (userInfoResult) {
            try {
              // 안전하게 데이터 추출
              const userName = userInfoResult.name || '사용자';
              const userType = (userInfoResult.userType || 'STUDENT') as "STUDENT" | "TEACHER" | "PARENT";
              const grade = 0;
              const classNum = 0;
              const number = typeof userInfoResult.number === 'number' ? userInfoResult.number : 0;
              
              const userInfo: UserInfo = {
                name: userName,
                roleInfo: `${grade}학년 ${classNum}반`,
                number: number,
                userType: userType
              };
              
              setUserInfo(userInfo);
              console.log("Zustand에 사용자 정보 저장:", userInfo);

              // 추가 서버 연동을 위해 토큰으로 다시 사용자 정보 로드
              const token = localStorage.getItem("token");
              if (token) {
                loadUserInfo(token);
              }
            } catch (err) {
              console.error("사용자 정보 Zustand 저장 오류:", err);
            }
          }

          // 사용자 타입에 따른 대시보드 리다이렉션
          if (userInfoResult?.userType === "STUDENT" || userInfoResult?.userType === "PARENT") {
            // 학생과 학부모는 동일한 대시보드로 이동
            navigate("/student/dashboard");
          } else if (userInfoResult?.userType === "TEACHER") {
            navigate("/teacher/dashboard");
          } else {
            // 기타 타입이나 타입이 없는 경우 홈으로
            navigate("/");
          }
          return;
        }
        if (response && response.status === 401) {
          if (response.data?.message) {
            setKakaoToken(response.data.message);
          }
          setIsModalOpen(true);
          return;
        }
        setError("로그인 처리 중 오류가 발생했습니다.");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          const tokenMessage = err.response.data?.message;
          if (tokenMessage) {
            setKakaoToken(tokenMessage);
          }
          setIsModalOpen(true);
          return;
        }
        setError("로그인 처리 중 오류가 발생했습니다.");
      } finally {
        isProcessingRef.current = false;
      }
    };
    processKakaoLogin();
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("컴포넌트 언마운트로 인한 취소");
      }
    };
  }, [location, navigate, loadUserInfo, setUserInfo]);

  // 추가정보 입력 등록 핸들러
  const handleUserInfoSubmit = async (userData: UserInfoSubmitData) => {
    try {
      let enrollUrl = "";
      if (userData.userType === "PARENT") {
        enrollUrl = "/user/enroll/parent";
      } else {
        enrollUrl = "/user/enroll/student-teacher";
      }
      const response = await axios.post(
        `https://www.software-design-king.p-e.kr${enrollUrl}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: kakaoToken,
            RedirectUrl:
              import.meta.env.VITE_KAKAO_REDIRECT_URL ||
              "http://localhost:5173/auth/kakao/callback",
          },
        }
      );
      console.log("추가 정보 제출 응답:", response.data);
      if (response.data) {
        // 백엔드에서 오는 오타 처리 (acceessToken vs accessToken)
        const accessToken =
          response.data.accessToken || response.data.acceessToken;
        if (accessToken) {
          // 토큰을 apiClient가 예상하는 키 이름으로 저장
          console.log(
            "추가 정보 후 토큰 저장:",
            accessToken.substring(0, 20) + "..."
          );
          localStorage.setItem("token", accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }
          const token = localStorage.getItem("token");
          const userInfoResult = token ? await loadUserInfo(token) : null;

          // Zustand에 사용자 정보 저장
          if (userInfoResult) {
            try {
              // 안전하게 데이터 추출
              const userName = userData.userName || '사용자';
              const userType = (userData.userType || 'STUDENT') as "STUDENT" | "TEACHER" | "PARENT";
              const grade = typeof userData.grade === 'number' ? userData.grade : 0;
              const classNum = typeof userData.classNum === 'number' ? userData.classNum : 0;
              const number = typeof userInfoResult.number === 'number' ? userInfoResult.number : 
                           (typeof userData.number === 'number' ? userData.number : 0);
              
              const userInfo: UserInfo = {
                name: userName,
                roleInfo: `${grade}학년 ${classNum}반`,
                number: number,
                userType: userType
              };
              
              setUserInfo(userInfo);
              console.log("추가 정보 후 Zustand에 사용자 정보 저장:", userInfo);

              // 추가 서버 연동을 위해 토큰으로 다시 사용자 정보 로드
              const token = localStorage.getItem("token");
              if (token) {
                loadUserInfo(token);
              }
            } catch (err) {
              console.error("추가 정보 후 사용자 정보 Zustand 저장 오류:", err);
            }
          }
          // 사용자 타입에 따른 대시보드 리다이렉션
          if (
            userData.userType === "STUDENT" ||
            userData.userType === "PARENT"
          ) {
            navigate("/student/dashboard");
          } else if (userData.userType === "TEACHER") {
            navigate("/teacher/dashboard");
          } else {
            navigate("/");
          }
          return;
        }
        throw new Error("토큰이 반환되지 않았습니다.");
      }
      throw new Error("응답 데이터가 없습니다.");
    } catch (error) {
      setError("사용자 정보 제출 중 오류가 발생했습니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  if (error) {
    return (
      <LoadingWrapper>
        <LoadingText>{error}</LoadingText>
        <button onClick={() => navigate("/login")}>
          로그인 페이지로 돌아가기
        </button>
      </LoadingWrapper>
    );
  }

  return (
    <>
      <LoadingWrapper>
        <LoadingText>카카오 로그인 처리 중...</LoadingText>
      </LoadingWrapper>

      {isModalOpen && (
        <UserInfoModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleUserInfoSubmit}
          kakaoToken={kakaoToken}
        />
      )}
    </>
  );
};

export default KakaoCallbackPage;
