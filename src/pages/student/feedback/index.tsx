import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useUserStore } from "../../../stores/userStore";
import { message } from "antd";
import axios from "axios";

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

  // 피드백과 상담 데이터를 가져오는 함수
  const fetchFeedbackData = useCallback(async () => {
    if (!userInfo || !userInfo.userId) {
      setError("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
      const studentId = userInfo.userId;
      
      // 피드백 데이터만 가져오기 - 피드백 탭용
      const feedbackResponse = await axios.get(`${API_BASE_URL}/feedback/${studentId}?grade=0`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Feedback API Response:', feedbackResponse.data);
      
      if (feedbackResponse.status === 200) {
        // API 응답 구조 문서화에 따른 정확한 데이터 추출
        // 대응하는 데이터 구조에 맞춰 조정
        let feedbackList = [];
        if (feedbackResponse.data.data) {
          // data 필드에 있는 경우
          feedbackList = feedbackResponse.data.data.feedbacks || feedbackResponse.data.data;
        } else if (feedbackResponse.data.feedbacks) {
          // 직접 feedbacks 필드에 있는 경우
          feedbackList = feedbackResponse.data.feedbacks;
        } else {
          // 그 외의 경우 전체 응답을 데이터로 간주
          feedbackList = feedbackResponse.data;
        }
        
        if (Array.isArray(feedbackList)) {
          setFeedbacks(feedbackList);
        } else {
          console.error('피드백 데이터가 배열 형태가 아닙니다:', feedbackList);
          setFeedbacks([]);
        }
      }

      // 상담 데이터만 가져오기 - 상담 탭용
      const counselResponse = await axios.get(`${API_BASE_URL}/counsel/${studentId}?grade=0`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Counsel API Response:', counselResponse.data);
      
      if (counselResponse.status === 200) {
        // API 응답 구조 문서화에 따른 정확한 데이터 추출
        let counselList = [];
        if (counselResponse.data.data) {
          // data 필드에 있는 경우
          counselList = counselResponse.data.data.counsels || counselResponse.data.data;
        } else if (counselResponse.data.counsels) {
          // 직접 counsels 필드에 있는 경우
          counselList = counselResponse.data.counsels;
        } else {
          // 그 외의 경우 전체 응답을 데이터로 간주
          counselList = counselResponse.data;
        }
        
        if (Array.isArray(counselList)) {
          setCounsels(counselList);
        } else {
          console.error('상담 데이터가 배열 형태가 아닙니다:', counselList);
          setCounsels([]);
        }
      }

    } catch (err) {
      console.error("학생 데이터 조회 오류:", err);
      message.error("데이터를 불러오는데 실패했습니다.");
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [userInfo]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  // 피드백 필터링
  useEffect(() => {
    let filtered = [...feedbacks];
    
    if (selectedYear) {
      filtered = filtered.filter((feedback) => {
        try {
          // feedback.createdAt가 존재하는지 확인
          if (!feedback.createdAt) {
            return false;
          }
          const year = new Date(feedback.createdAt).getFullYear().toString();
          return year === selectedYear;
        } catch (err) {
          console.error('날짜 처리 오류:', err, feedback);
          return false; // 오류 발생 시 해당 아이템 제외
        }
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
    const userInfo = useUserStore((state) => state.userInfo);
    const studentId = userInfo?.userType === "PARENT" ? userInfo?.studentId : userInfo?.userId;
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
