import React from "react";
import { redirectToKakaoLogin } from "../../apis/auth";
import styled from "styled-components";

const KakaoButton = styled.button`
  background-color: #fee500;
  color: #000000;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
  font-weight: 500;

  &:hover {
    background-color: #e6cf00;
  }
`;

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ className }) => {
  const handleKakaoLogin = () => {
    redirectToKakaoLogin();
  };

  return (
    <KakaoButton onClick={handleKakaoLogin} className={className} type="button">
      카카오 계정으로 로그인
    </KakaoButton>
  );
};

export default KakaoLoginButton;
