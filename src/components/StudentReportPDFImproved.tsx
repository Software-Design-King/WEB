import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button, Spin, message, Space } from 'antd';
import { DownloadOutlined, FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import { getStudentReport } from '../apis/student';

// 학생 보고서 데이터 타입 정의
interface StudentInfo {
  name: string;
  grade: number;
  classNum: number;
  studentId: number;
  studentNum: number;
  birthDate?: string;
  gender?: string;
  address?: string;
  contact?: string;
  enrollCode?: string;
  entranceDate?: string;
  age?: number | null;
}

interface AttendanceSummary {
  totalDays: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  sickCount: number;
  details: Array<{
    date?: string;
    type?: string;
    reason?: string;
  }>;
}

interface SubjectScore {
  subject: string;
  score: number;
  grade: string;
  rank?: number;
  classRank?: number;
  // 추가 필드가 있을 수 있음
  [key: string]: string | number | undefined;
}

interface GradeScoreData {
  averageScore: number;
  classRank: number;
  totalScore: number;
  wholeRank: number;
  subjects: SubjectScore[];
}

interface ScoresBySemester {
  [semester: string]: GradeScoreData;
}

interface ScoresByGrade {
  [grade: string]: ScoresBySemester;
}

interface StudentScores {
  scoresByGradeAndSemester: ScoresByGrade;
}

interface StudentFeedback {
  grade: number;
  createdAt: string;
  title: string | null;
  scoreFeed: string;
  behaviorFeed: string;
  otherFeed: string;
  [key: string]: string | number | null | undefined;
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
  [key: string]: string | number | null | undefined;
}

interface CounselingList {
  counsels: StudentCounseling[];
}

interface StudentReportData {
  studentInfo: StudentInfo;
  attendanceSummary: AttendanceSummary;
  studentScores: StudentScores;
  feedbackList: FeedbackList;
  counselList: CounselingList;
}

// 보고서 페이지 컴포넌트 임포트
import StudentReportPreviewPage from './StudentReportPreviewPage';
import StudentReportScoresPage from './StudentReportScoresPage';
import StudentReportFeedbackPage from './StudentReportFeedbackPage';

// 스타일 정의
const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ReportPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
  padding-bottom: 20px;
`;

const PageContainer = styled.div`
  width: 100%;
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  /* PDF 비율 문제 해결을 위한 스타일 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  border: 1px solid #e8e8e8;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  position: sticky;
  top: 0;
  background: white;
  padding: 10px;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const PageTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #1890ff;
  font-size: 18px;
  font-weight: 600;
  background-color: #e6f7ff;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ffccc7;
  background-color: #fff2f0;
  border-radius: 5px;
  margin: 20px 0;
`;

interface StudentReportPDFImprovedProps {
  studentId: number;
}

const StudentReportPDFImproved: React.FC<StudentReportPDFImprovedProps> = ({ studentId }) => {
  const [reportData, setReportData] = useState<StudentReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 페이지 ref 정의
  const previewPageRef = useRef<HTMLDivElement>(null);
  const scoresPageRef = useRef<HTMLDivElement>(null);
  const feedbackPageRef = useRef<HTMLDivElement>(null);

  // 학생 보고서 데이터 가져오기
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getStudentReport(studentId);
        // API 응답 구조 상세 검사
        console.log('API 응답 구조 전체:', response);
        console.log('학생 정보:', response.studentInfo);
        console.log('출결 정보:', response.attendanceSummary);
        console.log('성적 정보:', response.studentScores);
        console.log('피드백 목록:', response.feedbackList);
        console.log('상담 목록:', response.counselList);
        setReportData(response);
      } catch (err) {
        console.error('보고서 데이터 가져오기 실패:', err);
        setError('학생 보고서 데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchReportData();
    }
  }, [studentId]);

  // 단일 페이지를 캡처하여 이미지로 변환하는 함수
  const capturePage = async (element: HTMLDivElement | null): Promise<HTMLCanvasElement | null> => {
    if (!element) return null;
    
    try {
      // html2canvas 옵션 설정 - 레이아웃 가능성 개선
      const canvas = await html2canvas(element, {
        scale: 2, // 고해상도
        useCORS: true, // 외부 이미지 허용
        logging: false, // 로그 비활성화
        allowTaint: true, // 보안 이미지 허용
        backgroundColor: '#ffffff', // 배경색 설정
        windowWidth: 1024, // 고정 너비 설정
        windowHeight: 1448, // A4 비율에 맞게 조정
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        width: element.offsetWidth,
        height: element.offsetHeight
      });
      
      return canvas;
    } catch (err) {
      console.error('페이지 캡처 중 오류 발생:', err);
      return null;
    }
  };

  // PDF 생성 및 다운로드 함수
  const generatePDF = async () => {
    try {
      setGenerating(true);
      message.loading({ content: 'PDF 생성 중...', key: 'pdfGeneration' });
      
      // 모든 페이지 캡처
      const pageCanvases = await Promise.all([
        capturePage(previewPageRef.current),
        capturePage(scoresPageRef.current),
        capturePage(feedbackPageRef.current)
      ]);
      
      // 유효한 캔버스만 필터링
      const validCanvases = pageCanvases.filter(
        (canvas): canvas is HTMLCanvasElement => canvas !== null
      );
      
      if (validCanvases.length === 0) {
        throw new Error('페이지 캡처에 실패했습니다.');
      }
      
      // PDF 문서 생성 (A4 사이즈)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // 각 페이지를 PDF에 추가
      for (let i = 0; i < validCanvases.length; i++) {
        const canvas = validCanvases[i];
        const imgData = canvas.toDataURL('image/jpeg', 0.9); // JPEG 형식, 품질 0.9
        
        // 첫 페이지가 아니면 새 페이지 추가
        if (i > 0) {
          pdf.addPage();
        }
        
        // 이미지를 PDF 페이지 크기에 맞게 추가
        // 비율 문제 해결을 위해 설정 조정
        const pdfWidth = 210; // A4 너비(mm)
        const pdfHeight = 297; // A4 높이(mm)
        
        // 이미지 크기 계산 (비율 유지)
        let imgWidth = pdfWidth;
        let imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // 높이가 A4를 초과하는 경우 수정
        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight;
          imgWidth = (canvas.width * pdfHeight) / canvas.height;
        }
        
        // 중앙 정렬을 위한 오프셋 계산
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = 0;
        
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // PDF 파일 다운로드
      const studentName = reportData?.studentInfo?.name || '학생';
      pdf.save(`${studentName}_종합보고서.pdf`);
      
      message.success({ content: 'PDF 생성이 완료되었습니다!', key: 'pdfGeneration' });
    } catch (err) {
      console.error('PDF 생성 중 오류 발생:', err);
      message.error({ content: 'PDF 생성에 실패했습니다. 다시 시도해 주세요.', key: 'pdfGeneration' });
    } finally {
      setGenerating(false);
    }
  };

  // PDF 미리보기 함수
  const previewPDF = async () => {
    try {
      setGenerating(true);
      message.loading({ content: 'PDF 미리보기 준비 중...', key: 'pdfPreview' });
      
      // 모든 페이지 캡처
      const pageCanvases = await Promise.all([
        capturePage(previewPageRef.current),
        capturePage(scoresPageRef.current),
        capturePage(feedbackPageRef.current)
      ]);
      
      // 유효한 캔버스만 필터링
      const validCanvases = pageCanvases.filter(
        (canvas): canvas is HTMLCanvasElement => canvas !== null
      );
      
      if (validCanvases.length === 0) {
        throw new Error('페이지 캡처에 실패했습니다.');
      }
      
      // PDF 문서 생성 (A4 사이즈)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // 각 페이지를 PDF에 추가
      for (let i = 0; i < validCanvases.length; i++) {
        const canvas = validCanvases[i];
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // PDF 미리보기 (새 창에서 열기)
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      message.success({ content: 'PDF 미리보기가 준비되었습니다!', key: 'pdfPreview' });
    } catch (err) {
      console.error('PDF 미리보기 중 오류 발생:', err);
      message.error({ content: 'PDF 미리보기에 실패했습니다. 다시 시도해 주세요.', key: 'pdfPreview' });
    } finally {
      setGenerating(false);
    }
  };
  
  // 로딩 중이거나 에러가 있는 경우 해당 상태 표시
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
        <p>보고서 데이터를 로딩 중입니다...</p>
      </LoadingContainer>
    );
  }
  
  // 데이터 구조 디버깅
  if (reportData) {
    console.log('현재 reportData:', reportData);
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
        <Button type="primary" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </ErrorContainer>
    );
  }
  
  return (
    <ReportContainer>
      <ButtonsContainer>
        <Space>
          <Button 
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={generatePDF}
            loading={generating}
            disabled={!reportData}
          >
            PDF 다운로드
          </Button>
          <Button 
            icon={<EyeOutlined />}
            size="large"
            onClick={previewPDF}
            loading={generating}
            disabled={!reportData}
          >
            PDF 미리보기
          </Button>
          <Button 
            icon={<FilePdfOutlined />}
            size="large"
            onClick={() => window.print()}
            disabled={!reportData}
          >
            현재 보고서 인쇄
          </Button>
        </Space>
      </ButtonsContainer>
      
      <ReportPreviewContainer>
        <PageContainer>
          <PageTitle>기본 정보 및 출결 현황</PageTitle>
          <div ref={previewPageRef}>
            {reportData && <StudentReportPreviewPage reportData={reportData} />}
          </div>
        </PageContainer>
        
        <PageContainer>
          <PageTitle>성적 정보</PageTitle>
          <div ref={scoresPageRef}>
            {reportData && <StudentReportScoresPage reportData={reportData} />}
          </div>
        </PageContainer>
        
        <PageContainer>
          <PageTitle>학습 피드백 및 상담 내역</PageTitle>
          <div ref={feedbackPageRef}>
            {reportData && <StudentReportFeedbackPage reportData={reportData} />}
          </div>
        </PageContainer>
      </ReportPreviewContainer>
    </ReportContainer>
  );
};

export default StudentReportPDFImproved;
