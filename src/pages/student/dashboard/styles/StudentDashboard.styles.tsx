import styled from "@emotion/styled";
import { colors } from "../../../../components/common/Common.styles";

// 성적 요약 컨테이너
export const GradeSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 성적 차트 컨테이너
export const GradeChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  margin-bottom: 1rem;
`;

// 과목별 성적 컨테이너
export const SubjectGradesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

// 과목별 성적 카드
export const SubjectGradeCard = styled.div<{
  performance: "excellent" | "good" | "average" | "poor";
}>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${(props) => {
    switch (props.performance) {
      case "excellent":
        return `${colors.success.light}`;
      case "good":
        return `${colors.primary.light}`;
      case "average":
        return `${colors.warning.light}`;
      case "poor":
        return `${colors.error.light}`;
      default:
        return `${colors.grey[100]}`;
    }
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

// 과목명
export const SubjectName = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${colors.text.primary};
`;

// 점수
export const SubjectScore = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.text.primary};
`;

// 등급
export const SubjectGrade = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

// 상담 기록 컨테이너
export const CounselingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 상담 아이템
export const CounselingItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${colors.grey[50]};
  border-left: 4px solid ${colors.secondary.main};
`;

// 상담 날짜
export const CounselingDate = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

// 상담 제목
export const CounselingTitle = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`;

// 상담 내용
export const CounselingContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 상담 교사
export const CounselingTeacher = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-top: 0.5rem;
  font-style: italic;
`;

// 피드백 컨테이너
export const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 피드백 아이템
export const FeedbackItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${colors.grey[50]};
  border-left: 4px solid ${colors.primary.main};
`;

// 피드백 카테고리
export const FeedbackCategory = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin-bottom: 0.5rem;
`;

// 피드백 날짜
export const FeedbackDate = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

// 피드백 내용
export const FeedbackContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 피드백 교사
export const FeedbackTeacher = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-top: 0.5rem;
  font-style: italic;
`;

// 알림 컨테이너
export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 알림 아이템
export const NotificationItem = styled.div<{ isNew: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${(props) =>
    props.isNew ? `${colors.primary.light}30` : colors.grey[50]};
  border-left: 4px solid
    ${(props) => (props.isNew ? colors.primary.main : colors.grey[300])};
  position: relative;

  ${(props) =>
    props.isNew &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${colors.primary.main};
    }
  `}
`;

// 알림 시간
export const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.25rem;
`;

// 알림 내용
export const NotificationContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 출석 통계 컨테이너
export const AttendanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

// 출석 통계 아이템
export const AttendanceItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

// 출석 수치
export const AttendanceNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.text.primary};
`;

// 출석 라벨
export const AttendanceLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

// 출석 차트 컨테이너
export const AttendanceChartContainer = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
`;
