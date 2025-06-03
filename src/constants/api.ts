// API 엔드포인트 상수
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/login',
    KAKAO_CALLBACK: '/auth/kakao/callback',
  },
  USER: {
    INFO: '/user/info',
    ENROLL: {
      STUDENT_TEACHER: '/user/enroll/student-teacher',
      PARENT: '/user/enroll/parent'
    }
  },
  GRADES: {
    GET_STUDENT_GRADES: '/grades/student',  // 기존 엔드포인트 (사용하지 않음)
    UPDATE_GRADE: '/grades/update',
    // 교사용과 동일한 엔드포인트
    GET_STUDENT_SCORE: '/score', // {studentId} 형식으로 사용
  },
  ATTENDANCE: {
    GET_STUDENT_ATTENDANCE: '/attendance/student',  // 기존 엔드포인트 (사용하지 않음)
    RECORD_ATTENDANCE: '/attendance/record',
    // 교사용과 동일한 엔드포인트
    GET_ATTENDANCE: '/attendance', // {studentId} 형식으로 사용
  },
  STUDENT: {
    // 교사용과 동일한 엔드포인트
    GET_INFO: '/student/info', // {studentId} 형식으로 사용
  },
  FEEDBACK: {
    // 교사용과 동일한 엔드포인트
    GET_FEEDBACK: '/feedback', // {studentId}?grade=0 형식으로 사용
  },
  COUNSEL: {
    // 교사용과 동일한 엔드포인트
    GET_COUNSEL: '/counsel', // {studentId}?grade=0 형식으로 사용
  }
};
