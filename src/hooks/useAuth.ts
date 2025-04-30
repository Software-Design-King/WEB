import { useState, useCallback, useEffect } from 'react';
import { getUserInfo } from '../apis/user';
import { UserInfo } from '../types/user';
import { storage } from '../utils/storage';
import { AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN, USER_INFO } from '../constants/auth';

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

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const token = storage.getToken();
    const storedInfo = storage.get(USER_INFO);
    
    if (storedInfo) {
      setUserInfo(storedInfo);
      setIsAuthenticated(true);
    } else if (token) {
      // 토큰이 있지만 유저 정보가 없으면 자동 로드
      loadUserInfo();
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
