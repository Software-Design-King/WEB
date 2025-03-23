import React, { useState } from "react";
import styled from "@emotion/styled";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { colors } from "../../../components/common/Common.styles";
import { userData } from "../../../constants/dashboard/teacherDashboardData";

// 학생 성적 데이터 타입
interface Student {
  id: number;
  name: string;
  grade: number;
  classNumber: number;
  studentNumber: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  studentId: number;
  subjectId: number;
  semester: string;
  score: number;
  grade: string;
}

// 더미 데이터
const students: Student[] = [
  { id: 1, name: "홍길동", grade: 2, classNumber: 3, studentNumber: 1 },
  { id: 2, name: "김철수", grade: 2, classNumber: 3, studentNumber: 2 },
  { id: 3, name: "이영희", grade: 2, classNumber: 3, studentNumber: 3 },
  { id: 4, name: "박지민", grade: 2, classNumber: 3, studentNumber: 4 },
  { id: 5, name: "정민수", grade: 2, classNumber: 3, studentNumber: 5 },
];

const subjects: Subject[] = [
  { id: 1, name: "국어" },
  { id: 2, name: "수학" },
  { id: 3, name: "영어" },
  { id: 4, name: "과학" },
  { id: 5, name: "사회" },
  { id: 6, name: "음악" },
  { id: 7, name: "미술" },
];

const grades: Grade[] = [
  { id: 1, studentId: 1, subjectId: 1, semester: "2025-1", score: 92, grade: "A" },
  { id: 2, studentId: 1, subjectId: 2, semester: "2025-1", score: 88, grade: "B+" },
  { id: 3, studentId: 1, subjectId: 3, semester: "2025-1", score: 95, grade: "A+" },
  { id: 4, studentId: 1, subjectId: 4, semester: "2025-1", score: 85, grade: "B+" },
  { id: 5, studentId: 1, subjectId: 5, semester: "2025-1", score: 90, grade: "A" },
  { id: 6, studentId: 1, subjectId: 6, semester: "2025-1", score: 98, grade: "A+" },
  { id: 7, studentId: 1, subjectId: 7, semester: "2025-1", score: 94, grade: "A" },
  
  { id: 8, studentId: 2, subjectId: 1, semester: "2025-1", score: 78, grade: "C+" },
  { id: 9, studentId: 2, subjectId: 2, semester: "2025-1", score: 82, grade: "B" },
  { id: 10, studentId: 2, subjectId: 3, semester: "2025-1", score: 75, grade: "C+" },
  { id: 11, studentId: 2, subjectId: 4, semester: "2025-1", score: 80, grade: "B" },
  { id: 12, studentId: 2, subjectId: 5, semester: "2025-1", score: 85, grade: "B+" },
  { id: 13, studentId: 2, subjectId: 6, semester: "2025-1", score: 88, grade: "B+" },
  { id: 14, studentId: 2, subjectId: 7, semester: "2025-1", score: 90, grade: "A" },
];

// 학기 목록
const semesters = ["2025-1", "2024-2", "2024-1"];

// 등급 계산 함수
const calculateGrade = (score: number): string => {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 65) return "D+";
  if (score >= 60) return "D";
  return "F";
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 2rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Card = styled.div<{ gridColumn?: string }>`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  grid-column: ${({ gridColumn }) => gridColumn || "span 12"};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  min-width: 150px;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: ${colors.primary.main};
  color: white;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${colors.primary.dark};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid ${colors.grey[300]};
  color: ${colors.text.primary};
  font-weight: 600;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.secondary};
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 80px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${colors.grey[300]};
  text-align: center;
  
  @media (max-width: 768px) {
    width: 60px;
    padding: 0.4rem;
    font-size: 0.9rem;
  }
`;

const GradeSpan = styled.span<{ grade: string }>`
  display: inline-block;
  width: 30px;
  text-align: center;
  padding: 0.25rem;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${({ grade }) => {
    if (grade.startsWith("A")) return colors.success.light;
    if (grade.startsWith("B")) return colors.info.light;
    if (grade.startsWith("C")) return colors.warning.light;
    return colors.error.light;
  }};
  color: ${({ grade }) => {
    if (grade.startsWith("A")) return colors.success.dark;
    if (grade.startsWith("B")) return colors.info.dark;
    if (grade.startsWith("C")) return colors.warning.dark;
    return colors.error.dark;
  }};
  
  @media (max-width: 768px) {
    width: 25px;
    padding: 0.2rem;
    font-size: 0.85rem;
  }
`;

const ChartContainer = styled.div`
  height: 350px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.text.secondary};
  font-style: italic;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StudentGradesPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [selectedSemester, setSelectedSemester] = useState<string>(semesters[0]);
  const [editableGrades, setEditableGrades] = useState<Grade[]>([...grades]);
  
  // 학생 성적 수정 핸들러
  const handleScoreChange = (gradeId: number, newScore: number) => {
    if (newScore < 0) newScore = 0;
    if (newScore > 100) newScore = 100;
    
    const updatedGrades = editableGrades.map(grade => {
      if (grade.id === gradeId) {
        return {
          ...grade,
          score: newScore,
          grade: calculateGrade(newScore)
        };
      }
      return grade;
    });
    
    setEditableGrades(updatedGrades);
  };
  
  // 학생별 과목별 성적 필터링
  const filteredGrades = editableGrades.filter(
    grade => 
      (selectedStudent === "" || grade.studentId === selectedStudent) && 
      grade.semester === selectedSemester
  );
  
  // 학생별 총점 및 평균 계산
  const calculateStats = (studentId: number) => {
    const studentGrades = filteredGrades.filter(grade => grade.studentId === studentId);
    const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = studentGrades.length > 0 ? totalScore / studentGrades.length : 0;
    
    return {
      total: totalScore,
      average: averageScore.toFixed(2),
      grade: calculateGrade(averageScore)
    };
  };
  
  // 레이더 차트 데이터 준비
  const getRadarChartData = (studentId: number) => {
    const studentGrades = filteredGrades.filter(grade => grade.studentId === studentId);
    
    return subjects.map(subject => {
      const grade = studentGrades.find(g => g.subjectId === subject.id);
      return {
        subject: subject.name,
        score: grade ? grade.score : 0,
      };
    });
  };
  
  // 선택된 학생 정보
  const selectedStudentData = selectedStudent !== "" 
    ? students.find(student => student.id === selectedStudent) 
    : null;
  
  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.subject} ${
        userData.isHomeroom
          ? `/ ${userData.homeroomGrade}학년 ${userData.homeroomClass}반 담임`
          : ""
      }`}
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />
      
      <PageContainer>
        <PageTitle>학생 성적 관리</PageTitle>
        
        <FilterContainer>
          <Select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">모든 학생</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.grade}학년 {student.classNumber}반 {student.studentNumber}번 {student.name}
              </option>
            ))}
          </Select>
          
          <Select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>
                {semester.split('-')[0]}년 {semester.split('-')[1]}학기
              </option>
            ))}
          </Select>
          
          <Button>성적 저장</Button>
        </FilterContainer>
        
        <ContentGrid>
          {selectedStudentData && (
            <Card gridColumn="span 12">
              <CardTitle>
                {selectedStudentData.grade}학년 {selectedStudentData.classNumber}반 {selectedStudentData.studentNumber}번 {selectedStudentData.name} 학생 성적 분석
              </CardTitle>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={getRadarChartData(selectedStudentData.id)}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="성적"
                      dataKey="score"
                      stroke={colors.primary.main}
                      fill={colors.primary.main}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          )}
          
          <Card gridColumn="span 12">
            <CardTitle>
              {selectedStudent !== "" 
                ? `${students.find(s => s.id === selectedStudent)?.name} 학생 성적표` 
                : "전체 학생 성적표"}
            </CardTitle>
            
            {filteredGrades.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>학생</Th>
                    {subjects.map(subject => (
                      <Th key={subject.id}>{subject.name}</Th>
                    ))}
                    <Th>총점</Th>
                    <Th>평균</Th>
                    <Th>등급</Th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent === "" ? (
                    // 모든 학생 표시
                    students.map(student => {
                      const stats = calculateStats(student.id);
                      return (
                        <tr key={student.id}>
                          <Td>
                            {student.grade}학년 {student.classNumber}반 {student.studentNumber}번 {student.name}
                          </Td>
                          {subjects.map(subject => {
                            const grade = filteredGrades.find(
                              g => g.studentId === student.id && g.subjectId === subject.id
                            );
                            return (
                              <Td key={`${student.id}-${subject.id}`}>
                                {grade ? (
                                  <>
                                    <Input
                                      type="number"
                                      value={grade.score}
                                      onChange={(e) => handleScoreChange(grade.id, Number(e.target.value))}
                                      min="0"
                                      max="100"
                                    />
                                    <GradeSpan grade={grade.grade}>{grade.grade}</GradeSpan>
                                  </>
                                ) : "-"}
                              </Td>
                            );
                          })}
                          <Td>{stats.total}</Td>
                          <Td>{stats.average}</Td>
                          <Td>
                            <GradeSpan grade={stats.grade}>{stats.grade}</GradeSpan>
                          </Td>
                        </tr>
                      );
                    })
                  ) : (
                    // 선택된 학생만 표시
                    (() => {
                      const student = students.find(s => s.id === selectedStudent);
                      if (!student) return null;
                      
                      const stats = calculateStats(student.id);
                      return (
                        <tr>
                          <Td>
                            {student.grade}학년 {student.classNumber}반 {student.studentNumber}번 {student.name}
                          </Td>
                          {subjects.map(subject => {
                            const grade = filteredGrades.find(
                              g => g.studentId === student.id && g.subjectId === subject.id
                            );
                            return (
                              <Td key={`${student.id}-${subject.id}`}>
                                {grade ? (
                                  <>
                                    <Input
                                      type="number"
                                      value={grade.score}
                                      onChange={(e) => handleScoreChange(grade.id, Number(e.target.value))}
                                      min="0"
                                      max="100"
                                    />
                                    <GradeSpan grade={grade.grade}>{grade.grade}</GradeSpan>
                                  </>
                                ) : "-"}
                              </Td>
                            );
                          })}
                          <Td>{stats.total}</Td>
                          <Td>{stats.average}</Td>
                          <Td>
                            <GradeSpan grade={stats.grade}>{stats.grade}</GradeSpan>
                          </Td>
                        </tr>
                      );
                    })()
                  )}
                </tbody>
              </Table>
            ) : (
              <NoDataMessage>해당 학기에 등록된 성적이 없습니다.</NoDataMessage>
            )}
          </Card>
        </ContentGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentGradesPage;
