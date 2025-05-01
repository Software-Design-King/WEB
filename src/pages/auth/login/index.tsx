import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  FormField,
  FormLabel,
  FormInput,
  FormErrorText,
  SocialLoginButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalButton,
  ErrorMessage,
} from "./login.styles";
import { redirectToKakaoLogin } from "../../../apis/auth";
import { useAuth } from "../../../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  errorMessage?: string;
  redirectPath?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({
  errorMessage,
  redirectPath = "/"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAuthenticated, userInfo } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // 로케이션 스테이트에서 오류 메시지 및 리다이렉트 경로 가져오기
  useEffect(() => {
    // 이미 인증된 경우 홈으로 리다이렉트
    if (isAuthenticated && userInfo) {
      // redirectPath가 있다면 해당 경로로, 없으면 유저 타입에 따라 리다이렉트
      const targetPath = redirectPath && redirectPath !== "/" ? redirectPath : 
        userInfo.userType === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";
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
  }, [navigate, location, isAuthenticated, userInfo, errorMessage, redirectPath]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const onSubmit: SubmitHandler<LoginFormData> = () => {
    // 일반 로그인은 구현되지 않았으므로 오류 표시
    setAuthError("일반 로그인은 현재 지원되지 않습니다. 카카오 로그인을 이용해주세요.");
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>학생 관리 시스템</AuthTitle>
          <AuthSubtitle>로그인하여 시작하세요</AuthSubtitle>
        </AuthHeader>

        {/* 오류 메시지 표시 영역 */}
        {authError && (
          <ErrorMessage>
            <p>{authError}</p>
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="email">이메일</FormLabel>
            <FormInput
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              {...register("email", {
                required: "이메일은 필수 입력 항목입니다",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "유효한 이메일 주소를 입력하세요",
                },
              })}
            />
            {errors.email && (
              <FormErrorText>{errors.email.message}</FormErrorText>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="password">비밀번호</FormLabel>
            <FormInput
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password", {
                required: "비밀번호는 필수 입력 항목입니다",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
            />
            {errors.password && (
              <FormErrorText>{errors.password.message}</FormErrorText>
            )}
          </FormField>

          <SocialLoginButton type="button" onClick={redirectToKakaoLogin}>
            카카오 계정으로 로그인
          </SocialLoginButton>
        </form>
      </AuthCard>

      {/* 모달 */}
      {showModal && (
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>회원 정보 입력</ModalTitle>
              <ModalDescription>
                처음 방문하셨군요! 추가 정보를 입력해주세요.
              </ModalDescription>
            </ModalHeader>

            <ModalFooter>
              <ModalButton onClick={handleCloseModal}>닫기</ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalContainer>
      )}
    </AuthContainer>
  );
};

export default LoginPage;
