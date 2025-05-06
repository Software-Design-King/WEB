import React, { useState, useEffect } from "react";
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
import { getStudentGrades } from "../../../apis/grades";
import { GradeData } from "../../../types/grades";

// 학기 옵션
const semesterOptions = [
  "2025-1학기",
  "2024-2학기",
  "2024-1학기",
  "2023-2학기",
];

// 로딩 상태 컴포넌트
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  font-size: 1.2rem;
  color: ${colors.text.secondary};
`;

// 성적표 컨테이너
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
    background-color: ${colors.primary.light + "33"};
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
    if (props.grade.startsWith("A")) return colors.success.light;
    if (props.grade.startsWith("B")) return colors.primary.light;
    if (props.grade.startsWith("C")) return colors.warning.light;
    return colors.error.light;
  }};
  color: ${(props) => {
    if (props.grade.startsWith("A")) return colors.success.dark;
    if (props.grade.startsWith("B")) return colors.primary.dark;
    if (props.grade.startsWith("C")) return colors.warning.dark;
    return colors.error.dark;
  }};
`;

const ChartContainer = styled.div`
  height: 350px;
  margin-top: 1rem;
`;

// 성적관리 페이지
const StudentGradesPage = () => {
  // 상태 관리
  const [selectedSemester, setSelectedSemester] = useState(semesterOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [gradesData, setGradesData] = useState<GradeData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 성적 데이터 불러오기
  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 권도훈 학생의 ID를 고정으로 사용 (테스트용)
        const data = await getStudentGrades(
          "12345", // 권도훈 학생 ID
          selectedSemester
        );
        setGradesData(data);
      } catch (err) {
        console.error("성적 정보 로드 오류:", err);
        setError("성적 정보를 불러오는데 실패했습니다.");
        // 데이터가 없는 경우 임시로 비어있는 배열 설정
        setGradesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [selectedSemester]);

  // 레이더 차트 데이터 변환
  const radarData = gradesData.map((item) => ({
    subject: item.subject,
    score: item.score,
  }));

  // 학기 변경 핸들러
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  return (
    <DashboardLayout
      userName="권도훈"
      userRole="학생"
      userInfo="2학년 3반 12번"
      notificationCount={2}
    >
      <StudentSidebar {...{ isCollapsed: false }} />

      <ContentContainer>
        <GradesContainer>
          <h1>성적 관리</h1>

          <SemesterSelector>
            <SemesterLabel>학기 선택:</SemesterLabel>
            <SemesterSelect
              value={selectedSemester}
              onChange={handleSemesterChange}
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
              {isLoading ? (
                <LoadingContainer>
                  성적 정보를 불러오는 중입니다...
                </LoadingContainer>
              ) : error ? (
                <LoadingContainer>{error}</LoadingContainer>
              ) : gradesData.length === 0 ? (
                <LoadingContainer>
                  이 학기의 성적 정보가 없습니다.
                </LoadingContainer>
              ) : (
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
                      {gradesData.map((grade, index) => (
                        <TableRow key={grade.id || index}>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.score}</TableCell>
                          <TableCell>
                            <GradeIndicator grade={grade.grade}>
                              {grade.grade}
                            </GradeIndicator>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </GradesTable>
              )}
            </DashboardCard>

            <DashboardCard gridColumn="span 4">
              <CardTitle>성적 분포도</CardTitle>
              <ChartContainer>
                {isLoading ? (
                  <LoadingContainer>
                    성적 정보를 불러오는 중입니다...
                  </LoadingContainer>
                ) : error ? (
                  <LoadingContainer>{error}</LoadingContainer>
                ) : gradesData.length === 0 ? (
                  <LoadingContainer>
                    이 학기의 성적 정보가 없습니다.
                  </LoadingContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="내 점수"
                        dataKey="score"
                        stroke={colors.primary.main}
                        fill={colors.primary.main}
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </DashboardCard>
          </DashboardGrid>
        </GradesContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentGradesPage;
