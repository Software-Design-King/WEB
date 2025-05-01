import { useState, useCallback, useEffect } from 'react';
import { getUserInfo } from '../apis/user';
import { UserInfo } from '../types/user';
import { storage } from '../utils/storage';
import { USER_INFO } from '../constants/auth';

interface UseAuthReturn {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loadUserInfo: () => Promise<UserInfo | null>;
  logout: () => void;
  setUserInfo: (info: UserInfo | null) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(storage.get(USER_INFO));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getToken());

  // 사용자 정보 불러오기
  const loadUserInfo = useCallback(async (): Promise<UserInfo | null> => {
    const token = storage.getToken();
    if (!token) {
      setError('로그인이 필요합니다.');
      setIsAuthenticated(false);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const info = await getUserInfo();
      
      if (info) {
        // 사용자 정보 검증 및 필수 필드 확인
        if (!info.userType) {
          throw new Error('사용자 역할 정보가 없습니다.');
        }
        
        setUserInfo(info);
        storage.set(USER_INFO, info);
        setIsAuthenticated(true);
        return info;
      } else {
        throw new Error('사용자 정보가 없습니다.');
      }
    } catch (err) {
      console.error('사용자 정보 로드 오류:', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
      setIsAuthenticated(false);
      storage.clearAuth(); // 인증 정보 삭제
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    storage.clearAuth();
    setUserInfo(null);
    setIsAuthenticated(false);
  }, []);

  // 초기 로드 시 토큰 확인 및 만료 체크
  useEffect(() => {
    const token = storage.getToken();
    const storedInfo = storage.get(USER_INFO);
    
    // 토큰 유효성 확인을 위한 간단한 만료 체크
    const checkTokenExpiration = (): boolean => {
      const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;
      if (!tokenData || !tokenData.exp) return false;
      
      // 토큰 만료 시간과 현재 시간 비교
      const expirationTime = tokenData.exp * 1000; // 밀리초로 변환
      const currentTime = Date.now();
      
      return currentTime < expirationTime;
    };
    
    if (storedInfo && token && checkTokenExpiration()) {
      setUserInfo(storedInfo);
      setIsAuthenticated(true);
    } else if (token) {
      // 토큰이 있지만 유저 정보가 없거나 토큰이 만료된 경우
      loadUserInfo().catch(() => {
        storage.clearAuth(); // 로드 실패 시 인증 정보 삭제
        setIsAuthenticated(false);
      });
    } else {
      // 토큰이 없는 경우
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  }, [loadUserInfo]);

  return {
    userInfo,
    isLoading,
    error,
    isAuthenticated,
    loadUserInfo,
    logout,
    setUserInfo
  };
};
