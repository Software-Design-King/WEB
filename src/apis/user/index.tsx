import axios from "axios";

// 학생 정보 인터페이스
export interface StudentEnrollment {
  userName: string;
  grade: number;
  classNum: number;
  number: number;
  userType: "STUDENT";
  age: number;
  kakaoToken: string;
  address: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  contact: string;
  parentContact: string;
}

// 교사 정보 인터페이스
export interface TeacherEnrollment {
  userName: string;
  grade: number;
  classNum: number;
  userType: "TEACHER";
  kakaoToken: string;
}

// 사용자 정보 인터페이스
export interface UserInfo {
  name: string;
  userId: number;
  userType: "STUDENT" | "TEACHER" | "PARENT";
  grade?: number;
  classNum?: number;
  number?: number;
  birthDate?: string;
  address?: string;
  contact?: string;
  parentContact?: string;
}

// 학생 또는 교사 등록 통합 함수
export const enrollStudentTeacher = async (
  payload: StudentEnrollment | TeacherEnrollment
) => {
  try {
    console.log("Enrolling user:", payload);
    const response = await axios.post(
      "https://www.software-design-king.p-e.kr/user/enroll/student-teacher",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Student/Teacher enrollment error:", error);
    throw error;
  }
};

// 사용자 정보 조회 함수
export const getUserInfo = async (accessToken: string): Promise<UserInfo> => {
  try {
    const response = await axios.get(
      "https://www.software-design-king.p-e.kr/user/info",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      }
    );
    
    console.log("User info response:", response);
    
    if (response.data.code === 20000 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Failed to get user info: " + response.data.message);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};
