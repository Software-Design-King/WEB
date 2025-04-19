import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../../stores/userStore';
import styled from '@emotion/styled';
import { colors } from '../../../components/common/Common.styles';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import TeacherSidebar from '../../../components/layout/TeacherSidebar';

// 타입 정의
interface Student {
  id: string;
  name: string;
  grade: number;
  classNum: number;
  number: number;
}

interface ConsultationRecord {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  content: string;
  nextPlan: string;
  tags: string[];
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

const FilterContainer = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

const Select = styled.select`
  width: 100%;
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

  option {
    color: ${colors.text.primary};
    background-color: white;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  min-height: 100px;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  background-color: white;
  line-height: 1.5;
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

const SearchButton = styled(Button)`
  background-color: ${colors.primary.main};
  color: white;
  width: 100%;
  
  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px ${colors.primary.main}40;
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
  background: ${(props) => (props.active ? colors.primary.main : 'white')};
  color: ${(props) => (props.active ? 'white' : colors.text.secondary)};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${(props) => (props.active ? colors.primary.main : colors.grey[100])};
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) => (props.active ? colors.primary.light : 'transparent')};
  }
`;

const PageHeader = styled.div`
  background-color: ${colors.primary.main};
  color: white;
  padding: 1.5rem 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 700;
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

const ConsultationForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const FormGroup = styled.div<{ flex?: number }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TagInput = styled(Input)`
  margin-bottom: 0.5rem;
`;

const Tag = styled.div`
  padding: 0.35rem 0.75rem;
  background-color: ${colors.grey[100]};
  border-radius: 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 500;
  color: ${colors.text.secondary};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${colors.grey[200]};
  }
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  padding: 0;
  
  &:hover {
    color: ${colors.error.main};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin: 0;
  margin-right: 0.5rem;
  cursor: pointer;
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
  margin-top: 1.5rem;
  grid-column: 1 / -1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
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
  background-color: white;
  border: 1px solid ${colors.primary.main};
  color: ${colors.primary.main};
  
  &:hover {
    background-color: ${colors.primary.light}20;
  }
`;

const ConsultationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConsultationCardTeacher = styled.div`
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
  justify-content: space-between;
  align-items: center;
`;

const StudentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0;
  }
  
  p {
    font-size: 0.85rem;
    color: ${colors.text.secondary};
    margin: 0;
  }
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

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`;

const HistoryTag = styled.span`
  padding: 0.25rem 0.6rem;
  background-color: ${colors.grey[100]};
  color: ${colors.text.secondary};
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ConsultationFooter = styled.div`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.grey[50]};
  border-top: 1px solid ${colors.grey[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SharingStatus = styled.div<{ shared: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.shared ? colors.success.main : colors.text.secondary};
  
  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.shared ? colors.success.main : colors.text.secondary};
    margin-right: 4px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
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

const ConsultationDate = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${colors.primary.dark};
`;

// 임시 데이터
const MOCK_STUDENTS: Student[] = [
  { id: '1', name: '김철수', grade: 2, classNum: 1, number: 1 },
  { id: '2', name: '이영희', grade: 2, classNum: 1, number: 2 },
  { id: '3', name: '박민수', grade: 2, classNum: 2, number: 1 },
  { id: '4', name: '정지원', grade: 3, classNum: 1, number: 3 },
  { id: '5', name: '한수민', grade: 3, classNum: 2, number: 5 },
];

const MOCK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: '1',
    studentId: '1',
    teacherId: 't1',
    teacherName: '권도훈',
    date: '2023-05-15',
    content: '학업 성취도가 떨어지는 원인에 대해 상담함. 집에서 공부할 시간이 부족하다고 함. 방과후 학습 추천.',
    nextPlan: '방과후 학습 신청하고 2주 후 다시 상담 예정',
    tags: ['학업상담', '방과후학습'],
    isSharedWithOtherTeachers: true,
    createdAt: '2023-05-15T14:30:00',
    updatedAt: '2023-05-15T14:30:00',
  },
  {
    id: '2',
    studentId: '1',
    teacherId: 't2',
    teacherName: '이수진',
    date: '2023-05-30',
    content: '방과후 학습 참여 후 변화에 대해 상담. 공부 시간이 증가했으나 아직 성적 변화는 없음.',
    nextPlan: '성적 향상 전략에 대해 추가 상담 필요',
    tags: ['학업상담', '방과후학습', '성적향상'],
    isSharedWithOtherTeachers: true,
    createdAt: '2023-05-30T15:20:00',
    updatedAt: '2023-05-30T15:20:00',
  },
  {
    id: '3',
    studentId: '2',
    teacherId: 't1',
    teacherName: '권도훈',
    date: '2023-06-02',
    content: '진로에 대한 고민이 있어 상담 요청. 이공계와 인문계 사이에서 고민 중.',
    nextPlan: '진로검사 후 다시 상담하기로 함',
    tags: ['진로상담'],
    isSharedWithOtherTeachers: false,
    createdAt: '2023-06-02T13:10:00',
    updatedAt: '2023-06-02T13:10:00',
  },
];

// 컴포넌트
const TeacherConsultationPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [tagInput, setTagInput] = useState<string>('');
  
  const [formData, setFormData] = useState<{
    studentId: string;
    content: string;
    nextPlan: string;
    tags: string[];
    isSharedWithOtherTeachers: boolean;
  }>({
    studentId: '',
    content: '',
    nextPlan: '',
    tags: [],
    isSharedWithOtherTeachers: false,
  });
  
  const [studentConsultations, setStudentConsultations] = useState<ConsultationRecord[]>([]);
  
  // 학생이 선택되면 해당 학생의 상담 기록을 가져옵니다
  useEffect(() => {
    if (selectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId: selectedStudent
      }));
      
      // 선택된 학생의 상담 기록 조회
      const filteredConsultations = MOCK_CONSULTATIONS.filter(
        (consultation) => consultation.studentId === selectedStudent
      );
      setStudentConsultations(filteredConsultations);
    }
  }, [selectedStudent]);

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // 태그 입력 처리
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // 태그 추가 처리
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };
  
  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  
  // 체크박스 처리
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상담 기록 제출:', formData);
    
    // 제출 후 폼 초기화
    setFormData({
      studentId: selectedStudent,
      content: '',
      nextPlan: '',
      tags: [],
      isSharedWithOtherTeachers: false,
    });
    
    alert('상담 기록이 저장되었습니다.');
  };
  
  // 탭 변경 처리
  const handleTabChange = (tab: 'new' | 'history') => {
    setActiveTab(tab);
  };
  
  // 날짜 포맷 처리
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || "선생님"}
      userRole="교사"
      userInfo="상담 관리"
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />
      <PageContainer>
        <ContentArea>
          <PageHeader>
            <PageTitle>상담 기록</PageTitle>
          </PageHeader>
          <FilterContainer>
            <FilterGroup>
              <Label>학생 선택</Label>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">-- 전체 학생 --</option>
                {MOCK_STUDENTS.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.grade}학년 {student.classNum}반 {student.number}번 {student.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup>
              <Label>검색어</Label>
              <Input
                type="text"
                placeholder="상담 내용이나 태그로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <SearchButton onClick={() => {
                if (!searchTerm.trim()) {
                  setStudentConsultations(
                    selectedStudent 
                      ? MOCK_CONSULTATIONS.filter(c => c.studentId === selectedStudent) 
                      : MOCK_CONSULTATIONS
                  );
                  return;
                }

                const term = searchTerm.toLowerCase();
                const filtered = (selectedStudent 
                  ? MOCK_CONSULTATIONS.filter(c => c.studentId === selectedStudent)
                  : MOCK_CONSULTATIONS
                ).filter(
                  c => c.content.toLowerCase().includes(term) || 
                       c.nextPlan.toLowerCase().includes(term) ||
                       c.tags.some(tag => tag.toLowerCase().includes(term))
                );
                
                setStudentConsultations(filtered);
              }}>
                검색하기
              </SearchButton>
            </FilterGroup>
          </FilterContainer>
          
          <TabsWrapper>
            <TabContainer>
              <Tab
                active={activeTab === 'new'}
                onClick={() => setActiveTab('new')}
              >
                새 상담 기록
              </Tab>
              <Tab
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                상담 기록 조회
              </Tab>
            </TabContainer>
          </TabsWrapper>
          
          {activeTab === 'new' ? (
            <Card>
              <ConsultationForm onSubmit={handleSubmit}>
                <FormSection>
                  <SectionTitle>상담 내용</SectionTitle>
                  <FormGroup>
                    <TextArea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="상담 내용을 자세히 기록해주세요."
                    />
                  </FormGroup>
                </FormSection>
                <FormSection>
                  <SectionTitle>다음 계획 및 조치사항</SectionTitle>
                  <FormGroup>
                    <TextArea
                      name="nextPlan"
                      value={formData.nextPlan}
                      onChange={handleInputChange}
                      placeholder="다음 계획 및 조치사항을 기록해주세요."
                    />
                  </FormGroup>
                </FormSection>
                <FormSection>
                  <SectionTitle>태그</SectionTitle>
                  <FormGroup>
                    <TagInput
                      type="text"
                      placeholder="태그 입력 후 Enter (예: 진로상담, 학업상담...)"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    <TagsContainer>
                      {formData.tags.map((tag) => (
                        <Tag key={tag}>
                          {tag}
                          <TagRemoveButton onClick={() => removeTag(tag)}>×</TagRemoveButton>
                        </Tag>
                      ))}
                    </TagsContainer>
                  </FormGroup>
                </FormSection>
                <FormSection>
                  <SectionTitle>공유 설정</SectionTitle>
                  <FormGroup>
                    <CheckboxContainer>
                      <Checkbox
                        type="checkbox"
                        id="isSharedWithOtherTeachers"
                        name="isSharedWithOtherTeachers"
                        checked={formData.isSharedWithOtherTeachers}
                        onChange={handleCheckboxChange}
                      />
                      <CheckboxLabel htmlFor="isSharedWithOtherTeachers">
                        다른 교사와 공유
                      </CheckboxLabel>
                    </CheckboxContainer>
                  </FormGroup>
                </FormSection>
                <ButtonContainer>
                  <SecondaryButton type="button" onClick={() => handleTabChange('history')}>
                    취소
                  </SecondaryButton>
                  <PrimaryButton type="submit">저장하기</PrimaryButton>
                </ButtonContainer>
              </ConsultationForm>
            </Card>
          ) : (
            <Card>
              {studentConsultations.length > 0 ? (
                <ConsultationGrid>
                  {studentConsultations.map((consultation) => (
                    <ConsultationCardTeacher key={consultation.id}>
                      <ConsultationHeader>
                        <StudentInfo>
                          <h3>{consultation.studentId}</h3>
                          <p>{consultation.teacherName} 교사</p>
                        </StudentInfo>
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
                        {consultation.tags.length > 0 && (
                          <TagsWrapper>
                            {consultation.tags.map((tag) => (
                              <HistoryTag key={tag}>{tag}</HistoryTag>
                            ))}
                          </TagsWrapper>
                        )}
                      </ConsultationContent>
                      <ConsultationFooter>
                        <SharingStatus shared={consultation.isSharedWithOtherTeachers}>
                          {consultation.isSharedWithOtherTeachers
                            ? '다른 교사와 공유됨'
                            : '비공개'}
                        </SharingStatus>
                      </ConsultationFooter>
                    </ConsultationCardTeacher>
                  ))}
                </ConsultationGrid>
              ) : (
                <EmptyState>
                  {selectedStudent 
                    ? '해당 학생에 대한 상담 기록이 없습니다.' 
                    : '학생을 선택하거나 검색어를 입력하여 상담 기록을 조회하세요.'}
                </EmptyState>
              )}
            </Card>
          )}
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default TeacherConsultationPage;
