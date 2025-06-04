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
    const processedStudents = students.map(student => {
      let processed = { ...student };
      // birthDate 변환
      if (processed.birthDate) {
        if (typeof processed.birthDate === "number") {
          // 숫자(예: 20200101)가 들어온 경우 yyyy-mm-dd 문자열로 변환
          const birthNum = processed.birthDate;
          const birthStr = birthNum.toString();
          if (birthStr.length === 8) {
            // 8자리: yyyymmdd
            processed.birthDate = `${birthStr.slice(0,4)}-${birthStr.slice(4,6)}-${birthStr.slice(6,8)}`;
          } else {
            // 그 외는 Date로 변환 시도
            processed.birthDate = new Date(birthNum).toISOString().split("T")[0];
          }
        } else if (processed.birthDate instanceof Date) {
          processed.birthDate = processed.birthDate.toISOString().split("T")[0];
        }
        // 이미 yyyy-mm-dd 문자열이면 그대로 둠
      }
      // birthDate가 null/빈값이면 필드 제거
      if (!processed.birthDate) {
        delete processed.birthDate;
      }
      // 모든 null 값 필드 제거
      Object.keys(processed).forEach(key => {
        if (processed[key] === null) {
          delete processed[key];
        }
      });
      return { ...processed, enrollCode: null };

    });

    const response = await axios.post<EnrollStudentResponse>(
      `${BASE_URL}/teacher/enroll/students`,
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

    // API 응답 구조에서 data 객체 내부에 우리가 필요한 데이터가 있으므로 data.data를 반환
    console.log('불러온 원래 데이터:', response.data);
    return response.data.data; // 내부 data 객체만 반환
  } catch (error) {
    console.error("학생 보고서 데이터 조회 오류:", error);
    throw new Error("보고서 데이터를 불러오는데 실패했습니다.");
  }
};
