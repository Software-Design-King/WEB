import React from 'react';
import styled from 'styled-components';

// 스타일 정의
const ReportContainer = styled.div`
  width: 210mm; /* A4 너비 */
  min-height: 297mm; /* A4 높이 */
  margin: 0 auto;
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

const StudentInfoTable = styled.table`
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
    width: 25%;
    font-weight: 500;
  }
`;

const AttendanceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
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
`;

const ScoresTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
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

const PageNumber = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 10mm;
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

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

interface StudentReportPreviewPageProps {
  reportData: any; // API에서 받아온 학생 보고서 데이터
}

const StudentReportPreviewPage: React.FC<StudentReportPreviewPageProps> = ({ reportData }) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // 학생 기본 정보 - API 응답은 data 하위가 아닌 최상위에 있음
  const student = reportData?.studentInfo || {};
  
  // 출결 정보
  const attendance = reportData?.attendanceSummary || {};
  
  // 성적 정보 - 다른 페이지에서 표시하민로 여기서는 사용하지 않음
  // 피드백과 상담 목록도 해당 페이지에서 표시

  return (
    <ReportContainer id="student-report-container">
      {/* 보고서 헤더 */}
      <ReportHeader>
        <SchoolLogo>성적우수학교</SchoolLogo>
        <ReportTitle>학생 종합 보고서</ReportTitle>
        <ReportDate>발행일: {currentDate}</ReportDate>
      </ReportHeader>
      
      {/* 학생 기본 정보 섹션 */}
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <StudentInfoTable>
          <tbody>
            <tr>
              <th>이름</th>
              <td>{student.name || '-'}</td>
              <th>학년/반/번호</th>
              <td>{student.grade || '-'}학년 {student.classNum || '-'}반 {student.studentNum || '-'}번</td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>{formatDate(student.birthDate)}</td>
              <th>성별</th>
              <td>{student.gender || '-'}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td colSpan={3}>{student.address || '-'}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{student.contact || '-'}</td>
              <th>입학일</th>
              <td>{formatDate(student.entranceDate)}</td>
            </tr>
          </tbody>
        </StudentInfoTable>
      </Section>
      
      {/* 출결 현황 섹션 */}
      <Section>
        <SectionTitle>출결 현황</SectionTitle>
        <div style={{ marginBottom: '15px' }}>
          <p>
            <strong>총 수업일수:</strong> {attendance.totalDays || 0}일 | 
            <strong> 결석:</strong> {attendance.absentCount || 0}일 | 
            <strong> 지각:</strong> {attendance.lateCount || 0}회 | 
            <strong> 조퇴:</strong> {attendance.leaveCount || 0}회 | 
            <strong> 병결:</strong> {attendance.sickCount || 0}일
          </p>
        </div>
        
        {attendance.details && attendance.details.length > 0 ? (
          <AttendanceTable>
            <thead>
              <tr>
                <th>날짜</th>
                <th>유형</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {attendance.details.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.type}</td>
                  <td>{item.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </AttendanceTable>
        ) : (
          <p>출결 세부 정보가 없습니다.</p>
        )}
      </Section>
      
      <PageNumber>- 1 -</PageNumber>
    </ReportContainer>
  );
};

export default StudentReportPreviewPage;
