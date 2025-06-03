import { useState, useCallback } from "react";
import { UserInfo } from "../types/user";
import { storage } from "../utils/storage";
import { USER_INFO } from "../constants/auth";
import { useUserStore } from "../stores/userStore";

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
  const login = useCallback(async (token: string) => {
    try {
      setIsLoading(true); // 로그인 처리 시작
      
      // 토큰 저장
      storage.setToken(token);
      
      // 중요: info를 직접 설정하지 않고 /user/info API를 호출하여 최신 정보를 가져옵니다.
      // useUserStore에서 항상 최신 데이터를 가져올 수 있도록 기존 userInfo를 null로 설정
      const userStore = useUserStore.getState();
      userStore.setUserInfo(null); // 기존 userInfo 초기화
      
      console.log("로그인 성공 - /user/info API 호출 시작");
      // loadUserInfo를 통해 /user/info API 호출
      const fullUserInfo = await userStore.loadUserInfo(token);
      console.log("로그인 성공 - 사용자정보:", fullUserInfo);
      
      if (!fullUserInfo) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다');
      }
      
      // 가져온 최신 사용자 정보로 로컬 상태 업데이트
      // 타입을 일치시키기 위해 다음과 같이 설정합니다
      setUserInfo(fullUserInfo as unknown as UserInfo);
      
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
