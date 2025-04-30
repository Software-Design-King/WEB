import React, { useState } from "react";
import styled from "@emotion/styled";
import { Radar } from "recharts";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import {
  DashboardGrid,
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";

// 임시 유저 데이터
const userData = {
  name: "김민준",
  role: "학생",
  grade: 2,
  class: 3,
  number: 12,
};

// 임시 성적 데이터
const semesterOptions = ["2025-1학기", "2024-2학기", "2024-1학기", "2023-2학기"];

interface GradeData {
  subject: string;
  score: number;
  grade: string;
  semester: string;
}

const gradesData: GradeData[] = [
  {
    subject: "국어",
    score: 92,
    grade: "A",
    semester: "2025-1학기",
  },
  {
    subject: "수학",
    score: 88,
    grade: "B+",
    semester: "2025-1학기",
  },
  {
    subject: "영어",
    score: 95,
    grade: "A+",
    semester: "2025-1학기",
  },
  {
    subject: "과학",
    score: 90,
    grade: "A",
    semester: "2025-1학기",
  },
  {
    subject: "사회",
    score: 87,
    grade: "B+",
    semester: "2025-1학기",
  },
  {
    subject: "국어",
    score: 85,
    grade: "B+",
    semester: "2024-2학기",
  },
  {
    subject: "수학",
    score: 78,
    grade: "C+",
    semester: "2024-2학기",
  },
  {
    subject: "영어",
    score: 92,
    grade: "A",
    semester: "2024-2학기",
  },
  {
    subject: "과학",
    score: 88,
    grade: "B+",
    semester: "2024-2학기",
  },
  {
    subject: "사회",
    score: 80,
    grade: "B",
    semester: "2024-2학기",
  },
];

// 스타일 컴포넌트
const GradesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
`;

const SemesterSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SemesterLabel = styled.label`
  font-weight: 600;
  color: ${colors.text.primary};
`;

const SemesterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  font-size: 1rem;
  color: ${colors.text.primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
  }
`;

const GradesTable = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${colors.grey[100]};
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.text.primary};
  border-bottom: 1px solid ${colors.grey[300]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: ${colors.grey[50]};
  }
  
  &:hover {
    background-color: ${colors.primary.light + '33'};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.primary};
`;

const GradeIndicator = styled.span<{ grade: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.grade.startsWith('A')) return colors.success.light;
    if (props.grade.startsWith('B')) return colors.primary.light;
    if (props.grade.startsWith('C')) return colors.warning.light;
    return colors.error.light;
  }};
  color: ${(props) => {
    if (props.grade.startsWith('A')) return colors.success.dark;
    if (props.grade.startsWith('B')) return colors.primary.dark;
    if (props.grade.startsWith('C')) return colors.warning.dark;
    return colors.error.dark;
  }};
`;

const ChartContainer = styled.div`
  height: 350px;
  margin-top: 1rem;
`;

const StudentGradesPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState(semesterOptions[0]);
  
  // 선택된 학기의 성적 필터링
  const filteredGrades = gradesData.filter(
    (grade) => grade.semester === selectedSemester
  );
  
  // 차트 데이터 생성
  const chartData = filteredGrades.map((grade) => ({
    subject: grade.subject,
    '내 점수': grade.score,
    fullMark: 100,
  }));

  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.grade}학년 ${userData.class}반 ${userData.number}번`}
    >
      <StudentSidebar isCollapsed={false} />
      
      <ContentContainer>
        <GradesContainer>
          <h1>성적 관리</h1>
          
          <SemesterSelector>
            <SemesterLabel>학기 선택:</SemesterLabel>
            <SemesterSelect
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesterOptions.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </SemesterSelect>
          </SemesterSelector>
          
          <DashboardGrid>
            <DashboardCard gridColumn="span 8">
              <CardTitle>성적 목록</CardTitle>
              <GradesTable>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell>과목</TableHeaderCell>
                      <TableHeaderCell>점수</TableHeaderCell>
                      <TableHeaderCell>등급</TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((grade, index) => (
                      <TableRow key={index}>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.score}</TableCell>
                        <TableCell>
                          <GradeIndicator grade={grade.grade}>{grade.grade}</GradeIndicator>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </GradesTable>
            </DashboardCard>
            
            <DashboardCard gridColumn="span 4">
              <CardTitle>성적 분포도</CardTitle>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="내 점수"
                      dataKey="내 점수"
                      stroke={colors.primary.main}
                      fill={colors.primary.main}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </DashboardCard>
          </DashboardGrid>
        </GradesContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentGradesPage;
