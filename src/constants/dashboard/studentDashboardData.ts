// 학생 대시보드 더미 데이터

// 사용자 정보
export const userData = {
  name: "김학생",
  role: "학생",
  grade: 2,
  class: 3,
  number: 15,
};

// 성적 데이터
export const gradeData = [
  { subject: "국어", score: 85, grade: "B+", performance: "good" as const },
  {
    subject: "수학",
    score: 92,
    grade: "A",
    performance: "excellent" as const,
  },
  {
    subject: "영어",
    score: 78,
    grade: "C+",
    performance: "average" as const,
  },
  { subject: "과학", score: 88, grade: "B+", performance: "good" as const },
  {
    subject: "사회",
    score: 95,
    grade: "A+",
    performance: "excellent" as const,
  },
  { subject: "음악", score: 65, grade: "D", performance: "poor" as const },
];

// 전체 학생 평균 데이터
export const classAverageData = [
  { subject: "국어", average: 78 },
  { subject: "수학", average: 76 },
  { subject: "영어", average: 82 },
  { subject: "과학", average: 80 },
  { subject: "사회", average: 85 },
  { subject: "음악", average: 88 },
];

// 피드백 데이터
export const feedbackData = [
  {
    id: 1,
    category: "학습태도",
    date: "2023-05-08",
    content:
      "수업 시간에 적극적으로 참여하고 있습니다. 질문도 많이 하고 토론에도 활발하게 참여합니다.",
    teacher: "김담임",
  },
  {
    id: 2,
    category: "출결상황",
    date: "2023-05-01",
    content:
      "이번 달 출석 상황이 매우 좋습니다. 지각 없이 꾸준히 등교하고 있어 칭찬합니다.",
    teacher: "이교감",
  },
  {
    id: 3,
    category: "과제수행",
    date: "2023-04-25",
    content:
      "과제 제출이 다소 늦어지는 경우가 있습니다. 계획적인 시간 관리가 필요합니다.",
    teacher: "박과학",
  },
];

// 상담 기록 데이터
export const counselingData = [
  {
    id: 1,
    date: "2023-05-05",
    title: "진로 상담",
    content:
      "학생의 진로 희망에 대해 상담하였습니다. IT 분야에 관심이 많으며, 관련 대학 진학을 희망하고 있습니다.",
    teacher: "박진로",
  },
  {
    id: 2,
    date: "2023-04-20",
    title: "학습 상담",
    content:
      "수학 과목 성적 향상을 위한 학습 방법에 대해 상담하였습니다. 기초 개념 이해를 위한 추가 학습 자료를 제공하였습니다.",
    teacher: "이수학",
  },
  {
    id: 3,
    date: "2023-04-10",
    title: "생활 상담",
    content:
      "교우 관계에 대한 상담을 진행하였습니다. 원활한 의사소통 방법에 대해 조언하였습니다.",
    teacher: "김담임",
  },
];

// 알림 데이터
export const notificationData = [
  {
    id: 1,
    time: "1시간 전",
    content:
      "수학 1단원 시험 결과가 등록되었습니다. 성적을 확인해보세요.",
    isNew: true,
  },
  {
    id: 2,
    time: "3시간 전",
    content: "다음 주 월요일에 영어 단어 시험이 있습니다. 준비해주세요.",
    isNew: true,
  },
  {
    id: 3,
    time: "1일 전",
    content:
      "5월 20일 학부모 상담 주간이 예정되어 있습니다. 학부모님께 안내해주세요.",
    isNew: false,
  },
  {
    id: 4,
    time: "2일 전",
    content:
      "교내 체육대회가 5월 25일에 개최됩니다. 반별 대항전에 참가해주세요.",
    isNew: false,
  },
];

// 출석 데이터
export const attendanceData = {
  present: 85,
  absent: 3,
  late: 2,
  earlyLeave: 1,
};

// 출석 차트 데이터
export const getAttendanceChartData = () => [
  { name: "출석", value: attendanceData.present },
  { name: "결석", value: attendanceData.absent },
  { name: "지각", value: attendanceData.late },
  { name: "조퇴", value: attendanceData.earlyLeave },
];

// 차트 색상
export const CHART_COLORS = [
  "#4caf50", // success.main
  "#f44336", // error.main
  "#ff9800", // warning.main
  "#9e9e9e", // grey[400]
];
