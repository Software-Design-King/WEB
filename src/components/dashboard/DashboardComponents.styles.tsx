import styled from "@emotion/styled";
import { colors } from "../common/Common.styles";

// 대시보드 그리드 컨테이너
export const DashboardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

// 대시보드 카드
export const DashboardCard = styled.div<{ gridColumn?: string }>`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  grid-column: ${(props) => props.gridColumn || "span 4"};
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    grid-column: span 3;
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

// 카드 제목
export const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 카드 액션
export const CardAction = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

// 콘텐츠 컨테이너
export const ContentContainer = styled.div`
  padding: 0;
  width: 100%;
`;

// 차트 컨테이너
export const ChartContainer = styled.div`
  height: 250px;
  margin-bottom: 1rem;
`;

// 통계 컨테이너
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

// 통계 아이템
export const StatItem = styled.div`
  padding: 1rem;
  background-color: ${colors.grey[50]};
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// 통계 값
export const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin-bottom: 0.5rem;
`;

// 통계 레이블
export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

// 테이블 컨테이너
export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

// 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

// 테이블 헤더
export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.text.primary};
  background-color: ${colors.grey[50]};
  border-bottom: 1px solid ${colors.grey[200]};
  font-size: 0.875rem;
`;

// 테이블 셀
export const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.grey[100]};
  vertical-align: middle;
`;

// 테이블 행
export const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.grey[50]};
  }

  &:last-child td {
    border-bottom: none;
  }
`;

// 상태 뱃지
export const StatusBadge = styled.span<{
  status: "good" | "warning" | "alert";
}>`
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

// 액션 버튼 컨테이너
export const ActionButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// 액션 버튼
export const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary.light};
  }
`;
