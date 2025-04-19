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
    GET_STUDENT_GRADES: '/grades/student',
    UPDATE_GRADE: '/grades/update',
  },
  ATTENDANCE: {
    GET_STUDENT_ATTENDANCE: '/attendance/student',
    RECORD_ATTENDANCE: '/attendance/record',
  }
};
