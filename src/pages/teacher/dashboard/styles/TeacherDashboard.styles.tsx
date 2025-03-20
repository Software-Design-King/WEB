import styled from "@emotion/styled";
import { colors } from "../../../../components/common/Common.styles";

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

// 피드백 헤더
export const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

// 피드백 학생
export const FeedbackStudent = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 피드백 날짜
export const FeedbackDate = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
`;

// 피드백 카테고리
export const FeedbackCategory = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin-bottom: 0.5rem;
`;

// 피드백 내용
export const FeedbackContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 상담 컨테이너
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

// 상담 헤더
export const CounselingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

// 상담 학생
export const CounselingStudent = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 상담 날짜
export const CounselingDate = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
`;

// 상담 내용
export const CounselingContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 상담 제목
export const CounselingTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${colors.text.primary};
`;

// 과제 상태 컨테이너
export const AssignmentStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: ${colors.grey[50]};

  &:last-child {
    margin-bottom: 0;
  }
`;

// 과제 제목
export const AssignmentTitle = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 학생 테이블
export const StudentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// 테이블 행
export const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: ${colors.grey[50]};
  }
`;

// 테이블 셀
export const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

// 테이블 헤더
export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.text.primary};
  background-color: ${colors.grey[50]};
  border-bottom: 1px solid ${colors.grey[200]};
`;

// 테이블 컨테이너
export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${colors.grey[200]};
`;

// 상태 뱃지
export const StatusBadge = styled.span<{ status: "good" | "warning" | "alert" }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;

  ${({ status }) => {
    switch (status) {
      case "good":
        return `
          background-color: ${colors.success.light};
          color: ${colors.success.dark};
        `;
      case "warning":
        return `
          background-color: ${colors.warning.light};
          color: ${colors.warning.dark};
        `;
      case "alert":
        return `
          background-color: ${colors.error.light};
          color: ${colors.error.dark};
        `;
      default:
        return "";
    }
  }}
`;
