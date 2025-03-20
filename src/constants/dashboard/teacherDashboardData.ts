import { colors } from "../../components/common/Common.styles";

// 교사 정보
export const userData = {
  name: "김선생",
  role: "교사",
  subject: "수학",
  isHomeroom: true,
  homeroomGrade: 2,
  homeroomClass: 3,
};

// 학생 통계
export const studentStats = {
  total: 157,
  homeroom: 32,
  counselingNeeded: 5,
  absentToday: 2,
};

// 최근 상담 데이터
export const recentCounseling = [
  {
    id: 1,
    studentName: "홍길동",
    date: "2025-03-15",
    title: "진로 상담",
    content:
      "학생의 진로 희망에 대해 상담하였습니다. IT 분야에 관심이 많으며, 관련 대학 진학을 희망하고 있습니다.",
  },
  {
    id: 2,
    studentName: "김철수",
    date: "2025-03-10",
    title: "학습 상담",
    content:
      "최근 성적이 하락하고 있어 면담을 진행했습니다. 집중력 향상을 위한 방법을 논의했습니다.",
  },
  {
    id: 3,
    studentName: "이영희",
    date: "2025-03-05",
    title: "생활 상담",
    content:
      "학습 계획을 함께 수립했습니다. 자기주도적 학습 능력이 뛰어납니다.",
  },
];

// 피드백 데이터
export const recentFeedback = [
  {
    id: 1,
    studentName: "홍길동",
    category: "학습태도",
    date: "2025-03-18",
    content:
      "수업 시간에 적극적으로 참여하고 있습니다. 질문도 많이 하고 토론에도 활발하게 참여합니다.",
  },
  {
    id: 2,
    studentName: "박지민",
    category: "출결상황",
    date: "2025-03-16",
    content:
      "최근 지각이 잦아지고 있습니다. 규칙적인 생활 습관을 기르도록 지도가 필요합니다.",
  },
  {
    id: 3,
    studentName: "정민수",
    category: "과제수행",
    date: "2025-03-14",
    content:
      "과제 제출이 늦어지는 경우가 많습니다. 계획적인 시간 관리가 필요합니다.",
  },
];

// 예정된 업무
export const upcomingTasks = [
  { id: 1, title: "2학년 3반 중간고사 성적 입력", deadline: "2025-03-25" },
  { id: 2, title: "학부모 상담 준비", deadline: "2025-03-22" },
  { id: 3, title: "교과 협의회", deadline: "2025-03-20" },
];

// 학급 성적 추이 데이터
export const classPerformanceData = [
  { month: "1월", avgScore: 78 },
  { month: "2월", avgScore: 82 },
  { month: "3월", avgScore: 79 },
  { month: "4월", avgScore: 85 },
  { month: "5월", avgScore: 88 },
  { month: "6월", avgScore: 91 },
];

// 학생 출석 현황 데이터
export const attendanceData = [
  { name: "출석", value: 28 },
  { name: "결석", value: 2 },
  { name: "지각", value: 1 },
  { name: "조퇴", value: 1 },
];

// 차트 색상
export const CHART_COLORS = [
  colors.success.main,
  colors.error.main,
  colors.warning.main,
  colors.grey[400],
];

// 학생 성적 분포 데이터
export const gradeDistributionData = [
  { grade: "A+", count: 5 },
  { grade: "A", count: 7 },
  { grade: "B+", count: 9 },
  { grade: "B", count: 6 },
  { grade: "C+", count: 3 },
  { grade: "C", count: 2 },
  { grade: "D", count: 0 },
  { grade: "F", count: 0 },
];

// 담임 학급 학생 목록
export type StudentStatus = "good" | "warning" | "alert";

export const homeroomStudents = [
  {
    id: 1,
    name: "홍길동",
    number: 1,
    attendance: 98,
    averageGrade: 92,
    status: "good" as StudentStatus,
  },
  {
    id: 2,
    name: "김철수",
    number: 2,
    attendance: 85,
    averageGrade: 78,
    status: "warning" as StudentStatus,
  },
  {
    id: 3,
    name: "이영희",
    number: 3,
    attendance: 95,
    averageGrade: 88,
    status: "good" as StudentStatus,
  },
  {
    id: 4,
    name: "박지민",
    number: 4,
    attendance: 78,
    averageGrade: 72,
    status: "alert" as StudentStatus,
  },
  {
    id: 5,
    name: "정민수",
    number: 5,
    attendance: 92,
    averageGrade: 85,
    status: "good" as StudentStatus,
  },
];
