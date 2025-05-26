import React from "react";
import { Spin, Empty, Switch, Select, Badge } from "antd";
import { PlusOutlined, HistoryOutlined } from "@ant-design/icons";
import { Feedback } from "../../../../apis/feedback";
import { FeedbackFormData, FeedbackType, FeedbackTypeOption } from "../types";
import {
  TabsWrapper,
  TabContainer,
  Tab,
  Card,
  FormTitle,
  CompactForm,
  FormGrid,
  FormGroup,
  Label,
  TextArea,
  CheckboxContainer,
  CheckboxItem,
  CheckboxLabel,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton,
  LoadingContainer,
  EmptyStateContainer,
  StickyNoteContainer,
  StickyNote,
  NoteHeader,
  NoteTitle,
  NoteContent,
  NewNoteCard,
  NewNoteIcon,
  NewNoteText,
} from "../styles";

interface FeedbackPresenterProps {
  activeTab: "write" | "history";
  selectedStudentId: string;
  isLoading: boolean;
  feedbacks: Feedback[];
  visibleFeedbacks: number;
  selectedFeedbackType: FeedbackType;
  showNewNoteForm: boolean;
  formData: FeedbackFormData;
  feedbackTypeOptions: FeedbackTypeOption[];
  handleTabChange: (tab: "write" | "history") => void;
  handleSelectFeedbackType: (type: FeedbackType) => void;
  handleInputChange: (field: keyof FeedbackFormData, value: string | boolean) => void;
  handleSubmitFeedback: (e: React.FormEvent) => void;
  handleShowMoreFeedbacks: () => void;
  setShowNewNoteForm: (show: boolean) => void;
  formatDate: (dateString: string) => string;
  getCurrentFeedbackTypeOption: () => FeedbackTypeOption;
}

export const FeedbackPresenter: React.FC<FeedbackPresenterProps> = ({
  activeTab,
  selectedStudentId,
  isLoading,
  feedbacks,
  visibleFeedbacks,
  selectedFeedbackType,
  showNewNoteForm,
  formData,
  feedbackTypeOptions,
  handleTabChange,
  handleSelectFeedbackType,
  handleInputChange,
  handleSubmitFeedback,
  handleShowMoreFeedbacks,
  setShowNewNoteForm,
  formatDate,
  getCurrentFeedbackTypeOption,
}) => {
  if (!selectedStudentId) {
    return (
      <EmptyStateContainer>
        <Empty description="좌측에서 학생을 선택해주세요." />
      </EmptyStateContainer>
    );
  }

  return (
    <>
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

      {activeTab === "write" ? (
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
                        handleSelectFeedbackType(key as FeedbackType);
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
                      onChange={(value: FeedbackType) => handleSelectFeedbackType(value)}
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
                  // 피드백 내용이 있는 필드만 표시
                  const feedbackFields = [
                    { key: 'scoreFeed', value: feedback.scoreFeed, label: '학업 성취', icon: feedbackTypeOptions[0].icon, color: feedbackTypeOptions[0].color },
                    { key: 'behaviorFeed', value: feedback.behaviorFeed, label: '행동 발달', icon: feedbackTypeOptions[1].icon, color: feedbackTypeOptions[1].color },
                    { key: 'attendanceFeed', value: feedback.attendanceFeed, label: '출석 상황', icon: feedbackTypeOptions[2].icon, color: feedbackTypeOptions[2].color },
                    { key: 'attitudeFeed', value: feedback.attitudeFeed, label: '학습 태도', icon: feedbackTypeOptions[3].icon, color: feedbackTypeOptions[3].color },
                    { key: 'othersFeed', value: feedback.othersFeed, label: '기타 사항', icon: feedbackTypeOptions[4].icon, color: feedbackTypeOptions[4].color }
                  ].filter(field => field.value && field.value.trim() !== '');
                  
                  return feedbackFields.map((field) => (
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
      )}
    </>
  );
};
