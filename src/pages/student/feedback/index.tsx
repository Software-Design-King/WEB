import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { getStudentReport } from "../../../apis/student";

// 피드백 타입 정의
interface FeedbackItem {
  id: number;
  title: string | null;
  createdAt: string;
  scoreFeed?: string;
  behaviorFeed?: string;
  otherFeed?: string;
}

// 상담 타입 정의
interface CounselingItem {
  id: number;
  title: string | null;
  createdAt: string;
  context: string;
  plan?: string;
}

// 보고서 데이터 타입
interface StudentReportData {
  studentInfo?: {
    name: string;
    grade: number;
    classNum?: number;
    class?: number;
    studentId: number;
    studentNum?: number;
  };
  feedbackList?: {
    feedbacks: FeedbackItem[];
  };
  counselList?: {
    counsels: CounselingItem[];
  };
  data?: {
    studentInfo?: {
      name: string;
      grade: number;
      class: number;
      studentId: number;
    };
    feedbackList?: FeedbackItem[];
    counselList?: CounselingItem[];
  };
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
`;

// 탭 컨테이너

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.grey[300]};
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? colors.primary.light : 'transparent'};
  color: ${props => props.active ? colors.primary.dark : colors.text.secondary};
  border: none;
  border-bottom: 3px solid ${props => props.active ? colors.primary.main : 'transparent'};
  font-size: 1rem;
  font-weight: ${props => props.active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.grey[100]};
    color: ${colors.primary.main};
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

// 컴포넌트
const StudentFeedbackPage: React.FC = () => {
  const { userInfo } = useAuthContext();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // 사용하지 않는 reportData 상태를 제거하고 데이터 처리 로직만 유지
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [counsels, setCounsels] = useState<CounselingItem[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feedback' | 'counseling'>('feedback');

  // 학생 보고서 데이터 가져오기
  useEffect(() => {
    const fetchStudentReport = async () => {
      if (!userInfo || !userInfo.userId) {
        setError("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data: StudentReportData = await getStudentReport(Number(userInfo.userId));
        
        // 피드백 데이터 추출
        let feedbackData: FeedbackItem[] = [];
        if (data.feedbackList?.feedbacks && data.feedbackList.feedbacks.length > 0) {
          feedbackData = data.feedbackList.feedbacks;
        } else if (data.data?.feedbackList && data.data.feedbackList.length > 0) {
          feedbackData = data.data.feedbackList;
        }
        setFeedbacks(feedbackData);

        // 상담 데이터 추출
        let counselData: CounselingItem[] = [];
        if (data.counselList?.counsels && data.counselList.counsels.length > 0) {
          counselData = data.counselList.counsels;
        } else if (data.data?.counselList && data.data.counselList.length > 0) {
          counselData = data.data.counselList;
        }
        setCounsels(counselData);

      } catch (err) {
        console.error("학생 보고서 데이터 조회 오류:", err);
        setError("보고서 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentReport();
  }, [userInfo]);

  // 피드백 필터링
  useEffect(() => {
    let filtered = [...feedbacks];
    
    if (selectedYear) {
      filtered = filtered.filter((feedback) => {
        const year = new Date(feedback.createdAt).getFullYear().toString();
        return year === selectedYear;
      });
    }
    
    setFilteredFeedbacks(filtered);
  }, [feedbacks, selectedYear]);

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
    feedbacks.forEach((feedback) => {
      if (feedback.createdAt) {
        try {
          const year = new Date(feedback.createdAt).getFullYear().toString();
          years.add(year);
        } catch (err) {
          console.error('날짜 파싱 오류:', err);
        }
      }
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // 내림차순 정렬
  };

  // 학년/반/번호 정보 구성
  const getUserInfoText = () => {
    if (!userInfo) return "";
    const grade = userInfo.roleInfo?.match(/\d+학년/)?.[0] || "";
    const classNum = userInfo.roleInfo?.match(/\d+반/)?.[0] || "";
    const studentNum = userInfo.number ? `${userInfo.number}번` : "";
    return `${grade} ${classNum} ${studentNum}`.trim();
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || ""}
      userRole="학생"
      userInfo={getUserInfoText()}
      notificationCount={0}
    >
      <StudentSidebar isCollapsed={false} />
      <PageContainer>
        <ContentArea>
          <PageHeader>
            <PageTitle>피드백 및 상담 내역</PageTitle>
          </PageHeader>

          {isLoading ? (
            <EmptyState>
              <h3>데이터를 불러오는 중입니다...</h3>
            </EmptyState>
          ) : error ? (
            <EmptyState>
              <h3>오류가 발생했습니다</h3>
              <p>{error}</p>
            </EmptyState>
          ) : (
            <>
              <TabContainer>
                <TabButton 
                  active={activeTab === 'feedback'}
                  onClick={() => setActiveTab('feedback')}
                >
                  피드백 내역
                </TabButton>
                <TabButton 
                  active={activeTab === 'counseling'}
                  onClick={() => setActiveTab('counseling')}
                >
                  상담 내역
                </TabButton>
              </TabContainer>

              {activeTab === 'feedback' && (
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
              )}
            </>
          )}

          {!isLoading && !error && (
            <Card>
              {activeTab === 'feedback' ? (
                filteredFeedbacks.length > 0 ? (
                  <FeedbackGrid>
                    {filteredFeedbacks.map((feedback, index) => (
                      <FeedbackCard key={feedback.id || index}>
                        <FeedbackHeader>
                          <FeedbackDate>
                            {feedback.title || '피드백'}
                            <div>{formatDate(feedback.createdAt)}</div>
                          </FeedbackDate>
                        </FeedbackHeader>
                        <FeedbackContent>
                          {feedback.scoreFeed && (
                            <FeedbackSection>
                              <FeedbackSectionTitle>
                                학업 성취
                              </FeedbackSectionTitle>
                              <FeedbackSectionContent>
                                {feedback.scoreFeed}
                              </FeedbackSectionContent>
                            </FeedbackSection>
                          )}
                          {feedback.behaviorFeed && (
                            <FeedbackSection>
                              <FeedbackSectionTitle>
                                행동 발달
                              </FeedbackSectionTitle>
                              <FeedbackSectionContent>
                                {feedback.behaviorFeed}
                              </FeedbackSectionContent>
                            </FeedbackSection>
                          )}
                          {feedback.otherFeed && (
                            <FeedbackSection>
                              <FeedbackSectionTitle>
                                기타 사항
                              </FeedbackSectionTitle>
                              <FeedbackSectionContent>
                                {feedback.otherFeed}
                              </FeedbackSectionContent>
                            </FeedbackSection>
                          )}
                        </FeedbackContent>
                      </FeedbackCard>
                    ))}
                  </FeedbackGrid>
                ) : (
                  <EmptyState>
                    <h3>표시할 피드백이 없습니다</h3>
                    <p>선생님이 작성한 피드백이 이곳에 표시됩니다.</p>
                  </EmptyState>
                )
              ) : (
                counsels.length > 0 ? (
                  <FeedbackGrid>
                    {counsels.map((counsel, index) => (
                      <FeedbackCard key={counsel.id || index}>
                        <FeedbackHeader>
                          <FeedbackDate>
                            {counsel.title || '상담 내용'}
                            <div>{formatDate(counsel.createdAt)}</div>
                          </FeedbackDate>
                        </FeedbackHeader>
                        <FeedbackContent>
                          <FeedbackSection>
                            <FeedbackSectionTitle>
                              상담 내용
                            </FeedbackSectionTitle>
                            <FeedbackSectionContent>
                              {counsel.context}
                            </FeedbackSectionContent>
                          </FeedbackSection>
                          {counsel.plan && (
                            <FeedbackSection>
                              <FeedbackSectionTitle>
                                후속 계획
                              </FeedbackSectionTitle>
                              <FeedbackSectionContent>
                                {counsel.plan}
                              </FeedbackSectionContent>
                            </FeedbackSection>
                          )}
                        </FeedbackContent>
                      </FeedbackCard>
                    ))}
                  </FeedbackGrid>
                ) : (
                  <EmptyState>
                    <h3>표시할 상담 내역이 없습니다</h3>
                    <p>선생님과의 상담 내역이 이곳에 표시됩니다.</p>
                  </EmptyState>
                )
              )}
            </Card>
          )}
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentFeedbackPage;
