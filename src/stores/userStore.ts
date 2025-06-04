import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserInfo } from "../apis/user";
import { UserInfo as ApiUserInfo } from "../types/user";

// 사용자 정보 타입 정의
export interface UserInfo {
  name: string;
  roleInfo: string;
  number: number | null;
  userType: "STUDENT" | "TEACHER" | "PARENT" | null;
  userId?: number;
  studentId?: number; // 학부모의 자녀 id (studentId)
}

// API 응답에서 내부 UserInfo 형식으로 변환하는 함수
const convertApiUserInfoToInternal = (apiUserInfo: ApiUserInfo): UserInfo => {
  // API 응답의 roleInfo를 직접 사용합니다.
  // 사용자께서 제공해주신 API 예시에 따르면, API 응답에 roleInfo 필드가 포함되어 있습니다.
  const directRoleInfo = apiUserInfo.roleInfo || "";

  return {
    name: apiUserInfo.name || "",
    roleInfo: directRoleInfo, // API에서 직접 받은 roleInfo 사용
    // API에서 받은 number 값을 사용합니다. 값이 없거나(undefined) null이면 null로 설정됩니다.
    // 0과 같은 유효한 숫자 값은 그대로 유지됩니다.
    number: apiUserInfo.number ?? null,
    userType: apiUserInfo.userType,
    // API에서 받은 userId 값을 그대로 사용합니다. UserInfo 인터페이스에서 userId는 optional이므로 undefined도 가능합니다.
    // 이전의 `|| 0` 로직은 userId가 0인 경우와 없는 경우를 구분할 수 없게 만들었습니다.
    userId: apiUserInfo.userId,
  };
};

// Zustand store 타입 정의
interface UserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  setUserInfo: (info: UserInfo | null) => void;
  setStudentId: (studentId: number) => void;
  loadUserInfo: (token: string) => Promise<UserInfo | null>;
  logout: () => void;
}

// Zustand store 생성 (로컬 스토리지에 영구 저장)
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoading: false,
      error: null,

      // 사용자 정보 설정
      setUserInfo: (info) => set({ userInfo: info }),

      // studentId 개별 저장 (학부모용)
      setStudentId: (studentId) => {
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, studentId } : { studentId } as UserInfo,
        }));
      },

      // 사용자 정보 로드 (API 호출)
      loadUserInfo: async (token) => {
        if (!token) {
          set({ error: "로그인이 필요합니다." });
          return null;
        }

        // 이미 로딩 중이거나 사용자 정보가 있는 경우 중복 호출 방지
        if (get().isLoading || get().userInfo) {
          return get().userInfo;
        }

        set({ isLoading: true, error: null });

        try {
          console.log("토큰으로 사용자 정보 조회 중:", token);
          const response = await getUserInfo(token);
          console.log("사용자 정보 조회 결과:", response);

          // API 응답이 있으면 내부 형식으로 변환
          if (response) {
            const userInfo = convertApiUserInfoToInternal(response);
            set({ userInfo, isLoading: false });
            return userInfo;
          }

          set({ isLoading: false, error: "사용자 정보를 찾을 수 없습니다." });
          return null;
        } catch (error) {
          console.error("사용자 정보 로드 오류:", error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "알 수 없는 오류 발생",
          });
          return null;
        }
      },

      // 로그아웃
      logout: () => {
        set({ userInfo: null });
      },
    }),
    {
      name: "user-storage", // 로컬 스토리지 저장 키
      partialize: (state) => ({ userInfo: state.userInfo }), // 유지할 상태만 지정
    }
  )
);
