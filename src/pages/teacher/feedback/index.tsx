import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import StudentSidebar from "../../../components/teacher/StudentSidebar";
import {
  getFeedbackList,
  createFeedback,
  Feedback,
} from "../../../apis/feedback";
import { message, Spin, Empty, Switch, Select, Badge } from "antd";
import { useUserStore } from "../../../stores/userStore";
import { PlusOutlined, EditOutlined, BookOutlined, UserOutlined, FieldTimeOutlined, ScheduleOutlined, HistoryOutlined } from "@ant-design/icons";

// 타입 정의
interface FeedbackFormData {
  scoreFeed: string;
  behaviorFeed: string;
  attendanceFeed: string;
  attitudeFeed: string;
  OthersFeed: string;
  isSharedWithStudent: boolean;
  isSharedWithParent: boolean;
}

type FeedbackType = 'scoreFeed' | 'behaviorFeed' | 'attendanceFeed' | 'attitudeFeed' | 'OthersFeed';

interface FeedbackTypeOption {
  value: FeedbackType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// 스타일 컴포넌트
const PageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;

const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const TabsWrapper = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: none;
  width: 100%;
  max-width: 500px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.active ? colors.primary.main : "white")};
  color: ${(props) => (props.active ? "white" : colors.text.secondary)};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) =>
      props.active ? colors.primary.main : colors.grey[100]};
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) =>
      props.active ? colors.primary.light : "transparent"};
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const StickyNoteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const StickyNote = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: rotate(${() => Math.random() * 2 - 1}deg);
  
  &:hover {
    transform: translateY(-5px) rotate(0);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 20px;
    width: 40px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 5px 5px;
  }
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
`;

const NoteTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: rgba(0, 0, 0, 0.75);
`;

const NoteContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
`;

const NewNoteCard = styled.div<{ active?: boolean }>`
  background-color: white;
  border: 2px dashed ${props => props.active ? colors.primary.main : colors.grey[300]};
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary.main};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const NewNoteIcon = styled.div`
  font-size: 2rem;
  color: ${colors.primary.main};
  margin-bottom: 1rem;
`;

const NewNoteText = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin: 0;
  text-align: center;
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const CompactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  min-height: 100px;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  background-color: white;
  resize: vertical;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  &::placeholder {
    color: ${colors.grey[400]};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${colors.primary.main};
  color: white;

  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px ${colors.primary.main}40;
  }

  &:disabled {
    background-color: ${colors.grey[400]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${colors.grey[200]};
  color: ${colors.text.primary};

  &:hover {
    background-color: ${colors.grey[300]};
    box-shadow: 0 4px 8px ${colors.grey[300]}40;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeedbackItem = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background-color: ${colors.grey[50]};
  border-bottom: 1px solid ${colors.grey[200]};
`;

const FeedbackDate = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
`;

const FeedbackGrade = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${colors.text.primary};
  background-color: ${colors.grey[200]};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const SharingInfo = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SharingStatus = styled.div<{ shared: boolean }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.shared ? colors.success.light : colors.grey[200]};
  color: ${props => props.shared ? colors.success.dark : colors.text.secondary};
`;

const FeedbackContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeedbackSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.text.secondary};
  margin: 0;
`;

const SectionContent = styled.p`
  font-size: 0.95rem;
  color: ${colors.text.primary};
  margin: 0;
  line-height: 1.5;
`;

const TeacherFeedbackPage: React.FC = () => {
  // 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<"write" | "history">("write");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [visibleFeedbacks, setVisibleFeedbacks] = useState<number>(6);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<FeedbackType>("scoreFeed");
  const [showNewNoteForm, setShowNewNoteForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    scoreFeed: "",
    behaviorFeed: "",
    attendanceFeed: "",
    attitudeFeed: "",
    OthersFeed: "",
    isSharedWithStudent: false,
    isSharedWithParent: false,
  });
  
  // 피드백 유형 옵션
  const feedbackTypeOptions: FeedbackTypeOption[] = [
    { value: "scoreFeed", label: "학업 성취", icon: <BookOutlined />, color: "#FFECB3" },
    { value: "behaviorFeed", label: "행동 발달", icon: <UserOutlined />, color: "#E1F5FE" },
    { value: "attendanceFeed", label: "출석 상황", icon: <FieldTimeOutlined />, color: "#E8F5E9" },
    { value: "attitudeFeed", label: "학습 태도", icon: <EditOutlined />, color: "#F3E5F5" },
    { value: "OthersFeed", label: "기타 사항", icon: <ScheduleOutlined />, color: "#FFEBEE" },
  ];
  
  // 현재 선택된 피드백 유형 정보 가져오기
  const getCurrentFeedbackTypeOption = () => {
    return feedbackTypeOptions.find(option => option.value === selectedFeedbackType) || feedbackTypeOptions[0];
  };

  // 피드백 목록 조회
  const fetchFeedbacks = useCallback(async () => {
    if (!selectedStudentId) return;
    
    setIsLoading(true);
    try {
      const response = await getFeedbackList(selectedStudentId, 0);
      if (response.code === 20000) {
        // 최신순 정렬
        const sortedFeedbacks = [...response.data.feedbacks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(sortedFeedbacks);
      } else {
        message.error("피드백 이력을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("피드백 이력 조회 중 오류 발생:", error);
      message.error("피드백 이력을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudentId]);

  // 학생 선택 시 피드백 이력 조회
  useEffect(() => {
    if (selectedStudentId && activeTab === "history") {
      fetchFeedbacks();
    }
  }, [selectedStudentId, activeTab, fetchFeedbacks]);

  // 학생 선택 핸들러
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: "write" | "history") => {
    setActiveTab(tab);
    if (tab === "history" && selectedStudentId) {
      fetchFeedbacks();
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (field: keyof FeedbackFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 더보기 버튼 핸들러
  const handleShowMoreFeedbacks = () => {
    setVisibleFeedbacks(prev => prev + 2);
  };

  // 피드백 제출 핸들러
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      message.warning("학생을 먼저 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createFeedback(selectedStudentId, formData);
      if (response.code === 20000) {
        message.success("피드백이 성공적으로 등록되었습니다.");
        // 폼 초기화
        setFormData({
          scoreFeed: "",
          behaviorFeed: "",
          attendanceFeed: "",
          attitudeFeed: "",
          OthersFeed: "",
          isSharedWithStudent: false,
          isSharedWithParent: false,
        });
        // 이력 탭으로 전환하고 이력 조회
        setActiveTab("history");
        fetchFeedbacks();
      } else {
        message.error("피드백 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("피드백 등록 중 오류 발생:", error);
      message.error("피드백 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 피드백 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || "선생님"}
      userRole="교사"
      userInfo="피드백 관리"
      notificationCount={0}
    >
      <TeacherSidebar isCollapsed={false} />
      <PageContainer>
        {/* 학생 사이드바 */}
        <StudentSidebar 
          onSelectStudent={handleSelectStudent} 
          selectedStudentId={selectedStudentId} 
        />
        
        <ContentArea>
          <h1>피드백 관리</h1>
          <p>학생들의 학습 및 행동 피드백을 관리합니다.</p>
          
          {/* 탭 (피드백 작성 / 피드백 이력) */}
          <TabsWrapper>
            <TabContainer>
              <Tab
                active={activeTab === "write"}
                onClick={() => handleTabChange("write")}
              >
                피드백 작성
              </Tab>
              <Tab
                active={activeTab === "history"}
                onClick={() => handleTabChange("history")}
              >
                피드백 이력
              </Tab>
            </TabContainer>
          </TabsWrapper>

          {selectedStudentId ? (
            /* 내용 영역 */
            activeTab === "write" ? (
              <div>
                <FormTitle>학생 피드백 작성</FormTitle>
                
                {!showNewNoteForm ? (
                  <StickyNoteContainer>
                    {/* 새 피드백 추가 버튼 */}
                    <NewNoteCard onClick={() => setShowNewNoteForm(true)}>
                      <NewNoteIcon>
                        <PlusOutlined />
                      </NewNoteIcon>
                      <NewNoteText>새 피드백 노트 추가하기</NewNoteText>
                    </NewNoteCard>
                    
                    {/* 기존에 작성된 피드백 표시 */}
                    {Object.entries(formData)
                      .filter(([key, value]) => 
                        key !== 'isSharedWithStudent' && 
                        key !== 'isSharedWithParent' && 
                        value.trim() !== ''
                      )
                      .map(([key, value]) => {
                        const option = feedbackTypeOptions.find(opt => opt.value === key);
                        if (!option) return null;
                        
                        return (
                          <StickyNote 
                            key={key} 
                            color={option.color}
                            onClick={() => {
                              setSelectedFeedbackType(key as FeedbackType);
                              setShowNewNoteForm(true);
                            }}
                          >
                            <NoteHeader>
                              {option.icon} <NoteTitle>{option.label}</NoteTitle>
                            </NoteHeader>
                            <NoteContent>{value}</NoteContent>
                          </StickyNote>
                        );
                      })}
                  </StickyNoteContainer>
                ) : (
                  <Card>
                    <FormTitle>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          {getCurrentFeedbackTypeOption().icon} {getCurrentFeedbackTypeOption().label} 피드백 작성
                        </div>
                        <SecondaryButton 
                          style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                          onClick={() => setShowNewNoteForm(false)}
                        >
                          목록으로 돌아가기
                        </SecondaryButton>
                      </div>
                    </FormTitle>
                    <CompactForm onSubmit={handleSubmitFeedback}>
                      <FormGrid>
                        <FormGroup>
                          <Label>피드백 유형</Label>
                          <Select
                            value={selectedFeedbackType}
                            onChange={(value: FeedbackType) => setSelectedFeedbackType(value)}
                            style={{ width: '100%' }}
                          >
                            {feedbackTypeOptions.map(option => (
                              <Select.Option key={option.value} value={option.value}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Badge color={option.color} />
                                  {option.icon} {option.label}
                                </div>
                              </Select.Option>
                            ))}
                          </Select>
                        </FormGroup>
                        
                        <FormGroup>
                          <Label>피드백 내용</Label>
                          <TextArea 
                            placeholder={`${getCurrentFeedbackTypeOption().label}에 대한 피드백을 작성하세요`}
                            value={formData[selectedFeedbackType]}
                            onChange={(e) => handleInputChange(selectedFeedbackType, e.target.value)}
                            style={{
                              backgroundColor: `${getCurrentFeedbackTypeOption().color}20`,
                              borderColor: getCurrentFeedbackTypeOption().color,
                              minHeight: '150px'
                            }}
                          />
                        </FormGroup>
                        
                        <div>
                          <CheckboxContainer>
                            <Label>공유 설정</Label>
                            <CheckboxItem>
                              <Switch 
                                checked={formData.isSharedWithStudent}
                                onChange={(checked) => handleInputChange("isSharedWithStudent", checked)}
                              />
                              <CheckboxLabel>
                                학생에게 공유
                              </CheckboxLabel>
                            </CheckboxItem>
                            <CheckboxItem>
                              <Switch 
                                checked={formData.isSharedWithParent}
                                onChange={(checked) => handleInputChange("isSharedWithParent", checked)}
                              />
                              <CheckboxLabel>
                                학부모에게 공유
                              </CheckboxLabel>
                            </CheckboxItem>
                          </CheckboxContainer>
                        </div>

                        <ButtonContainer>
                          <PrimaryButton type="submit" disabled={isLoading}>
                            {isLoading ? "저장 중..." : "피드백 저장"}
                          </PrimaryButton>
                        </ButtonContainer>
                      </FormGrid>
                    </CompactForm>
                  </Card>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <FormTitle>
                    <HistoryOutlined style={{ marginRight: '8px' }} /> 피드백 이력
                  </FormTitle>
                </div>
                
                {isLoading ? (
                  <LoadingContainer>
                    <Spin tip="피드백 이력을 불러오는 중..." />
                  </LoadingContainer>
                ) : feedbacks.length === 0 ? (
                  <Empty description="피드백 이력이 없습니다." />
                ) : (
                  <>
                    <StickyNoteContainer>
                      {feedbacks.slice(0, visibleFeedbacks).map((feedback, index) => {
                        const createdDate = new Date(feedback.createdAt);
                        // 피드백 내용이 있는 필드만 표시
                        const feedbackFields = [
                          { key: 'scoreFeed', value: feedback.scoreFeed, label: '학업 성취', icon: <BookOutlined />, color: '#FFECB3' },
                          { key: 'behaviorFeed', value: feedback.behaviorFeed, label: '행동 발달', icon: <UserOutlined />, color: '#E1F5FE' },
                          { key: 'attendanceFeed', value: feedback.attendanceFeed, label: '출석 상황', icon: <FieldTimeOutlined />, color: '#E8F5E9' },
                          { key: 'attitudeFeed', value: feedback.attitudeFeed, label: '학습 태도', icon: <EditOutlined />, color: '#F3E5F5' },
                          { key: 'othersFeed', value: feedback.othersFeed, label: '기타 사항', icon: <ScheduleOutlined />, color: '#FFEBEE' }
                        ].filter(field => field.value && field.value.trim() !== '');
                        
                        return feedbackFields.map((field, fieldIndex) => (
                          <StickyNote 
                            key={`${index}-${field.key}`} 
                            color={field.color}
                            style={{ transform: `rotate(${Math.random() * 3 - 1.5}deg)` }}
                          >
                            <NoteHeader>
                              {field.icon} <NoteTitle>{field.label}</NoteTitle>
                            </NoteHeader>
                            <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                              <span style={{ marginRight: '0.5rem' }}>{formatDate(feedback.createdAt)}</span>
                              <span style={{ marginRight: '0.5rem' }}>{feedback.grade}학년</span>
                              <div style={{ marginTop: '0.25rem' }}>
                                {feedback.sharedWithStudent && (
                                  <Badge status="success" text="학생 공유" style={{ marginRight: '0.5rem' }} />
                                )}
                                {feedback.sharedWithParent && (
                                  <Badge status="success" text="학부모 공유" />
                                )}
                              </div>
                            </div>
                            <NoteContent>{field.value}</NoteContent>
                          </StickyNote>
                        ));
                      })}
                    </StickyNoteContainer>
                    
                    {feedbacks.length > visibleFeedbacks && (
                      <ButtonContainer>
                        <SecondaryButton onClick={handleShowMoreFeedbacks}>
                          더 보기
                        </SecondaryButton>
                      </ButtonContainer>
                    )}
                  </>
                )}
              </div>
            )
          ) : (
            <EmptyStateContainer>
              <Empty description="좌측에서 학생을 선택해주세요." />
            </EmptyStateContainer>
          )}
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default TeacherFeedbackPage;
