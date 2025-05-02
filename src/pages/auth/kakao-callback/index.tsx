import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { handleKakaoCallback } from '../../../apis/auth';
import SignupModal from '../../../components/auth/SignupModal';
import { useAuth } from '../../../hooks/useAuth';
import { useUserStore } from '../../../stores/userStore';

// 색상 변수
const colors = {
  kakaoYellow: '#FEE500',
  kakaoBlack: '#191919',
  background: '#f8f9fa',
  primary: '#4285f4',
  text: '#333333',
  textLight: '#5f6368',
  error: '#d93025',
  cardBackground: '#ffffff',
};

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 스타일 컴포넌트
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.background};
  padding: 0 20px;
`;

const LoadingCard = styled.div`
  background-color: ${colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
`;

const KakaoLogo = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${colors.kakaoYellow};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  animation: ${pulse} 2s infinite ease-in-out;
  
  &::after {
    content: '';
    width: 30px;
    height: 30px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 99.61 92.27'%3E%3Cpath d='M49.8 0C22.3 0 0 17.6 0 39.4c0 14 9.3 26.3 23.4 33.2-.8 2.8-5.1 17.9-5.3 19.4-.3 2.4 2.3.8 5.4-1.5 2.3-1.7 8.2-6.2 11.9-9 4.7.6 9.6 1 14.5 1 27.5 0 49.8-17.6 49.8-39.4C99.6 17.6 77.3 0 49.8 0' fill='%23391B1B'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(66, 133, 244, 0.1);
  border-radius: 50%;
  border-top-color: ${colors.primary};
  animation: ${spin} 1s linear infinite;
  margin-bottom: 24px;
`;

const LoadingTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 12px;
  text-align: center;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: ${colors.textLight};
  margin: 8px 0 16px;
  text-align: center;
  line-height: 1.5;
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.isError ? colors.error : colors.primary};
  margin-top: 16px;
  font-size: 14px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-image: ${props => props.isError 
      ? `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d93025' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E")` 
      : `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234285f4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/%3E%3Cpolyline points='22 4 12 14.01 9 11.01'/%3E%3C/svg%3E")`};
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const setUserInfo = useUserStore(state => state.setUserInfo);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kakaoToken, setKakaoToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('인증 처리 중...');

  useEffect(() => {
    // URL에서 인증 코드 추출
    const code = new URLSearchParams(location.search).get('code');
    if (!code) {
      setError('인증 코드가 없습니다.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // 카카오 로그인 처리
    const processKakaoLogin = async () => {
      try {
        setStatus('카카오 로그인 진행 중...');
        const response = await handleKakaoCallback(code);
        console.log('카카오 로그인 응답:', response);
        
        if (response.success && response.token && response.userInfo) {
          // 로그인 성공 - 토큰이 있는 경우
          setStatus('로그인 성공! 리다이렉팅...');
          login(response.token, response.userInfo);
          console.log("로그인 성공 - 사용자 정보:", response.userInfo);
          
          // API 응답의 UserInfo를 Zustand 포맷으로 변환
          const zustandUserInfo = {
            name: response.userInfo.name || "",
            roleInfo: response.userInfo.grade && response.userInfo.classNum 
              ? `${response.userInfo.grade}학년 ${response.userInfo.classNum}반` 
              : "",
            number: response.userInfo.number || 0,
            userType: response.userInfo.userType
          };
          
          // 변환된 형식으로 Zustand 저장소에 저장
          setUserInfo(zustandUserInfo);
          console.log("Zustand에 저장된 사용자 정보:", useUserStore.getState().userInfo);
          
          // 사용자 타입에 따른 대시보드 리다이렉션
          if (response.userInfo.userType === 'STUDENT' || response.userInfo.userType === 'PARENT') {
            navigate('/student/dashboard');
          } else {
            navigate('/teacher/dashboard');
          }
        } else if (response.needSignup && response.message) {
          // 401 응답 - 새 사용자 회원가입 필요
          console.log('신규 회원 가입 필요:', response);
          setStatus('추가 정보 입력이 필요합니다');
          
          // 토큰은 메시지 필드에 포함되어 있음
          setKakaoToken(response.message);
          setIsModalOpen(true);
        } else {
          throw new Error(response.message || '로그인 처리 중 오류가 발생했습니다.');
        }
      } catch (err) {
        console.error('카카오 로그인 처리 오류:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processKakaoLogin();
  }, [location.search, navigate, login, setUserInfo]);

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <LoadingWrapper>
        <LoadingCard>
          <KakaoLogo />
          {!error && <Spinner />}
          <LoadingTitle>
            {error ? '문제가 발생했습니다' : '카카오 로그인'}
          </LoadingTitle>
          <LoadingText>
            {error 
              ? '로그인 진행 중 문제가 발생했습니다. 잠시 후 메인 페이지로 이동합니다.' 
              : '카카오 계정으로 로그인을 진행하고 있습니다. 잠시만 기다려주세요.'}
          </LoadingText>
          <StatusMessage isError={!!error}>
            {error ? error : status}
          </StatusMessage>
        </LoadingCard>
      </LoadingWrapper>

      {isModalOpen && kakaoToken && (
        <SignupModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          kakaoToken={kakaoToken}
        />
      )}
    </>
  );
};

export default KakaoCallbackPage;
