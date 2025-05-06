import React from 'react';
import styled from 'styled-components';
import { redirectToKakaoLogin } from '../../../apis/auth';

const KakaoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  background-color: #FEE500;
  color: #000000;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FFDA00;
  }
`;

const KakaoIcon = styled.span`
  margin-right: 8px;
  font-size: 18px;
`;

const KakaoLoginButton: React.FC = () => {
  const handleKakaoLogin = () => {
    redirectToKakaoLogin();
  };

  return (
    <KakaoButton onClick={handleKakaoLogin}>
      <KakaoIcon>K</KakaoIcon>
      카카오로 로그인
    </KakaoButton>
  );
};

export default KakaoLoginButton;
