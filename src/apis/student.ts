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
  studentId: number;
  name: string;
  studentNum?: number; // 학생 번호
  enrollCode?: string; // 학생 가입 코드
}

// 학생 상세 정보 인터페이스
export interface StudentDetailResponse {
  code: number;
  message: string;
  data: {
    name: string;
    birthDate: string;
    gender: string;
    address: string;
    contact: string;
    entranceDate: string;
    grade: number;
    classNum: number;
    number: number;
  };
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
      subjects: subjectsData,
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

/**
 * 학생 상세 정보 조회
 * @param studentId 학생 ID
 */
export const getStudentDetail = async (
  studentId: number
): Promise<StudentDetailResponse> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get<StudentDetailResponse>(
      `${BASE_URL}/student/info/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("학생 상세 정보 조회 실패:", error);
    throw error;
  }
};

// 학생 등록 요청 인터페이스
export interface EnrollStudentRequest {
  students: {
    userName: string;
    grade: number;
    classNum: number;
    number: number;
    userType: "STUDENT";
    age: number;
    address: string;
    gender: "MALE" | "FEMALE";
    birthDate: string;
    contact: string;
    parentContact: string;
  }[];
}

// 학생 등록 응답 인터페이스
export interface EnrollStudentResponse {
  code: number;
  message: string;
  data: {
    enrolledCount: number;
  };
}

/**
 * 학생 등록 (1명 이상)
 * @param students 등록할 학생 정보 배열
 */
export const enrollStudents = async (
  students: EnrollStudentRequest["students"]
): Promise<EnrollStudentResponse> => {
  const token = localStorage.getItem("token");

  try {
    // 날짜 데이터 포맷 처리 (ISO 문자열로 변환)
    const processedStudents = students.map(student => {
      // 만약 birthDate가 Date 객체이거나 날짜 형식이 아닌 경우 변환
      if (
        student.birthDate &&
        (typeof student.birthDate === "number" ||
          student.birthDate instanceof Date)
      ) {
        return {
          ...student,
          birthDate:
            typeof student.birthDate === "number"
              ? new Date(student.birthDate).toISOString().split("T")[0]
              : (student.birthDate as Date).toISOString().split("T")[0],
        };
      }
      return student;
    });

    const response = await axios.post<EnrollStudentResponse>(
      `${BASE_URL}/students/enroll`,
      {
        students: processedStudents,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `학생 등록 오류: ${error.response.status} ${error.response.data?.message || ""}`,
        { cause: error }
      );
    } else {
      throw new Error("학생 등록 중 알 수 없는 오류가 발생했습니다.", {
        cause: error,
      });
    }
  }
};

// 학생 정보 수정 요청 인터페이스
export interface UpdateStudentInfoRequest {
  name?: string;
  birthDate?: string; // yyyy-mm-dd 형식
  gender?: string; // 'MALE' 또는 'FEMALE'
  address?: string;
  contact?: string; // 연락처
  entranceDate?: string; // yyyy-mm-dd 형식
  grade?: number;
  classNum?: number;
  studentNum?: number;
}

// 학생 정보 수정 응답 인터페이스
export interface UpdateStudentInfoResponse {
  code: number;
  message: string;
  data: {
    updatedFields: string[];
  };
}

/**
 * 학생 정보 수정
 * @param studentId 학생 ID
 * @param updateData 수정할 학생 정보
 */
export const updateStudentInfo = async (
  studentId: number,
  updateData: UpdateStudentInfoRequest
): Promise<UpdateStudentInfoResponse> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${BASE_URL}/student/info/${studentId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("학생 정보 수정 오류:", error);

    // 기본 에러 응답 반환
    return {
      code: 50000,
      message: "학생 정보 수정에 실패했습니다.",
      data: {
        updatedFields: [],
      },
    };
  }
};

/**
 * 학생 보고서 PDF 다운로드
 * @param studentId 학생 ID
 * @returns Blob 형태의 PDF 데이터
 */
export const downloadStudentReportPDF = async (studentId: number): Promise<Blob> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${BASE_URL}/student/${studentId}/report/pdf`, 
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("학생 보고서 PDF 다운로드 오류:", error);
    throw new Error("PDF 생성에 실패했습니다.");
  }
};

/**
 * 학생 보고서 데이터 조회
 * @param studentId 학생 ID
 * @returns 보고서 데이터 (성적, 출석, 상담 등)
 */
export const getStudentReport = async (studentId: number): Promise<any> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${BASE_URL}/student/report/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("학생 보고서 데이터 조회 오류:", error);
    throw new Error("보고서 데이터를 불러오는데 실패했습니다.");
  }
};
