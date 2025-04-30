import React, { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";

// 타입 정의
interface FeedbackItem {
  id: string;
  studentId: string;
  academicContent: string;
  behavioralContent: string;
  attendanceContent: string;
  attitudeContent: string;
  otherContent: string;
  isSharedWithStudent: boolean;
  isSharedWithParent: boolean;
  createdAt: string;
  updatedAt: string;
  teacherName?: string; // 담임선생님 이름
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

const FeedbackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeedbackCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const FeedbackHeader = styled.div`
  padding: 1rem 1.25rem;
  background-color: ${colors.primary.light}20;
  border-bottom: 1px solid ${colors.grey[200]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeedbackDate = styled.div`
  font-size: 0.9rem;
  color: ${colors.primary.dark};
  font-weight: 500;
`;

const FeedbackContent = styled.div`
  padding: 1.25rem;
  flex: 1;
`;

const FeedbackSection = styled.div`
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed ${colors.grey[200]};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:not(:first-child) {
    padding-top: 0.75rem;
  }
`;

const FeedbackSectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.primary.dark};
  margin: 0 0 0.5rem 0;
`;

const FeedbackSectionContent = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  line-height: 1.5;
  margin: 0;
`;

const FeedbackSharing = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: ${colors.grey[50]};
  border-top: 1px solid ${colors.grey[200]};
  display: flex;
  gap: 1rem;
`;

const FeedbackTag = styled.span<{ shared: boolean }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background-color: ${(props) =>
    props.shared ? colors.success.light : colors.grey[200]};
  color: ${(props) =>
    props.shared ? colors.success.dark : colors.text.secondary};
  font-weight: 500;
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

// 임시 데이터
const MOCK_STUDENT_ID = "1"; // 로그인한 학생 ID

const MOCK_FEEDBACKS: FeedbackItem[] = [
  {
    id: "1",
    studentId: "1",
    academicContent:
      "수학 성적이 전반적으로 향상되었습니다. 특히 방정식 부분에서 큰 진전이 있었습니다.",
    behavioralContent:
      "수업 중 태도가 좋아졌으며, 친구들과도 협력을 잘 합니다.",
    attendanceContent: "결석 없이 모든 수업에 참여하였습니다.",
    attitudeContent: "적극적인 수업 참여가 돋보입니다.",
    otherContent: "다음 학기에는 더 높은 목표를 세워보면 좋을 것 같습니다.",
    isSharedWithStudent: true,
    isSharedWithParent: true,
    createdAt: "2025-03-15T14:30:00",
    updatedAt: "2025-03-15T14:30:00",
    teacherName: "김선생님"
  },
  {
    id: "2",
    studentId: "1",
    academicContent:
      "영어 시험에서 우수한 성적을 보였습니다. 문법 부분이 특히 뛰어납니다.",
    behavioralContent: "수업 중 집중력이 향상되었습니다.",
    attendanceContent: "모든 수업에 출석하였습니다.",
    attitudeContent: "수업 준비를 철저히 해오는 점이 인상적입니다.",
    otherContent: "영어 동아리 활동도 추천드립니다.",
    isSharedWithStudent: true,
    isSharedWithParent: false,
    createdAt: "2025-02-20T10:15:00",
    updatedAt: "2025-02-20T10:15:00",
    teacherName: "김선생님"
  },
  {
    id: "3",
    studentId: "1",
    academicContent:
      "국어 성적이 전 학기 대비 크게 상승했습니다. 특히 문학 작품 분석 능력이 향상되었습니다.",
    behavioralContent: "토론 시간에 적극적으로 참여하는 모습이 인상적입니다.",
    attendanceContent: "지각 없이 모든 수업에 참여했습니다.",
    attitudeContent: "수업 중 질문이 많아지고 집중력이 향상되었습니다.",
    otherContent: "문예부 활동을 시작해보는 것도 좋을 것 같습니다.",
    isSharedWithStudent: true,
    isSharedWithParent: true,
    createdAt: "2025-01-10T09:20:00",
    updatedAt: "2025-01-10T09:20:00",
    teacherName: "박선생님"
  },
];

// 컴포넌트
const StudentFeedbackPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackItem[]>([]);

  // 피드백 필터링 (학생에게 공유된 피드백만 표시)
  useEffect(() => {
    const feedbacks = MOCK_FEEDBACKS.filter(
      (feedback) => 
        feedback.studentId === MOCK_STUDENT_ID && 
        feedback.isSharedWithStudent
    );
    
    // 연도 필터링
    let filtered = feedbacks;
    
    if (selectedYear) {
      filtered = filtered.filter((feedback) => {
        const year = new Date(feedback.createdAt).getFullYear().toString();
        return year === selectedYear;
      });
    }
    
    setFilteredFeedbacks(filtered);
  }, [selectedYear]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 연도 목록 생성
  const getYears = () => {
    const years = new Set<string>();
    MOCK_FEEDBACKS.forEach((feedback) => {
      const year = new Date(feedback.createdAt).getFullYear().toString();
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
            <PageTitle>피드백 내역</PageTitle>
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
            {filteredFeedbacks.length > 0 ? (
              <FeedbackGrid>
                {filteredFeedbacks.map((feedback) => (
                  <FeedbackCard key={feedback.id}>
                    <FeedbackHeader>
                      <FeedbackDate>
                        {formatDate(feedback.createdAt)}
                      </FeedbackDate>
                    </FeedbackHeader>
                    <FeedbackContent>
                      {feedback.academicContent && (
                        <FeedbackSection>
                          <FeedbackSectionTitle>
                            학업 성취
                          </FeedbackSectionTitle>
                          <FeedbackSectionContent>
                            {feedback.academicContent}
                          </FeedbackSectionContent>
                        </FeedbackSection>
                      )}
                      {feedback.behavioralContent && (
                        <FeedbackSection>
                          <FeedbackSectionTitle>
                            행동 발달
                          </FeedbackSectionTitle>
                          <FeedbackSectionContent>
                            {feedback.behavioralContent}
                          </FeedbackSectionContent>
                        </FeedbackSection>
                      )}
                      {feedback.attendanceContent && (
                        <FeedbackSection>
                          <FeedbackSectionTitle>
                            출석 상황
                          </FeedbackSectionTitle>
                          <FeedbackSectionContent>
                            {feedback.attendanceContent}
                          </FeedbackSectionContent>
                        </FeedbackSection>
                      )}
                      {feedback.attitudeContent && (
                        <FeedbackSection>
                          <FeedbackSectionTitle>
                            학습 태도
                          </FeedbackSectionTitle>
                          <FeedbackSectionContent>
                            {feedback.attitudeContent}
                          </FeedbackSectionContent>
                        </FeedbackSection>
                      )}
                      {feedback.otherContent && (
                        <FeedbackSection>
                          <FeedbackSectionTitle>
                            기타 사항
                          </FeedbackSectionTitle>
                          <FeedbackSectionContent>
                            {feedback.otherContent}
                          </FeedbackSectionContent>
                        </FeedbackSection>
                      )}
                    </FeedbackContent>
                    <FeedbackSharing>
                      <FeedbackTag shared={feedback.isSharedWithStudent}>
                        학생 공유{" "}
                        {feedback.isSharedWithStudent ? "✓" : "✗"}
                      </FeedbackTag>
                      <FeedbackTag shared={feedback.isSharedWithParent}>
                        학부모 공유{" "}
                        {feedback.isSharedWithParent ? "✓" : "✗"}
                      </FeedbackTag>
                    </FeedbackSharing>
                  </FeedbackCard>
                ))}
              </FeedbackGrid>
            ) : (
              <EmptyState>
                <h3>표시할 피드백이 없습니다</h3>
                <p>선생님이 공유한 피드백이 이곳에 표시됩니다.</p>
              </EmptyState>
            )}
          </Card>
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentFeedbackPage;
