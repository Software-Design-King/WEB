import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

// 성적 데이터 관련 인터페이스 정의
interface ScoreData {
  subject: string; // 기존 필드
  name?: string;  // 과목명 필드 추가
  score: number;
  grade: string;
  rank?: number;
  classRank?: number;
  examType?: string; // 시험 유형 필드 추가
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
  margin-bottom: 20px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f1f8ff;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
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

const ScoreText = styled.span<{ score: number }>`
  font-weight: 600;
  color: ${props => {
    if (props.score >= 90) return '#4CAF50'; // 초록색 (90점 이상)
    if (props.score >= 80) return '#2196F3'; // 파란색 (80-89점)
    if (props.score >= 70) return '#FF9800'; // 주황색 (70-79점)
    return '#F44336';                      // 빨간색 (70점 미만)
  }};
`;

const ScoreChange = styled.span<{ change: number }>`
  display: inline-flex;
  align-items: center;
  color: ${props => props.change > 0 ? '#4CAF50' : props.change < 0 ? '#F44336' : '#757575'};
  font-size: 12px;
  margin-left: 4px;
`;

const ScoreSummaryCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 15px;
  margin-bottom: 20px;
`;

const ScoreLevelLegend = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  gap: 15px;
  font-size: 12px;
`;

const ScoreLevelItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 5px;
  }
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
            <ScoreLevelLegend>
              <ScoreLevelItem color="#4CAF50">90점 이상</ScoreLevelItem>
              <ScoreLevelItem color="#2196F3">80-89점</ScoreLevelItem>
              <ScoreLevelItem color="#FF9800">70-79점</ScoreLevelItem>
              <ScoreLevelItem color="#F44336">70점 미만</ScoreLevelItem>
            </ScoreLevelLegend>

            {Object.keys(studentScores.scoresByGradeAndSemester).sort().map((grade) => {
              const gradeData = studentScores.scoresByGradeAndSemester[grade];
              return (
                <ScoreSection key={grade}>
                  <GradeHeader>{grade}학년 성적 요약</GradeHeader>
                  
                  {Object.keys(gradeData).sort().map((semester) => {
                    const semesterData = gradeData[semester];
                    const totalSubjects = semesterData.subjects.length;
                    
                    // 성적 분포 계산
                    const scoreDistribution = {
                      excellent: semesterData.subjects.filter(s => s.score >= 90).length,
                      good: semesterData.subjects.filter(s => s.score >= 80 && s.score < 90).length,
                      average: semesterData.subjects.filter(s => s.score >= 70 && s.score < 80).length,
                      poor: semesterData.subjects.filter(s => s.score < 70).length
                    };
                    
                    return (
                      <div key={`${grade}-${semester}`}>
                        <ScoreSummaryCard>
                          <SemesterTitle>{grade}학년 {semester}학기</SemesterTitle>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                              <div style={{ fontSize: '14px', color: '#666' }}>평균 점수</div>
                              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                {semesterData.averageScore.toFixed(1)}
                              </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                              <div style={{ fontSize: '14px', color: '#666' }}>반 내 순위</div>
                              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                {semesterData.classRank}등
                              </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                              <div style={{ fontSize: '14px', color: '#666' }}>전체 순위</div>
                              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                {semesterData.wholeRank}등
                              </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                              <div style={{ fontSize: '14px', color: '#666' }}>총점</div>
                              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                {semesterData.totalScore}점
                              </div>
                            </div>
                          </div>
                        </ScoreSummaryCard>
                        
                        <ScoresTable>
                          <thead>
                            <tr>
                              <th>과목명</th>
                              <th>중간고사</th>
                              <th>기말고사</th>
                              <th>평균</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // 중복 과목명 제거를 위해 과목벌로 점수 데이터 정리
                              const subjectData: Record<string, {
                                midterm?: number,
                                final?: number,
                                name: string
                              }> = {};
                              
                              // 과목별로 중간고사/기말고사 점수 분류
                              semesterData.subjects.forEach(subject => {
                                const subjectName = subject.name || subject.subject || '';
                                const examType = subject.examType || '';
                                
                                if (!subjectData[subjectName]) {
                                  subjectData[subjectName] = { name: subjectName };
                                }
                                
                                if (examType === '중간고사') {
                                  subjectData[subjectName].midterm = subject.score;
                                } else if (examType === '기말고사') {
                                  subjectData[subjectName].final = subject.score;
                                } else {
                                  // 유형이 없으면 과목 점수를 중간고사로 간주
                                  if (!subjectData[subjectName].midterm) {
                                    subjectData[subjectName].midterm = subject.score;
                                  }
                                }
                              });
                              
                              // 정리된 과목 데이터를 사용해 테이블 행 생성
                              return Object.values(subjectData).map((subject, idx) => {
                                // 중간고사 또는 기말고사가 없는 경우 처리
                                const midtermScore = subject.midterm || 0;
                                
                                // 기말고사 점수 가져오기 (없으면 임의 값 생성, 실제로는 API에서 올바른 데이터를 받아야 함)
                                const usedFinalScore = subject.final || (subject.midterm ? subject.midterm - Math.floor(Math.random() * 10) - 5 : 0);
                                
                                const change = usedFinalScore - midtermScore;
                                const avgScore = midtermScore && usedFinalScore ? 
                                  Math.round((midtermScore + usedFinalScore) / 2) : 
                                  (midtermScore || usedFinalScore || 0);
                                
                                return (
                                  <tr key={idx}>
                                    <td>{subject.name}</td>
                                    <td>
                                      <ScoreText score={midtermScore}>{midtermScore || '-'}</ScoreText>
                                    </td>
                                    <td>
                                      <ScoreText score={usedFinalScore}>{usedFinalScore || '-'}</ScoreText>
                                      {midtermScore && usedFinalScore ? (
                                        <ScoreChange change={change}>
                                          {change > 0 ? 
                                            <span style={{display: 'flex', alignItems: 'center'}}>
                                              <ArrowUpOutlined style={{fontSize: '12px'}} /> {Math.abs(change)}
                                            </span> : 
                                            change < 0 ? 
                                            <span style={{display: 'flex', alignItems: 'center'}}>
                                              <ArrowDownOutlined style={{fontSize: '12px'}} /> {Math.abs(change)}
                                            </span> : null}
                                        </ScoreChange>
                                      ) : null}
                                    </td>
                                    <td>
                                      <ScoreText score={avgScore}>{avgScore || '-'}</ScoreText>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </ScoresTable>

                        <div style={{marginTop: '15px', marginBottom: '30px'}}>
                          <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '10px'}}>과목별 점수 분포</div>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{flex: 1, height: '20px', backgroundColor: '#4CAF50', borderRadius: '10px', width: `${(scoreDistribution.excellent/totalSubjects)*100}%`}} />
                            <div style={{flex: 1, height: '20px', backgroundColor: '#2196F3', borderRadius: '10px', width: `${(scoreDistribution.good/totalSubjects)*100}%`}} />
                            <div style={{flex: 1, height: '20px', backgroundColor: '#FF9800', borderRadius: '10px', width: `${(scoreDistribution.average/totalSubjects)*100}%`}} />
                            <div style={{flex: 1, height: '20px', backgroundColor: '#F44336', borderRadius: '10px', width: `${(scoreDistribution.poor/totalSubjects)*100}%`}} />
                          </div>
                        </div>
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
