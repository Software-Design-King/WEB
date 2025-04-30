import axios from 'axios';
import { AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from '../constants/auth';
import { ROUTES } from '../constants/routes';

const BASE_URL = 'https://www.software-design-king.p-e.kr';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    // 로그인 또는 카카오 관련 엔드포인트는 다르게 처리
    const isAuthEndpoint = config.url?.includes('/user/login') || config.url?.includes('/auth/kakao');
    
    if (!isAuthEndpoint) {
      // 일반 API 요청: JWT 토큰을 Bearer 방식으로 전송
      const token = localStorage.getItem(AUTH_ACCESS_TOKEN);
      if (token) {
        // 디버깅을 위해 토큰 로깅 (앞부분만)
        console.log(`일반 API 요청 (${config.url}), Bearer 토큰 사용`);
        
        // 토큰에 Bearer 접두사 추가
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log(`API 요청 (${config.url}), 토큰 없음`);
      }
    } else {
      console.log(`인증 API 요청 (${config.url}), 기존 헤더 유지`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 디버깅을 위해 오류 로깅
    if (error.response) {
      console.error(`API 오류 (${error.config?.url}): 상태 코드 ${error.response.status}`, error.response.data);
    } else {
      console.error('API 오류 (네트워크 관련):', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_ACCESS_TOKEN);
      localStorage.removeItem(AUTH_REFRESH_TOKEN);
      localStorage.removeItem('userInfo');
      
      // 토큰 만료 알림
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
