import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://www.software-design-king.p-e.kr";

// 학생 목록 조회 API 응답 인터페이스
export interface StudentListResponse {
  code: number;
  message: string;
  data: {
    grade: number;
    students: Student[];
  };
}

// 학생 정보 인터페이스
export interface Student {
  id: number;
  name: string;
}

// 학생 성적 응답 인터페이스
export interface StudentScoreResponse {
  code: number;
  message: string;
  data: {
    scoresByGradeAndSemester: {
      [grade: string]: {
        [semester: string]: {
          total?: number;
          totalScore?: number;
          average?: number;
          averageScore?: number;
          wholeRank: number;
          classRank: number;
          subjects: Subject[];
        };
      };
    };
  };
}

// 과목 성적 인터페이스
export interface Subject {
  name: string;
  score: number;
  examType: string;
}

// 학생 성적 등록 요청 인터페이스
export interface RegisterScoreRequest {
  semester: number;
  subjects: {
    name: string;
    score: number;
    examType: string;
  }[];
}

// 학생 성적 등록 응답 인터페이스
export interface RegisterScoreResponse {
  code: number;
  message: string;
  data: {
    totalScore: number;
    wholeRank: number;
    classRank: number;
    subjects: Subject[];
  };
}

/**
 * 학생 목록 조회
 */
export const getStudentList = async (): Promise<StudentListResponse> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/student/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("학생 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 학생 성적 조회
 * @param studentId 학생 ID
 */
export const getStudentScore = async (
  studentId: number
): Promise<StudentScoreResponse> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get<StudentScoreResponse>(
      `${BASE_URL}/score/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("학생 성적 조회 오류:", error);
    throw error;
  }
};

/**
 * 학생 성적 등록
 * @param studentId 학생 ID
 * @param scoreData 성적 데이터
 */
export const registerStudentScore = async (
  studentId: number,
  scoreData: RegisterScoreRequest
): Promise<RegisterScoreResponse> => {
  const token = localStorage.getItem("token");

  try {
    // API 요청 세부 정보 로그
    console.log("성적 등록 API 요청:", {
      url: `${BASE_URL}/student/score/${studentId}`,
      data: scoreData,
      headers: { Authorization: `Bearer ${token}` },
    });

    // 올바른 API 엔드포인트 사용: /student/score/${studentId}
    const response = await axios.post<RegisterScoreResponse>(
      `${BASE_URL}/student/score/${studentId}`,
      scoreData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("학생 성적 등록 오류:", error);
    // 서버 응답 자세히 로그
    if (axios.isAxiosError(error) && error.response) {
      console.error("서버 응답 데이터:", error.response.data);
      console.error("서버 응답 상태 코드:", error.response.status);
    }
    throw error;
  }
};

/**
 * 학생 성적 편집
 * @param studentId 학생 ID
 * @param semester 학기 (1 또는 2)
 * @param subjectsData 과목별 성적 데이터 ([이름, 점수, 시험유형])
 */
export const editStudentScore = async (
  studentId: number,
  semester: number,
  subjectsData: Subject[]
): Promise<RegisterScoreResponse> => {
  const token = localStorage.getItem("token");

  try {
    console.log("성적 편집 API 요청:", {
      url: `${BASE_URL}/student/score/${studentId}`,
      data: { semester, subjects: subjectsData },
      headers: { Authorization: `Bearer ${token}` },
    });

    // semester를 URL 파라미터가 아닌 요청 본문에 포함시킴
    const requestData = {
      semester: semester,
      subjects: subjectsData
    };

    const response = await axios.patch<RegisterScoreResponse>(
      `${BASE_URL}/student/score/${studentId}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("학생 성적 편집 오류:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("서버 응답 데이터:", error.response.data);
      console.error("서버 응답 상태 코드:", error.response.status);
    }
    throw error;
  }
};
