import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserInfo } from "../apis/user";
import { UserInfo as ApiUserInfo } from "../types/user";

// 사용자 정보 타입 정의
export interface UserInfo {
  name: string;
  roleInfo: string;
  number: number;
  userType: "STUDENT" | "TEACHER" | "PARENT" | null;
}

// API 응답에서 내부 UserInfo 형식으로 변환하는 함수
const convertApiUserInfoToInternal = (apiUserInfo: ApiUserInfo): UserInfo => {
  // 학년/반 정보를 roleInfo 문자열로 조합
  const roleInfo =
    apiUserInfo.grade && apiUserInfo.classNum
      ? `${apiUserInfo.grade}학년 ${apiUserInfo.classNum}반`
      : "";

  return {
    name: apiUserInfo.name,
    roleInfo: roleInfo,
    number: apiUserInfo.number || 0,
    userType: apiUserInfo.userType,
  };
};

// Zustand store 타입 정의
interface UserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  setUserInfo: (info: UserInfo | null) => void;
  loadUserInfo: (token: string) => Promise<UserInfo | null>;
  logout: () => void;
}

// Zustand store 생성 (로컬 스토리지에 영구 저장)
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      isLoading: false,
      error: null,

      // 사용자 정보 설정
      setUserInfo: (info) => set({ userInfo: info }),

      // 사용자 정보 로드 (API 호출)
      loadUserInfo: async (token) => {
        if (!token) {
          set({ error: "로그인이 필요합니다." });
          return null;
        }

        set({ isLoading: true, error: null });

        try {
          console.log("토큰으로 사용자 정보 조회 중:", token);
          const apiUserInfo = await getUserInfo(token);
          console.log("사용자 정보 조회 결과:", apiUserInfo);

          if (apiUserInfo) {
            const userInfo = convertApiUserInfoToInternal(apiUserInfo);
            set({ userInfo, isLoading: false });
            return userInfo;
          } else {
            throw new Error("사용자 정보가 없습니다.");
          }
        } catch (err) {
          console.error("사용자 정보 로드 오류:", err);
          set({
            error: "사용자 정보를 불러오는데 실패했습니다.",
            isLoading: false,
          });
          return null;
        }
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ userInfo: null });
      },
    }),
    {
      name: "user-storage", // 로컬 스토리지 키 이름
      partialize: (state) => ({ userInfo: state.userInfo }), // 로컬 스토리지에 저장할 부분 상태
    }
  )
);
