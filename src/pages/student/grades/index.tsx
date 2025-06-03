import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import {
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";
import { getStudentScore, StudentScoreResponse } from "../../../apis/student";
import { useUserStore } from "../../../stores/userStore";

// 페이지 컨테이너
const PageContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
`;

// 섹션 타이틀
const StyledSubSectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${colors.text.primary};
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.grey[300]};
`;

// 통계 아이템 컨테이너
const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: ${colors.grey[50]};
  padding: 0.75rem 1rem;
  border-radius: 6px;
  min-width: 120px;
`;

// 통계 라벨
const StatLabel = styled.span`
  font-size: 0.85rem;
  color: ${colors.text.secondary};
`;

// 통계 값
const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 점수에 따른 색상 반환 함수
const getScoreColor = (score: number | string) => {
  if (score === "-") return "#999";

  const numScore = typeof score === "string" ? parseFloat(score) : score;
  if (isNaN(numScore)) return "#999";

  if (numScore >= 90) return colors.success.main;
  if (numScore >= 80) return colors.primary.main;
  if (numScore >= 70) return colors.warning.main;
  return colors.error.main;
};

// 성적 데이터 형식 타입
type ScoresByGrade = Record<string, Record<string, SubjectScores[]>>;

interface SubjectScores {
  subject: string;
  examType?: string;
  score: number;
  letterGrade: string;
  grade: string;
  semester: string;
}

interface TransformedScore {
  grades: ScoresByGrade;
}

// 학생 성적 데이터 형식으로 변환하는 함수
const transformScoreData = (scoreData: StudentScoreResponse | null): TransformedScore => {
  if (!scoreData || !scoreData.data || !scoreData.data.scoresByGradeAndSemester) {
    console.error("성적 데이터 형식이 올바르지 않습니다:", scoreData);
    return { grades: {} };
  }
  
  return { grades: scoreData.data.scoresByGradeAndSemester };
};

// 학기 옵션
// 초기 학기 옵션 (API 응답 후 가용 학기로 업데이트됨)
const defaultSemesterOptions = [
  "1-1학기",
  "1-2학기",
  "2-1학기",
  "2-2학기",
  "3-1학기",
  "3-2학기",
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
  const [semesterOptions, setSemesterOptions] = useState(defaultSemesterOptions);
  const [selectedSemester, setSelectedSemester] = useState(defaultSemesterOptions[0]);
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
        console.log("API 응답 데이터:", response); // 디버깅용 로그
        setScoreResponse(response);
        
        // 사용 가능한 학기 목록 업데이트
        const availableSemesters = getAvailableSemesters(response);
        if (availableSemesters.length > 0) {
          setSemesterOptions(availableSemesters);
          setSelectedSemester(availableSemesters[0]); // 첫 번째 사용 가능한 학기 선택
        }
        
        // 현재 선택된 학기에 맞는 데이터 추출
        const currentSemesterData = extractCurrentSemesterData(response, availableSemesters[0] || selectedSemester);
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
  
  // API 응답에서 사용 가능한 학기 목록 추출하는 함수
  const getAvailableSemesters = (scoreData: StudentScoreResponse | null): string[] => {
    if (!scoreData || !scoreData.data || !scoreData.data.scoresByGradeAndSemester) return [];
    
    const semesters: string[] = [];
    const grades = Object.keys(scoreData.data.scoresByGradeAndSemester);
    
    grades.forEach(grade => {
      const semestersInGrade = Object.keys(scoreData.data.scoresByGradeAndSemester[grade]);
      semestersInGrade.forEach(semester => {
        semesters.push(`${grade}-${semester}학기`);
      });
    });
    
    return semesters;
  };

  // API 응답에서 현재 학기 성적 데이터 추출하는 함수
  const extractCurrentSemesterData = (scoreData: StudentScoreResponse | null, semester: string) => {
    if (!scoreData || !scoreData.data || !scoreData.data.scoresByGradeAndSemester) {
      console.log("유효한 성적 데이터가 없습니다.");
      return [];
    }
    
    // 학기 문자열에서 학년과 학기 추출 (예: "1-1학기" -> grade="1", semesterNum="1")
    const semesterMatch = semester.match(/(\d+)-(\d+)학기/);
    if (!semesterMatch) {
      console.log("학기 형식이 올바르지 않습니다.", semester);
      return [];
    }
    
    const grade = semesterMatch[1];
    const semesterNum = semesterMatch[2];
    
    console.log(`추출 시도: 학년=${grade}, 학기=${semesterNum}`); // 디버깅용 로그
    
    // API 응답 데이터에서 해당 학년/학기 데이터 추출
    const gradeData = scoreData.data.scoresByGradeAndSemester[grade];
    if (!gradeData) {
      console.log(`${grade}학년 데이터가 없습니다.`);
      return [];
    }
    
    const semesterData = gradeData[semesterNum];
    if (!semesterData) {
      console.log(`${grade}학년 ${semesterNum}학기 데이터가 없습니다.`);
      return [];
    }
    
    console.log("학기 데이터 찾음:", semesterData); // 디버깅용 로그
    
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
        <PageContainer>
          <DashboardCard>
            <CardTitle>내 성적 조회</CardTitle>

            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <LoadingContainer>성적 정보를 불러오는 중입니다...</LoadingContainer>
              </div>
            ) : error ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                {error}
              </div>
            ) : !scoreResponse ? (
              <div style={{ padding: "2rem 0", textAlign: "center" }}>
                성적 데이터가 없습니다.
              </div>
            ) : (
              <div>
                {/* 성적 요약 섹션 */}
                <StyledSubSectionTitle>성적 요약</StyledSubSectionTitle>

                {/* 학년/학기별 요약 정보 */}
                <div style={{ marginBottom: "2rem" }}>
                  {Object.entries(transformScoreData(scoreResponse)).map(
                    ([grade, semesters]) => {
                      return Object.entries(semesters as any).map(
                        ([semester, data]) => {
                          return (
                            <div
                              key={`${grade}-${semester}`}
                              style={{
                                background: "white",
                                padding: "1rem",
                                borderRadius: "8px",
                                marginBottom: "1rem",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                              }}
                            >
                              <h3 style={{ margin: "0 0 1rem 0" }}>
                                {`${grade}학년 ${semester}학기 성적`}
                              </h3>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "2rem",
                                  flexWrap: "wrap",
                                }}
                              >
                                <StatItem>
                                  <StatLabel>평균 점수</StatLabel>
                                  <StatValue>
                                    {(data as any).averageScore?.toFixed(1) || "0"}
                                  </StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>반 석차</StatLabel>
                                  <StatValue>{(data as any).classRank || "-"}등</StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>전체 석차</StatLabel>
                                  <StatValue>{(data as any).wholeRank || "-"}등</StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>총점</StatLabel>
                                  <StatValue>{(data as any).totalScore || "-"}점</StatValue>
                                </StatItem>
                              </div>
                            </div>
                          );
                        }
                      );
                    }
                  )}
                </div>

                {/* 학기별/시험유형별 성적 테이블 */}
                <StyledSubSectionTitle>학기별 시험 성적</StyledSubSectionTitle>
                
                {Object.entries(transformScoreData(scoreResponse)).map(
                  ([grade, semesters]) => {
                    return Object.entries(semesters as any).map(
                      ([semester, data]) => {
                        return (
                          <div key={`table-${grade}-${semester}`} style={{ marginBottom: "2rem" }}>
                            <h4 style={{ margin: "1rem 0" }}>{`${grade}학년 ${semester}학기`}</h4>
                            <GradesTable>
                              <Table>
                                <TableHeader>
                                  <tr>
                                    <TableHeaderCell>과목</TableHeaderCell>
                                    <TableHeaderCell>시험 유형</TableHeaderCell>
                                    <TableHeaderCell>점수</TableHeaderCell>
                                    <TableHeaderCell>등급</TableHeaderCell>
                                  </tr>
                                </TableHeader>
                                <TableBody>
                                  {(data as any).subjects.map((subject: any, idx: number) => (
                                    <TableRow key={`${grade}-${semester}-${idx}`}>
                                      <TableCell>{subject.name}</TableCell>
                                      <TableCell>{subject.examType}</TableCell>
                                      <TableCell style={{ 
                                        color: getScoreColor(subject.score),
                                        fontWeight: 'bold'
                                      }}>
                                        {subject.score}
                                      </TableCell>
                                      <TableCell>
                                        <GradeIndicator grade={getLetterGrade(subject.score)}>
                                          {getLetterGrade(subject.score)}
                                        </GradeIndicator>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </GradesTable>
                          </div>
                        );
                      }
                    );
                  }
                )}
              </div>
            )}
          </DashboardCard>
        </PageContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentGradesPage;
