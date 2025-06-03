import React from "react";
import styled from "styled-components";

// 학생 보고서 피드백 및 상담 데이터 인터페이스
interface StudentFeedback {
  id?: number;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

interface StudentCounseling {
  id?: number;
  title: string;
  date?: string;
  createdAt?: string; // API 기존 구조에서 사용
  counselorName?: string;
  type?: string;
  content?: string;
  context?: string; // API 기존 구조에서 사용
}

// API 응답 구조에 맞게 구조 정의
interface APIFeedback {
  id?: number;
  grade?: number;
  createdAt: string;
  title: string | null;
  scoreFeed?: string;
  behaviorFeed?: string;
  otherFeed?: string;
}

interface APICounseling {
  id?: number;
  title: string | null;
  grade?: number;
  createdAt: string;
  context: string;
  plan?: string;
}

interface StudentReportFeedbackPageProps {
  reportData: {
    // 기존 구조 지원
    studentInfo?: {
      name: string;
      grade: number;
      classNum?: number;
      class?: number;
      studentId: number;
      studentNum?: number;
    };
    feedbackList?: {
      feedbacks: APIFeedback[];
    };
    counselList?: {
      counsels: APICounseling[];
    };
    // 새 구조 지원
    data?: {
      studentInfo?: {
        name: string;
        grade: number;
        class: number;
        studentId: number;
      };
      feedbackList?: StudentFeedback[];
      counselList?: StudentCounseling[];
    };
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
  font-family: "Noto Sans KR", sans-serif;
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

const Tag = styled.span`
  display: inline-block;
  background-color: #e1f5fe;
  color: #0288d1;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 5px;
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
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const StudentReportFeedbackPage: React.FC<StudentReportFeedbackPageProps> = ({
  reportData,
}) => {
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // API 응답 구조 확인 및 데이터 추출
  console.log('보고서 데이터:', reportData);
  
  // 학생 기본 정보 (API 응답 구조에 맞게 조정)
  const student = reportData?.studentInfo || {
    name: "-",
    grade: 0,
    class: 0,
    studentId: 0,
  };

  // 피드백 목록 (API 응답 구조에 맞게 조정)
  let feedbacks: StudentFeedback[] = [];
  if (reportData?.feedbackList?.feedbacks) {
    // 기존 구조 (nested feedbacks array)
    feedbacks = reportData.feedbackList.feedbacks.map(feedback => ({
      id: feedback.id,
      title: feedback.title || '피드백',
      content: [feedback.scoreFeed, feedback.behaviorFeed, feedback.otherFeed]
        .filter(item => item && item.trim() !== '')
        .join('\n\n'),
      createdAt: feedback.createdAt,
      tags: [
        feedback.scoreFeed ? '학습' : null,
        feedback.behaviorFeed ? '행동' : null,
        feedback.otherFeed ? '기타' : null
      ].filter(tag => tag !== null) as string[]
    }));
  } else if (reportData?.data?.feedbackList) {
    // 새 구조 (reportData.data.feedbackList)
    feedbacks = reportData.data.feedbackList;
  }

  // 상담 기록 (API 응답 구조에 맞게 조정)
  let counsels: StudentCounseling[] = [];
  if (reportData?.counselList?.counsels) {
    // 기존 구조 (nested counsels array)
    counsels = reportData.counselList.counsels.map(counsel => ({
      id: counsel.id,
      title: counsel.title || '상담',
      date: counsel.createdAt,
      counselorName: '담당 교사',  // 기존 API에 없으므로 기본값
      type: `${counsel.grade}학년 상담`,
      content: counsel.context + (counsel.plan ? `\n\n향후 계획: ${counsel.plan}` : '')
    }));
  } else if (reportData?.data?.counselList) {
    // 새 구조 (reportData.data.counselList)
    counsels = reportData.data.counselList;
  }

  return (
    <ReportContainer id="student-report-feedback">
      {/* 보고서 헤더 */}
      <ReportHeader>
        <SchoolLogo>성적우수학교</SchoolLogo>
        <ReportTitle>학생 종합 보고서</ReportTitle>
        <ReportDate>발행일: {currentDate}</ReportDate>
      </ReportHeader>

      <div style={{ textAlign: "center", marginBottom: "5mm" }}>
        <h3>{student.name || "-"} 학생 피드백 & 상담 내역</h3>
      </div>

      {/* 피드백 섹션 */}
      <Section>
        <SectionTitle>피드백 내역</SectionTitle>

        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <FeedbackCard key={index}>
              <FeedbackHeader>
                <FeedbackTitle>{feedback.title || "제목없음"}</FeedbackTitle>
                <FeedbackDate>
                  {formatDate(feedback.createdAt) || "날짜 없음"}
                </FeedbackDate>
              </FeedbackHeader>
              <FeedbackContent>
                {feedback.content || "내용 없음"}
                <div style={{ marginTop: "10px" }}>
                  {feedback.tags &&
                    feedback.tags.map((tag, tagIndex) => (
                      <Tag key={tagIndex}>{tag}</Tag>
                    ))}
                </div>
              </FeedbackContent>
            </FeedbackCard>
          ))
        ) : (
          <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", textAlign: "center" }}>
            <p>피드백 정보가 없습니다.</p>
          </div>
        )}
      </Section>

      {/* 상담 섹션 */}
      <Section>
        <SectionTitle>상담 내역</SectionTitle>

        {counsels && counsels.length > 0 ? (
          counsels.map((counsel, index) => (
            <FeedbackCard key={index}>
              <FeedbackHeader>
                <FeedbackTitle>{counsel.title || "상담 내용"}</FeedbackTitle>
                <FeedbackDate>
                  {formatDate(counsel.date || counsel.createdAt) || "날짜 없음"}
                </FeedbackDate>
              </FeedbackHeader>

              <FeedbackContent>
                {counsel.counselorName && (
                  <FeedbackItem>
                    <span>상담 교사:</span> {counsel.counselorName}
                  </FeedbackItem>
                )}
                {counsel.type && (
                  <FeedbackItem>
                    <span>상담 유형:</span> {counsel.type}
                  </FeedbackItem>
                )}
                <FeedbackItem>
                  <span>상담 내용:</span> {counsel.content || counsel.context || "-"}
                </FeedbackItem>
              </FeedbackContent>
            </FeedbackCard>
          ))
        ) : (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <p>상담 내역이 없습니다.</p>
          </div>
        )}
      </Section>

      <PageNumber>- 3 -</PageNumber>
    </ReportContainer>
  );
};

export default StudentReportFeedbackPage;
