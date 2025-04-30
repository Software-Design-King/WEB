import React from "react";
import styled from "@emotion/styled";
import { colors } from "../common/Common.styles";

// 통계 컨테이너
const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

// 통계 아이템
const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

// 통계 값
const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin-bottom: 0.25rem;
`;

// 통계 라벨
const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

interface StudentStatsCardProps {
  total: number;
  homeroom: number;
  counselingNeeded: number;
  absentToday: number;
}

const StudentStatsCard: React.FC<StudentStatsCardProps> = ({
  total,
  homeroom,
  counselingNeeded,
  absentToday,
}) => {
  return (
    <StatsContainer>
      <StatItem>
        <StatValue>{total}</StatValue>
        <StatLabel>전체 학생</StatLabel>
      </StatItem>
      <StatItem>
        <StatValue>{homeroom}</StatValue>
        <StatLabel>담당 학생</StatLabel>
      </StatItem>
      <StatItem>
        <StatValue>{counselingNeeded}</StatValue>
        <StatLabel>상담 필요</StatLabel>
      </StatItem>
      <StatItem>
        <StatValue>{absentToday}</StatValue>
        <StatLabel>오늘 결석</StatLabel>
      </StatItem>
    </StatsContainer>
  );
};

export default StudentStatsCard;
