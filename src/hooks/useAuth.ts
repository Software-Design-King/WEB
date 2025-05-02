import { useState, useCallback } from "react";
import { UserInfo } from "../types/user";
import { storage } from "../utils/storage";
import { USER_INFO } from "../constants/auth";

interface UseAuthReturn {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  setUserInfo: (info: UserInfo | null) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(storage.get(USER_INFO));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getToken());

  // 로그인 함수
  const login = useCallback((token: string, info: UserInfo) => {
    try {
      setIsLoading(true); // 로그인 처리 시작
      
      // 토큰 저장
      storage.setToken(token);
      // 사용자 정보 저장 (로컬 스토리지 저장 제거)
      setUserInfo(info);
      // 인증 상태 업데이트
      setIsAuthenticated(true);
      // 에러 초기화
      setError(null);
    } catch (error) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
    } finally {
      setIsLoading(false); // 로그인 처리 완료
    }
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    try {
      setIsLoading(true); // 로그아웃 처리 시작
      
      storage.clearAuth();
      setUserInfo(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError('로그아웃 처리 중 오류가 발생했습니다.');
      console.error('로그아웃 오류:', error);
    } finally {
      setIsLoading(false); // 로그아웃 처리 완료
    }
  }, []);

  return {
    userInfo,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    setUserInfo
  };
};
