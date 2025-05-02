// 로컬 스토리지 유틸리티
import { AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN, USER_INFO } from '../constants/auth';

export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error getting item ${key} from localStorage:`, e);
      return null;
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting item ${key} in localStorage:`, e);
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing item ${key} from localStorage:`, e);
    }
  },

  // 인증 관련 헬퍼 메서드
  getToken: () => localStorage.getItem(AUTH_ACCESS_TOKEN),
  setToken: (token: string) => localStorage.setItem(AUTH_ACCESS_TOKEN, token),
  getRefreshToken: () => localStorage.getItem(AUTH_REFRESH_TOKEN),
  setRefreshToken: (token: string) => localStorage.setItem(AUTH_REFRESH_TOKEN, token),
  getUserInfo: () => {
    const info = localStorage.getItem(USER_INFO);
    return info ? JSON.parse(info) : null;
  },
  // 로컬 스토리지에 저장하지 않고 Zustand에서만 상태 관리하도록 수정
  setUserInfo: (info: any) => {
    // localStorage에 저장하지 않음 (상태는 Zustand에서만 관리)
    console.log('사용자 정보는 로컬 스토리지에 저장되지 않습니다. Zustand로만 관리됩니다.');
  },
  clearAuth: () => {
    localStorage.removeItem(AUTH_ACCESS_TOKEN);
    localStorage.removeItem(AUTH_REFRESH_TOKEN);
    localStorage.removeItem(USER_INFO); // 기존에 저장된 데이터 제거
  }
};
