import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

// 성적 데이터 관련 인터페이스 정의
interface ScoreData {
  subject: string;
  score: number;
  grade: string;
  rank?: number;
  classRank?: number;
}

interface GradeScoreData {
  averageScore: number;
  classRank: number;
  totalScore: number;
  wholeRank: number;
  subjects: ScoreData[];
}

interface StudentScores {
  scoresByGradeAndSemester: {
    [grade: string]: {
      [semester: string]: GradeScoreData;
    };
  };
}

interface StudentInfo {
  name: string;
  grade: number;
  classNum: number;
  studentId: number;
  studentNum: number;
  birthDate?: string;
  gender?: string;
  address?: string;
}

interface StudentReportScoresPageProps {
  reportData: {
    studentInfo: StudentInfo;
    studentScores: StudentScores;
  };
}

// 스타일 정의
const ReportContainer = styled.div`
  width: 210mm; /* A4 너비 */
  min-height: 297mm; /* A4 높이 */
  margin: 20px auto;
  background: white;
  padding: 20mm;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
  overflow: hidden;
  position: relative;
  page-break-after: always;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10mm;
  border-bottom: 2px solid #333;
  padding-bottom: 5mm;
`;

const SchoolLogo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

const ReportTitle = styled.h1`
  font-size: 28px;
  text-align: center;
  margin: 0;
  color: #2c3e50;
`;

const ReportDate = styled.div`
  font-size: 14px;
  color: #666;
`;

const Section = styled.div`
  margin-bottom: 10mm;
  page-break-inside: avoid;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #2c3e50;
  border-bottom: 1px solid #ddd;
  padding-bottom: 3mm;
  margin-top: 8mm;
  margin-bottom: 5mm;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 5mm;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: 500;
    width: 20%;
  }
`;

const ScoresTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: 500;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .highlight {
    background-color: #e8f4f8;
    font-weight: bold;
  }
  
  .average-row td {
    background-color: #e3f2fd;
    font-weight: bold;
  }
`;

const GradeHeader = styled.h3`
  font-size: 18px;
  color: #1976d2;
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: #e3f2fd;
  padding: 8px;
  border-radius: 5px;
`;

const SemesterTitle = styled.h4`
  font-size: 16px;
  color: #455a64;
  margin-top: 10px;
  margin-bottom: 5px;
  border-left: 4px solid #90caf9;
  padding-left: 10px;
`;

const ScoreSection = styled.div`
  margin-bottom: 15px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  color: #757575;
  font-style: italic;
  margin: 10px 0;
`;

const PageNumber = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 10mm;
`;

/**
 * 학생 성적 보고서 페이지 컴포넌트
 * 학년 및 학기별 성적 데이터를 표시합니다.
 */
const StudentReportScoresPage: React.FC<StudentReportScoresPageProps> = ({ reportData }) => {
  // reportData가 undefined일 수 있으므로 안전하게 처리
  const studentInfo = reportData?.studentInfo || {
    name: '-',
    grade: 0,
    classNum: 0,
    studentId: 0,
    studentNum: 0
  };
  
  const studentScores = reportData?.studentScores || { scoresByGradeAndSemester: {} };
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy년 MM월 dd일');

  // 성적 데이터가 있는지 확인
  const hasScoreData = studentScores && 
    studentScores.scoresByGradeAndSemester && 
    Object.keys(studentScores.scoresByGradeAndSemester).length > 0;
    
  console.log('성적 보고서 데이터:', { reportData, studentInfo, studentScores });

  return (
    <ReportContainer>
      <ReportHeader>
        <SchoolLogo>우리 학교</SchoolLogo>
        <ReportTitle>학생 성적 보고서</ReportTitle>
        <ReportDate>{formattedDate}</ReportDate>
      </ReportHeader>

      <Section>
        <SectionTitle>학생 정보</SectionTitle>
        <InfoTable>
          <tbody>
            <tr>
              <th>이름</th>
              <td>{studentInfo.name}</td>
              <th>학번</th>
              <td>{studentInfo.studentNum}</td>
            </tr>
            <tr>
              <th>학년</th>
              <td>{studentInfo.grade}학년</td>
              <th>반</th>
              <td>{studentInfo.classNum}반</td>
            </tr>
            {studentInfo.birthDate && (
              <tr>
                <th>생년월일</th>
                <td colSpan={3}>{studentInfo.birthDate}</td>
              </tr>
            )}
            {studentInfo.address && (
              <tr>
                <th>주소</th>
                <td colSpan={3}>{studentInfo.address}</td>
              </tr>
            )}
          </tbody>
        </InfoTable>
      </Section>

      <Section>
        <SectionTitle>성적 정보</SectionTitle>
        
        {!hasScoreData && (
          <NoDataMessage>성적 데이터가 없습니다.</NoDataMessage>
        )}

        {hasScoreData && (
          <>
            {Object.keys(studentScores.scoresByGradeAndSemester).sort().map((grade) => {
              const gradeData = studentScores.scoresByGradeAndSemester[grade];
              return (
                <ScoreSection key={grade}>
                  <GradeHeader>{grade}학년</GradeHeader>
                  
                  {Object.keys(gradeData).sort().map((semester) => {
                    const semesterData = gradeData[semester];
                    return (
                      <div key={`${grade}-${semester}`}>
                        <SemesterTitle>{semester}학기</SemesterTitle>
                        
                        <ScoresTable>
                          <thead>
                            <tr>
                              <th>과목</th>
                              <th>점수</th>
                              <th>등급</th>
                              <th>석차</th>
                              <th>반 석차</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semesterData.subjects.map((subject, index) => (
                              <tr key={index}>
                                <td>{subject.subject}</td>
                                <td>{subject.score}</td>
                                <td>{subject.grade}</td>
                                <td>{subject.rank || '-'}</td>
                                <td>{subject.classRank || '-'}</td>
                              </tr>
                            ))}
                            <tr className="average-row">
                              <td>평균</td>
                              <td>{semesterData.averageScore.toFixed(1)}</td>
                              <td colSpan={1}></td>
                              <td>{semesterData.wholeRank || '-'}</td>
                              <td>{semesterData.classRank || '-'}</td>
                            </tr>
                          </tbody>
                        </ScoresTable>
                      </div>
                    );
                  })}
                </ScoreSection>
              );
            })}
          </>
        )}
      </Section>

      <PageNumber>- {studentInfo.grade}학년 {studentInfo.name} 성적 보고서 -</PageNumber>
    </ReportContainer>
  );
};

export default StudentReportScoresPage;
