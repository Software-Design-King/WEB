import React from 'react';
import styled from 'styled-components';

// 학생 보고서 피드백 및 상담 데이터 인터페이스
interface StudentFeedback {
  grade: number;
  createdAt: string;
  title: string | null;
  scoreFeed: string;
  behaviorFeed: string;
  otherFeed: string;
}

interface FeedbackList {
  feedbacks: StudentFeedback[];
}

interface StudentCounseling {
  title: string | null;
  grade: number;
  createdAt: string;
  context: string;
  plan: string;
}

interface CounselingList {
  counsels: StudentCounseling[];
}

interface StudentInfo {
  name: string;
  grade: number;
  classNum: number;
  studentId: number;
  studentNum: number;
}

interface StudentReportFeedbackPageProps {
  reportData: {
    studentInfo: StudentInfo;
    feedbackList: FeedbackList;
    counselList: CounselingList;
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
  /* 비율이 깨지지 않도록 조정 */
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

const FeedbackCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const FeedbackTitle = styled.h4`
  margin: 0;
  color: #2c3e50;
`;

const FeedbackDate = styled.span`
  font-size: 12px;
  color: #666;
`;

const FeedbackContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const FeedbackItem = styled.div`
  margin-bottom: 8px;
  
  span {
    font-weight: 500;
    color: #555;
    margin-right: 10px;
  }
`;

// 상담 관련 스타일은 FeedbackCard, FeedbackHeader, FeedbackTitle 등으로 대체
// 하나의 통합된 스타일 사용

const PageNumber = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 10mm;
`;

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const StudentReportFeedbackPage: React.FC<StudentReportFeedbackPageProps> = ({ reportData }) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // API 응답 구조에 맞는 학생 기본 정보
  const student = reportData?.studentInfo || { name: '-', grade: 0, classNum: 0, studentId: 0, studentNum: 0 };
  
  // 피드백 목록 - API 응답은 feedbacks 배열을 포함하는 feedbackList 개체
  const feedbacks: StudentFeedback[] = reportData?.feedbackList?.feedbacks || [];
  
  // 상담 기록 - API 응답은 counsels 배열을 포함하는 counselList 개체
  const counsels: StudentCounseling[] = reportData?.counselList?.counsels || [];
  
  console.log('피드백 데이터:', feedbacks);
  console.log('상담 데이터:', counsels);

  return (
    <ReportContainer id="student-report-feedback">
      {/* 보고서 헤더 */}
      <ReportHeader>
        <SchoolLogo>성적우수학교</SchoolLogo>
        <ReportTitle>학생 종합 보고서</ReportTitle>
        <ReportDate>발행일: {currentDate}</ReportDate>
      </ReportHeader>
      
      <div style={{ textAlign: 'center', marginBottom: '5mm' }}>
        <h3>{student.name || '-'} 학생 피드백 & 상담 내역</h3>
      </div>
      
      {/* 피드백 섹션 */}
      <Section>
        <SectionTitle>피드백 내역</SectionTitle>
        
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <FeedbackCard key={index}>
              <FeedbackHeader>
                <FeedbackTitle>
                  {feedback.title || '제목없음'}
                </FeedbackTitle>
                <FeedbackDate>
                  {formatDate(feedback.createdAt) || '날짜 없음'}
                </FeedbackDate>
              </FeedbackHeader>
              <FeedbackContent>
                <FeedbackItem>
                  <span>학년:</span> {feedback.grade || '-'}년
                </FeedbackItem>
                <FeedbackItem>
                  <span>학습 피드백:</span> {feedback.scoreFeed || '-'}
                </FeedbackItem>
                <FeedbackItem>
                  <span>행동 피드백:</span> {feedback.behaviorFeed || '-'}
                </FeedbackItem>
                <FeedbackItem>
                  <span>기타 사항:</span> {feedback.otherFeed || '-'}
                </FeedbackItem>
              </FeedbackContent>
            </FeedbackCard>
          ))
        ) : (
          <p>피드백 정보가 없습니다.</p>
        )}
      </Section>
      
      {/* 상담 섹션 */}
      <Section>
        <SectionTitle>상담 내역</SectionTitle>
        
        {counsels && counsels.length > 0 ? (
          counsels.map((counsel, index) => (
            <FeedbackCard key={index}>
              <FeedbackHeader>
                <FeedbackTitle>{counsel.title || '상담 내용'}</FeedbackTitle>
                <FeedbackDate>{formatDate(counsel.createdAt) || '날짜 없음'}</FeedbackDate>
              </FeedbackHeader>
              
              <FeedbackContent>
                <FeedbackItem>
                  <span>학년:</span> {counsel.grade || '-'}년
                </FeedbackItem>
                <FeedbackItem>
                  <span>상담 내용:</span> {counsel.context || '-'}
                </FeedbackItem>
                <FeedbackItem>
                  <span>상담 계획:</span> {counsel.plan || '-'}
                </FeedbackItem>
              </FeedbackContent>
            </FeedbackCard>
          ))
        ) : (
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', textAlign: 'center' }}>
            <p>상담 내역이 없습니다.</p>
          </div>
        )}
      </Section>
      
      <PageNumber>- 3 -</PageNumber>
    </ReportContainer>
  );
};

export default StudentReportFeedbackPage;
