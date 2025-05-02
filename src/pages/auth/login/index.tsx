import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  SocialLoginButton,
  ErrorMessage,
  SchoolIllustration,
  WaveBackground,
  LoginContainer,
  CardContainer,
  LogoContainer,
  UniversityLogo,
  SystemTitle,
  LoginButtonContainer,
  KakaoIcon,
  FooterText,
} from "./login.styles";
import { redirectToKakaoLogin } from "../../../apis/auth";
import { useAuth } from "../../../hooks/useAuth";

interface LoginPageProps {
  errorMessage?: string;
  redirectPath?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({
  errorMessage,
  redirectPath = "/",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAuthenticated, userInfo } = useAuth();

  // 로케이션 스테이트에서 오류 메시지 및 리다이렉트 경로 가져오기
  useEffect(() => {
    // 이미 인증된 경우 홈으로 리다이렉트
    if (isAuthenticated && userInfo) {
      // redirectPath가 있다면 해당 경로로, 없으면 유저 타입에 따라 리다이렉트
      const targetPath =
        redirectPath && redirectPath !== "/"
          ? redirectPath
          : userInfo.userType === "TEACHER"
          ? "/teacher/dashboard"
          : "/student/dashboard";
      navigate(targetPath, { replace: true });
      return;
    }

    // location.state에서 오류 메시지 확인
    const state = location.state as { error?: string; from?: string } | null;
    if (state?.error) {
      setAuthError(state.error);
    } else if (errorMessage) {
      setAuthError(errorMessage);
    }

    // URL 파라미터에서 error 확인 (이전 방식과 호환성 유지)
    const urlParams = new URLSearchParams(location.search);
    const urlError = urlParams.get("error");
    if (urlError && !state?.error && !errorMessage) {
      if (urlError === "auth_required") {
        setAuthError("로그인이 필요한 페이지입니다.");
      } else if (urlError === "invalid_token") {
        setAuthError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setAuthError(urlError);
      }
    }
  }, [
    navigate,
    location,
    isAuthenticated,
    userInfo,
    errorMessage,
    redirectPath,
  ]);

  return (
    <LoginContainer>
      <WaveBackground />

      <CardContainer>
        <SchoolIllustration />

        <AuthCard>
          <LogoContainer>
            <UniversityLogo />
            <SystemTitle>인천대학교 학생 관리 시스템</SystemTitle>
          </LogoContainer>
          {/* 오류 메시지 표시 영역 */}
          {authError && (
            <ErrorMessage>
              <p>{authError}</p>
            </ErrorMessage>
          )}

          <LoginButtonContainer>
            <AuthSubtitle>카카오 계정으로 로그인하여 시작하세요</AuthSubtitle>
            <SocialLoginButton onClick={redirectToKakaoLogin}>
              <KakaoIcon />
              카카오 계정으로 로그인
            </SocialLoginButton>
          </LoginButtonContainer>

          <FooterText>
            인천대학교 학생 관리 시스템 | Software Design King
          </FooterText>
        </AuthCard>
      </CardContainer>
    </LoginContainer>
  );
};

export default LoginPage;
