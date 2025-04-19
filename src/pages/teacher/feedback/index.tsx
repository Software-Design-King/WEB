import React, { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";
import styled from "@emotion/styled";
import { colors, typography } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";

// 타입 정의
interface Student {
  id: string;
  name: string;
  grade: number;
  classNum: number;
  number: number;
}

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

const StudentSelector = styled.div`
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SelectorLabel = styled.label`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
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

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
  
  option {
    color: ${colors.text.primary};
    background-color: white;
  }
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

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const SharingSection = styled.div`
  padding: 1rem;
  background-color: ${colors.grey[50]};
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const SharingSectionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 0.75rem 0;
`;

const CheckboxContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${colors.primary.main};
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${colors.text.primary};
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
`;

const SecondaryButton = styled(Button)`
  background-color: ${colors.grey[200]};
  color: ${colors.text.primary};

  &:hover {
    background-color: ${colors.grey[300]};
  }
`;

const FeedbackHistory = styled.div`
  width: 100%;
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
  background: white;
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

const FeedbackDate = styled.div`
  background-color: ${colors.grey[50]};
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.secondary};
  font-size: 0.85rem;
  font-weight: 500;
`;

const FeedbackContent = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeedbackSection = styled.div`
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed ${colors.grey[200]};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const FeedbackSectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin: 0 0 0.5rem 0;
`;

const FeedbackSectionContent = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${colors.text.primary};
  margin: 0;
  white-space: pre-line;
`;

const FeedbackSharing = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${colors.grey[50]};
  border-top: 1px solid ${colors.grey[200]};
`;

const FeedbackTag = styled.div<{ shared: boolean }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background-color: ${(props) =>
    props.shared ? colors.success.light : colors.grey[200]};
  color: ${(props) =>
    props.shared ? colors.success.dark : colors.text.secondary};
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.text.secondary};
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

// 임시 데이터
const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "김철수", grade: 2, classNum: 1, number: 1 },
  { id: "2", name: "이영희", grade: 2, classNum: 1, number: 2 },
  { id: "3", name: "박지민", grade: 2, classNum: 1, number: 3 },
  { id: "4", name: "정민준", grade: 2, classNum: 1, number: 4 },
  { id: "5", name: "윤서연", grade: 2, classNum: 1, number: 5 },
];

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
  },
];

const TeacherFeedbackPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("new");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(MOCK_FEEDBACKS);
  const [studentFeedbacks, setStudentFeedbacks] = useState<FeedbackItem[]>([]);
  const [formData, setFormData] = useState({
    academicContent: "",
    behavioralContent: "",
    attendanceContent: "",
    attitudeContent: "",
    otherContent: "",
    isSharedWithStudent: false,
    isSharedWithParent: false,
  });

  // Mock 교사 정보
  const teacherData = {
    name: "권도훈",
    role: "교사",
    subject: "수학",
  };

  // 학생이 선택되면 해당 학생의 피드백 히스토리 불러오기
  useEffect(() => {
    if (selectedStudentId) {
      // 실제로는 API 호출로 대체
      const filteredFeedbacks = MOCK_FEEDBACKS.filter(
        (feedback) => feedback.studentId === selectedStudentId
      );
      setStudentFeedbacks(filteredFeedbacks);

      // 새 피드백 폼 초기화
      setFormData({
        academicContent: "",
        behavioralContent: "",
        attendanceContent: "",
        attitudeContent: "",
        otherContent: "",
        isSharedWithStudent: false,
        isSharedWithParent: false,
      });
    }
  }, [selectedStudentId]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(e.target.value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 실제로는 API 호출로 대체
    const newFeedbackItem: FeedbackItem = {
      id: Date.now().toString(),
      studentId: selectedStudentId,
      academicContent: formData.academicContent,
      behavioralContent: formData.behavioralContent,
      attendanceContent: formData.attendanceContent,
      attitudeContent: formData.attitudeContent,
      otherContent: formData.otherContent,
      isSharedWithStudent: formData.isSharedWithStudent,
      isSharedWithParent: formData.isSharedWithParent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 임시로 상태에 추가
    setFeedbacks([newFeedbackItem, ...feedbacks]);
    setStudentFeedbacks([newFeedbackItem, ...studentFeedbacks]);

    // 폼 초기화
    setFormData({
      academicContent: "",
      behavioralContent: "",
      attendanceContent: "",
      attitudeContent: "",
      otherContent: "",
      isSharedWithStudent: false,
      isSharedWithParent: false,
    });

    // 성공 메시지
    alert("피드백이 성공적으로 저장되었습니다.");
  };

  // 날짜 포맷팅 함수 (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 학생 정보 가져오기
  const getStudentName = (id: string) => {
    const student = MOCK_STUDENTS.find((s) => s.id === id);
    return student
      ? `${student.grade}학년 ${student.classNum}반 ${student.number}번 ${student.name}`
      : "";
  };

  return (
    <DashboardLayout
      userName={teacherData.name}
      userRole={teacherData.role}
      userInfo={teacherData.subject}
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />
      <PageContainer>
        <ContentArea>
          <StudentSelector>
            <SelectorLabel>학생 선택</SelectorLabel>
            <Select value={selectedStudentId} onChange={handleStudentChange}>
              <option value="">-- 학생을 선택하세요 --</option>
              {MOCK_STUDENTS.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.grade}학년 {student.classNum}반 {student.number}번{" "}
                  {student.name}
                </option>
              ))}
            </Select>
          </StudentSelector>

          {selectedStudentId && (
            <>
              <TabsWrapper>
                <TabContainer>
                  <Tab
                    active={activeTab === "new"}
                    onClick={() => setActiveTab("new")}
                  >
                    새 피드백 작성
                  </Tab>
                  <Tab
                    active={activeTab === "history"}
                    onClick={() => setActiveTab("history")}
                  >
                    피드백 이력
                  </Tab>
                </TabContainer>
              </TabsWrapper>

              {activeTab === "new" ? (
                <Card>
                  <FormTitle>
                    학생 피드백 작성 - {getStudentName(selectedStudentId)}
                  </FormTitle>
                  <CompactForm onSubmit={handleSubmit}>
                    <CategorySection>
                      <FormTitle>학업 관련</FormTitle>
                      <FormGrid>
                        <FormGroup>
                          <Label>학업 성취</Label>
                          <TextArea
                            name="academicContent"
                            value={formData.academicContent}
                            onChange={handleInputChange}
                            placeholder="학업 성취에 대한 피드백을 작성하세요."
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>학습 태도</Label>
                          <TextArea
                            name="attitudeContent"
                            value={formData.attitudeContent}
                            onChange={handleInputChange}
                            placeholder="학습 태도에 대한 피드백을 작성하세요."
                          />
                        </FormGroup>
                      </FormGrid>
                    </CategorySection>

                    <CategorySection>
                      <FormTitle>생활 및 행동</FormTitle>
                      <FormGrid>
                        <FormGroup>
                          <Label>행동 발달</Label>
                          <TextArea
                            name="behavioralContent"
                            value={formData.behavioralContent}
                            onChange={handleInputChange}
                            placeholder="행동 발달에 대한 피드백을 작성하세요."
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>출석 상황</Label>
                          <TextArea
                            name="attendanceContent"
                            value={formData.attendanceContent}
                            onChange={handleInputChange}
                            placeholder="출석 상황에 대한 피드백을 작성하세요."
                          />
                        </FormGroup>
                      </FormGrid>
                    </CategorySection>

                    <FormGroup>
                      <Label>기타 사항</Label>
                      <TextArea
                        name="otherContent"
                        value={formData.otherContent}
                        onChange={handleInputChange}
                        placeholder="기타 사항이 있다면 작성하세요."
                      />
                    </FormGroup>

                    <SharingSection>
                      <SharingSectionTitle>공유 설정</SharingSectionTitle>
                      <CheckboxContainer>
                        <CheckboxGroup>
                          <Checkbox
                            type="checkbox"
                            id="isSharedWithStudent"
                            name="isSharedWithStudent"
                            checked={formData.isSharedWithStudent}
                            onChange={handleCheckboxChange}
                          />
                          <CheckboxLabel htmlFor="isSharedWithStudent">
                            학생과 공유
                          </CheckboxLabel>
                        </CheckboxGroup>
                        <CheckboxGroup>
                          <Checkbox
                            type="checkbox"
                            id="isSharedWithParent"
                            name="isSharedWithParent"
                            checked={formData.isSharedWithParent}
                            onChange={handleCheckboxChange}
                          />
                          <CheckboxLabel htmlFor="isSharedWithParent">
                            학부모와 공유
                          </CheckboxLabel>
                        </CheckboxGroup>
                      </CheckboxContainer>
                    </SharingSection>

                    <ButtonContainer>
                      <SecondaryButton
                        type="button"
                        onClick={() => setActiveTab("history")}
                      >
                        취소
                      </SecondaryButton>
                      <PrimaryButton type="submit">피드백 저장</PrimaryButton>
                    </ButtonContainer>
                  </CompactForm>
                </Card>
              ) : (
                <FeedbackHistory>
                  {studentFeedbacks.length > 0 ? (
                    <FeedbackGrid>
                      {studentFeedbacks.map((feedback) => (
                        <FeedbackCard key={feedback.id}>
                          <FeedbackDate>
                            {formatDate(feedback.createdAt)}
                          </FeedbackDate>
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
                      아직 이 학생에 대한 피드백 이력이 없습니다.
                    </EmptyState>
                  )}
                </FeedbackHistory>
              )}
            </>
          )}
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default TeacherFeedbackPage;
