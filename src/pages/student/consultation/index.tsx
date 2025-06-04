import React, { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";

// 타입 정의
interface ConsultationRecord {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  content: string;
  nextPlan: string;
  isSharedWithOtherTeachers: boolean;
  createdAt: string;
  updatedAt: string;
}

// 스타일 컴포넌트
const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 1.5rem 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 200px;

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  option {
    color: ${colors.text.primary};
    background-color: white;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 0.75rem;
  }
  
  p {
    font-size: 0.95rem;
    color: ${colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ConsultationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConsultationCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const ConsultationHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${colors.primary.light}20;
  border-bottom: 1px solid ${colors.grey[200]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConsultationDate = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${colors.primary.dark};
`;

const ConsultationContent = styled.div`
  padding: 1.25rem 1.5rem;
  flex: 1;
  
  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: ${colors.text.secondary};
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContentTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.primary.dark};
  margin: 0 0 0.5rem 0;
`;

const ContentText = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-line;
  margin: 0 0 0.75rem 0;
`;

// 임시 데이터
const MOCK_STUDENT_ID = "1"; // 로그인한 학생 ID

const MOCK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: "1",
    studentId: "1",
    teacherId: "t1",
    teacherName: "김선생님",
    date: "2023-05-15",
    content: "학업 성취도가 떨어지는 원인에 대해 상담함. 집에서 공부할 시간이 부족하다고 함. 방과후 학습 추천.",
    nextPlan: "방과후 학습 신청하고 2주 후 다시 상담 예정",
    isSharedWithOtherTeachers: true,
    createdAt: "2023-05-15T14:30:00",
    updatedAt: "2023-05-15T14:30:00"
  },
  {
    id: "2",
    studentId: "1",
    teacherId: "t2",
    teacherName: "김선생님",
    date: "2023-05-30",
    content: "방과후 학습 참여 후 변화에 대해 상담. 공부 시간이 증가했으나 아직 성적 변화는 없음.",
    nextPlan: "성적 향상 전략에 대해 추가 상담 필요",
    isSharedWithOtherTeachers: true,
    createdAt: "2023-05-30T15:20:00",
    updatedAt: "2023-05-30T15:20:00"
  },
  {
    id: "3",
    studentId: "1",
    teacherId: "t3",
    teacherName: "박선생님",
    date: "2023-06-20",
    content: "진로에 관한 상담을 진행함. 이공계 분야에 관심이 있으나 구체적인 직업은 아직 정하지 못함.",
    nextPlan: "진로검사 후 다시 상담하기로 함",
    isSharedWithOtherTeachers: false,
    createdAt: "2023-06-20T13:10:00",
    updatedAt: "2023-06-20T13:10:00"
  },
];

// 컴포넌트
const StudentConsultationPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
// 학생/학부모 모두를 위한 studentId 추출
const studentId = userInfo?.userType === "PARENT" ? userInfo?.studentId : userInfo?.userId;
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationRecord[]>([]);

  // 상담 기록 필터링
  useEffect(() => {
    let filtered = MOCK_CONSULTATIONS.filter(
      (consultation) => consultation.studentId === MOCK_STUDENT_ID
    );
    
    // 연도 필터링
    if (selectedYear) {
      filtered = filtered.filter((consultation) => {
        const year = new Date(consultation.createdAt).getFullYear().toString();
        return year === selectedYear;
      });
    }
    
    setFilteredConsultations(filtered);
  }, [selectedYear]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 연도 목록 생성
  const getYears = () => {
    const years = new Set<string>();
    MOCK_CONSULTATIONS.forEach((consultation) => {
      const year = new Date(consultation.createdAt).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // 내림차순 정렬
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || "학생"}
      userRole="학생"
      userInfo={userInfo?.grade && userInfo?.class ? `${userInfo.grade}학년 ${userInfo.class}반` : ""}
      notificationCount={2}
    >
      <StudentSidebar isCollapsed={false} />
      <PageContainer>
        <ContentArea>
          <PageHeader>
            <PageTitle>상담 내역</PageTitle>
          </PageHeader>

          <FilterContainer>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">전체 연도</option>
              {getYears().map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </Select>
          </FilterContainer>

          <Card>
            {filteredConsultations.length > 0 ? (
              <ConsultationGrid>
                {filteredConsultations.map((consultation) => (
                  <ConsultationCard key={consultation.id}>
                    <ConsultationHeader>
                      <ConsultationDate>
                        {formatDate(consultation.createdAt)}
                      </ConsultationDate>
                    </ConsultationHeader>
                    <ConsultationContent>
                      <ContentSection>
                        <ContentTitle>상담 내용</ContentTitle>
                        <ContentText>{consultation.content}</ContentText>
                      </ContentSection>
                      <ContentSection>
                        <ContentTitle>다음 계획 및 조치사항</ContentTitle>
                        <ContentText>{consultation.nextPlan}</ContentText>
                      </ContentSection>
                    </ConsultationContent>
                  </ConsultationCard>
                ))}
              </ConsultationGrid>
            ) : (
              <EmptyState>
                <h3>표시할 상담 내역이 없습니다</h3>
                <p>선생님들과의 상담 내역이 이곳에 표시됩니다.</p>
              </EmptyState>
            )}
          </Card>
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentConsultationPage;
