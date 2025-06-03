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
import { getStudentScore, StudentScoreResponse, Subject } from "../../../apis/student";
import { useUserStore } from "../../../stores/userStore";

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
  const [scoreResponse, setScoreResponse] = useState<StudentScoreResponse | null>(null);
  const [gradesData, setGradesData] = useState<any[]>([]); // 현재 선택된 학기의 성적 데이터
  const [error, setError] = useState<string | null>(null);
  
  // Zustand에서 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);

  // 성적 데이터 불러오기
  useEffect(() => {
    const fetchGrades = async () => {
      // 사용자 정보가 없으면 요청 중단
      if (!userInfo || !userInfo.userId) {
        setError("로그인 정보를 확인할 수 없습니다.");
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        // 교사용과 동일한 API 사용: /score/{studentId}
        const response = await getStudentScore(Number(userInfo.userId));
        setScoreResponse(response);
        
        // 현재 선택된 학기에 맞는 데이터 추출
        const currentSemesterData = extractCurrentSemesterData(response, selectedSemester);
        setGradesData(currentSemesterData);
      } catch (err) {
        console.error("성적 정보 로드 오류:", err);
        setError("성적 정보를 불러오는데 실패했습니다.");
        setGradesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [userInfo]); // selectedSemester 의존성 제거 - 학기 변경은 로컬에서 처리
  
  // 학기 변경 시 로컬 데이터에서 필터링
  useEffect(() => {
    if (scoreResponse) {
      const filteredData = extractCurrentSemesterData(scoreResponse, selectedSemester);
      setGradesData(filteredData);
    }
  }, [selectedSemester, scoreResponse]);

  // 레이더 차트 데이터 변환
  const radarData = gradesData.map((item) => ({
    subject: item.subject,
    score: item.score,
  }));

  // 학기 변경 핸들러
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  // 학년/반/번호 정보 구성
  const getUserInfoText = () => {
    if (!userInfo) return "";
    
    // roleInfo("1학년 2반")에서 학년, 반 정보 추출
    const roleInfoParts = userInfo.roleInfo
      ? userInfo.roleInfo.match(/(\d+)학년\s*(\d+)반/)
      : null;
      
    const grade = roleInfoParts ? roleInfoParts[1] : "";
    const classNum = roleInfoParts ? roleInfoParts[2] : "";
    
    return `${grade}학년 ${classNum}반 ${userInfo.number || ""}번`;
  };
  
  // API 응답에서 현재 학기 성적 데이터 추출하는 함수
  const extractCurrentSemesterData = (scoreData: StudentScoreResponse | null, semester: string) => {
    if (!scoreData || !scoreData.data) return [];
    
    // 학기 문자열에서 학년과 학기 추출 (예: "2025-1학기" -> grade="2025", semesterNum="1")
    const semesterMatch = semester.match(/(\d+)-(\d+)학기/);
    if (!semesterMatch) return [];
    
    const grade = semesterMatch[1];
    const semesterNum = semesterMatch[2];
    
    // API 응답 데이터에서 해당 학년/학기 데이터 추출
    const gradeData = scoreData.data.scoresByGradeAndSemester[grade];
    if (!gradeData) return [];
    
    const semesterData = gradeData[semesterNum];
    if (!semesterData) return [];
    
    // 과목별 성적을 GradeData 형태로 변환
    return semesterData.subjects.map((subject, index) => ({
      id: String(index),
      subject: subject.name,
      score: subject.score,
      grade: getLetterGrade(subject.score),
      rank: semesterData.classRank + "/" + (semesterData.wholeRank || 30),
      semester: `${grade}-${semesterNum}학기`,
      studentId: String(userInfo?.userId || ""),
      examType: subject.examType
    }));
  };
  
  // 점수를 기반으로 등급 계산
  const getLetterGrade = (score: number): string => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || ""}
      userRole="학생"
      userInfo={getUserInfoText()}
      notificationCount={0}
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
