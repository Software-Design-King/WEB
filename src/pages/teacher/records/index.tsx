import React, { useState } from "react";
import styled from "@emotion/styled";
import { Select, Button, Tabs, Form, Input, DatePicker, Modal, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import {
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";

const { TabPane } = Tabs;
const { TextArea } = Input;

// 임시 교사 데이터
const teacherData = {
  name: "박지성",
  role: "교사",
  subject: "수학",
  roleInfo: "2학년 3반 담임",
};

// 임시 학생 목록
const students = [
  { id: 1, name: "권도훈", grade: 2, classNum: 3, number: 12 },
  { id: 2, name: "김민준", grade: 2, classNum: 3, number: 15 },
  { id: 3, name: "이서연", grade: 2, classNum: 3, number: 8 },
  { id: 4, name: "박지훈", grade: 2, classNum: 3, number: 21 },
  { id: 5, name: "최예은", grade: 2, classNum: 3, number: 5 },
];

// 임시 학생 정보
const studentInfoData = {
  1: {
    basicInfo: {
      name: "권도훈",
      birthDate: "2009-07-22",
      gender: "남",
      address: "서울시 강남구 역삼로 123",
      contact: "010-1234-5678",
      parentName: "권영수",
      parentContact: "010-9876-5432",
      admissionDate: "2023-03-02",
      schoolName: "소프트웨어디자인고등학교",
      grade: 2,
      class: 3,
      studentNumber: 12,
    },
    attendance: {
      year: "2024",
      semester: "1학기",
      attendanceDays: 97,
      absenceDays: 0,
      lateDays: 2,
      earlyLeaveDays: 1,
      sickLeaveDays: 0,
      details: [
        { date: "2024-04-05", type: "late", reason: "교통 지연" },
        { date: "2024-05-12", type: "late", reason: "늦잠" },
        { date: "2024-05-20", type: "earlyLeave", reason: "병원 방문" },
      ],
    },
    behavioral: [
      {
        date: "2024-04-15",
        category: "리더십",
        description: "그룹 프로젝트에서 리더십을 발휘하여 팀원들을 잘 이끌었습니다.",
        teacher: "박지성",
      },
      {
        date: "2024-05-10",
        category: "창의적 사고",
        description: "문제 해결 능력이 뛰어나며 창의적인 아이디어를 많이 제시합니다.",
        teacher: "김승환",
      },
      {
        date: "2024-06-02",
        category: "분석적 사고",
        description: "컴퓨터 과학 관련 창의적 사고와 분석적 사고 능력이 뛰어납니다.",
        teacher: "이미란",
      },
    ],
    specialNotes: [
      {
        date: "2024-03-15",
        category: "진로 희망",
        description: "소프트웨어 개발자(인공지능 분야)",
        teacher: "김승환",
      },
      {
        date: "2024-04-20",
        category: "교과 특기",
        description: "수학과 과학 분야에 특별한 재능을 보임. 특히 알고리즘 문제 해결 능력이 뛰어남.",
        teacher: "박지성",
      },
      {
        date: "2024-05-17",
        category: "수상 경력",
        description: "2024년 전국 청소년 코딩 대회 우수상 수상",
        teacher: "이미란",
      },
      {
        date: "2024-06-10",
        category: "자격증",
        description: "정보처리기능사 취득",
        teacher: "김승환",
      },
    ],
    activities: [
      {
        date: "2024-03-15",
        category: "동아리",
        title: "소프트웨어 동아리 'Code Masters'",
        description: "학교 소프트웨어 개발 동아리에서 웹 개발 팀장으로 활동 중.",
        teacher: "박지성",
      },
      {
        date: "2024-05-17",
        category: "대회",
        title: "전국 고교 프로그래밍 경진대회",
        description: "알고리즘 문제 해결 및 창의적 소프트웨어 설계 경진대회 참가",
        teacher: "김승환",
      },
      {
        date: "2024-07-15",
        category: "직업 체험",
        title: "IT 기업 인턴십 프로그램",
        description: "여름방학 기간 동안 네이버 커넥트 인턴십 프로그램 참가 예정",
        teacher: "이미란",
      },
      {
        date: "2024-04-20",
        category: "프로젝트",
        title: "학교 홈페이지 리뉴얼 프로젝트",
        description: "학교 공식 홈페이지 리뉴얼 작업에 UI/UX 디자인 및 프론트엔드 개발 참여",
        teacher: "김승환",
      },
    ],
  },
  2: {
    basicInfo: {
      name: "김민준",
      birthDate: "2009-05-15",
      gender: "남",
      address: "서울시 강남구 테헤란로 123",
      contact: "010-2345-6789",
      parentName: "김철수",
      parentContact: "010-9876-5432",
      admissionDate: "2023-03-02",
      schoolName: "한국중학교",
      grade: 2,
      class: 3,
      studentNumber: 15,
    },
    attendance: {
      year: "2024",
      semester: "1학기",
      attendanceDays: 92,
      absenceDays: 2,
      lateDays: 3,
      earlyLeaveDays: 1,
      sickLeaveDays: 2,
      details: [
        { date: "2024-03-15", type: "absent", reason: "병결" },
        { date: "2024-04-22", type: "late", reason: "교통 지연" },
        { date: "2024-05-08", type: "late", reason: "기타" },
      ],
    },
    behavioral: [
      {
        date: "2024-04-10",
        category: "수업 태도",
        description: "수업에 적극적으로 참여하고 질문을 많이 하는 모습이 인상적입니다.",
        teacher: "이지원",
      },
      {
        date: "2024-05-15",
        category: "교우 관계",
        description: "친구들과 원활하게 소통하며 학급 활동에 적극적으로 참여합니다.",
        teacher: "박준호",
      },
    ],
    specialNotes: [
      {
        date: "2024-03-20",
        category: "교과 특기",
        description: "영어 회화에 뛰어난 능력을 보이며, 교내 영어 토론 대회에서 두각을 나타냈습니다.",
        teacher: "김수진",
      },
    ],
    activities: [
      {
        date: "2024-03-15",
        category: "동아리",
        title: "과학 탐구 동아리",
        description: "화학 실험 활동에 참여하여 산과 염기의 반응에 대한 탐구를 진행하였습니다.",
        teacher: "정민석",
      },
    ],
  },
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 1.5rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 1rem;
`;

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RecordItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${colors.primary.main};
  position: relative;
`;

const RecordActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const AttendanceSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AttendanceCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const AttendanceValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`;

const AttendanceLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

const AddRecordButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled(Tag)`
  margin-right: 0;
`;

const TeacherRecordsPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [recordToEdit, setRecordToEdit] = useState<any>(null);
  
  // 학생 선택 핸들러
  const handleStudentChange = (value: number) => {
    setSelectedStudent(value);
    setIsEditing(false);
  };
  
  // 편집 모드 시작
  const handleEditStart = () => {
    if (!selectedStudent) {
      message.warning("먼저 학생을 선택해주세요.");
      return;
    }
    
    setIsEditing(true);
    
    // 기본 정보 폼 초기화
    if (activeTab === "1" && studentInfoData[selectedStudent]) {
      editForm.setFieldsValue({
        ...studentInfoData[selectedStudent].basicInfo
      });
    }
  };
  
  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    editForm.resetFields();
  };
  
  // 저장 핸들러
  const handleSave = () => {
    if (!selectedStudent) return;
    
    editForm.validateFields().then(values => {
      // 여기서 데이터 저장 로직 구현
      message.success("정보가 저장되었습니다.");
      setIsEditing(false);
    }).catch(err => {
      message.error("양식을 올바르게 작성해주세요.");
    });
  };
  
  // 새 기록 추가 모달 표시
  const showAddModal = (type: string) => {
    if (!selectedStudent) {
      message.warning("먼저 학생을 선택해주세요.");
      return;
    }
    
    setModalType(type);
    setRecordToEdit(null);
    editForm.resetFields();
    setIsModalVisible(true);
  };
  
  // 기록 편집 모달 표시
  const showEditModal = (type: string, record: any) => {
    setModalType(type);
    setRecordToEdit(record);
    
    // 폼 초기화
    editForm.setFieldsValue(record);
    setIsModalVisible(true);
  };
  
  // 모달 확인 버튼 핸들러
  const handleModalOk = () => {
    editForm.validateFields().then(values => {
      // 데이터 저장 로직
      message.success(`${recordToEdit ? '수정' : '추가'}되었습니다.`);
      setIsModalVisible(false);
    }).catch(err => {
      message.error("양식을 올바르게 작성해주세요.");
    });
  };
  
  // 기록 삭제 핸들러
  const handleDeleteRecord = (type: string, recordId: any) => {
    Modal.confirm({
      title: "기록 삭제",
      content: "정말 이 기록을 삭제하시겠습니까?",
      onOk() {
        // 삭제 로직
        message.success("기록이 삭제되었습니다.");
      },
    });
  };
  
  // 현재 선택된 학생 정보
  const currentStudentInfo = selectedStudent ? studentInfoData[selectedStudent] : null;
  
  // 현재 선택된 학생 이름
  const getSelectedStudentName = () => {
    if (!selectedStudent) return "";
    const student = students.find(s => s.id === selectedStudent);
    return student ? student.name : "";
  };
  
  // 모달 제목 생성
  const getModalTitle = () => {
    const action = recordToEdit ? "수정" : "추가";
    
    switch (modalType) {
      case "attendance":
        return "출결 기록 " + action;
      case "behavioral":
        return "행동 발달 기록 " + action;
      case "specialNotes":
        return "특기 사항 " + action;
      case "activities":
        return "활동 내역 " + action;
      default:
        return "기록 " + action;
    }
  };
  
  // 모달 내용 렌더링
  const renderModalContent = () => {
    switch (modalType) {
      case "attendance":
        return (
          <Form form={editForm} layout="vertical">
            <FormItem name="date" label="날짜" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </FormItem>
            <FormItem name="type" label="유형" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="absent">결석</Select.Option>
                <Select.Option value="late">지각</Select.Option>
                <Select.Option value="earlyLeave">조퇴</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="reason" label="사유" rules={[{ required: true }]}>
              <Input />
            </FormItem>
          </Form>
        );
      
      case "behavioral":
      case "specialNotes":
        return (
          <Form form={editForm} layout="vertical">
            <FormItem name="date" label="날짜" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </FormItem>
            <FormItem name="category" label="카테고리" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem name="description" label="내용" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </FormItem>
          </Form>
        );
      
      case "activities":
        return (
          <Form form={editForm} layout="vertical">
            <FormItem name="date" label="날짜" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </FormItem>
            <FormItem name="category" label="카테고리" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="동아리">동아리</Select.Option>
                <Select.Option value="봉사활동">봉사활동</Select.Option>
                <Select.Option value="대회">대회</Select.Option>
                <Select.Option value="진로 체험">진로 체험</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="title" label="제목" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem name="description" label="내용" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </FormItem>
          </Form>
        );
      
      default:
        return null;
    }
  };
  
  // 기본 정보 폼 렌더링
  const renderBasicInfoForm = () => {
    if (!currentStudentInfo) return null;
    
    return (
      <Form
        form={editForm}
        layout="vertical"
        initialValues={currentStudentInfo.basicInfo}
        disabled={!isEditing}
      >
        <InfoGrid>
          <FormItem name="name" label="이름" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem name="birthDate" label="생년월일" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem name="gender" label="성별">
            <Select>
              <Select.Option value="남">남</Select.Option>
              <Select.Option value="여">여</Select.Option>
            </Select>
          </FormItem>
          <FormItem name="address" label="주소">
            <Input />
          </FormItem>
          <FormItem name="contact" label="연락처">
            <Input />
          </FormItem>
          <FormItem name="parentName" label="보호자 이름">
            <Input />
          </FormItem>
          <FormItem name="parentContact" label="보호자 연락처">
            <Input />
          </FormItem>
          <FormItem name="admissionDate" label="입학일">
            <Input />
          </FormItem>
          <FormItem name="schoolName" label="학교">
            <Input />
          </FormItem>
          <FormItem name="grade" label="학년">
            <Input />
          </FormItem>
          <FormItem name="class" label="반">
            <Input />
          </FormItem>
          <FormItem name="studentNumber" label="번호">
            <Input />
          </FormItem>
        </InfoGrid>
      </Form>
    );
  };
  
  // 출결 현황 렌더링
  const renderAttendance = () => {
    if (!currentStudentInfo) return null;
    
    const attendance = currentStudentInfo.attendance;
    
    return (
      <>
        <AttendanceSummary>
          <AttendanceCard>
            <AttendanceValue>{attendance.attendanceDays}</AttendanceValue>
            <AttendanceLabel>출석일수</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.absenceDays}</AttendanceValue>
            <AttendanceLabel>결석</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.lateDays}</AttendanceValue>
            <AttendanceLabel>지각</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.earlyLeaveDays}</AttendanceValue>
            <AttendanceLabel>조퇴</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.sickLeaveDays}</AttendanceValue>
            <AttendanceLabel>병결</AttendanceLabel>
          </AttendanceCard>
        </AttendanceSummary>
        
        <AddRecordButton 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={() => showAddModal("attendance")}
        >
          출결 기록 추가
        </AddRecordButton>
        
        <RecordsList>
          {attendance.details.map((record, index) => (
            <RecordItem key={index}>
              <RecordActions>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDeleteRecord("attendance", index)}
                />
              </RecordActions>
              
              <div style={{ marginBottom: '0.5rem' }}>{record.date}</div>
              <div style={{ marginBottom: '0.5rem' }}>
                <StatusBadge 
                  color={
                    record.type === 'absent' ? 'error' : 
                    record.type === 'late' ? 'warning' : 
                    'processing'
                  }
                >
                  {record.type === 'absent' ? '결석' : 
                   record.type === 'late' ? '지각' : 
                   record.type === 'earlyLeave' ? '조퇴' : '기타'}
                </StatusBadge>
                <span style={{ marginLeft: '0.5rem' }}>{record.reason}</span>
              </div>
            </RecordItem>
          ))}
        </RecordsList>
      </>
    );
  };
  
  // 행동 발달 기록 렌더링
  const renderBehavioral = () => {
    if (!currentStudentInfo) return null;
    
    return (
      <>
        <AddRecordButton 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={() => showAddModal("behavioral")}
        >
          행동 발달 기록 추가
        </AddRecordButton>
        
        <RecordsList>
          {currentStudentInfo.behavioral.map((record, index) => (
            <RecordItem key={index}>
              <RecordActions>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => showEditModal("behavioral", record)}
                />
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDeleteRecord("behavioral", index)}
                />
              </RecordActions>
              
              <div style={{ marginBottom: '0.5rem' }}>{record.date}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{record.category}</div>
              <div style={{ marginBottom: '0.5rem' }}>{record.description}</div>
              <div style={{ textAlign: 'right', fontStyle: 'italic' }}>
                담당: {record.teacher} 교사
              </div>
            </RecordItem>
          ))}
        </RecordsList>
      </>
    );
  };
  
  // 특기 사항 렌더링
  const renderSpecialNotes = () => {
    if (!currentStudentInfo) return null;
    
    return (
      <>
        <AddRecordButton 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={() => showAddModal("specialNotes")}
        >
          특기 사항 추가
        </AddRecordButton>
        
        <RecordsList>
          {currentStudentInfo.specialNotes.map((record, index) => (
            <RecordItem key={index}>
              <RecordActions>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => showEditModal("specialNotes", record)}
                />
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDeleteRecord("specialNotes", index)}
                />
              </RecordActions>
              
              <div style={{ marginBottom: '0.5rem' }}>{record.date}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{record.category}</div>
              <div style={{ marginBottom: '0.5rem' }}>{record.description}</div>
              <div style={{ textAlign: 'right', fontStyle: 'italic' }}>
                담당: {record.teacher} 교사
              </div>
            </RecordItem>
          ))}
        </RecordsList>
      </>
    );
  };
  
  // 활동 내역 렌더링
  const renderActivities = () => {
    if (!currentStudentInfo) return null;
    
    return (
      <>
        <AddRecordButton 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={() => showAddModal("activities")}
        >
          활동 내역 추가
        </AddRecordButton>
        
        <RecordsList>
          {currentStudentInfo.activities.map((record, index) => (
            <RecordItem key={index}>
              <RecordActions>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => showEditModal("activities", record)}
                />
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDeleteRecord("activities", index)}
                />
              </RecordActions>
              
              <div style={{ marginBottom: '0.5rem' }}>
                {record.date} | {record.category}
              </div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{record.title}</div>
              <div style={{ marginBottom: '0.5rem' }}>{record.description}</div>
              <div style={{ textAlign: 'right', fontStyle: 'italic' }}>
                담당: {record.teacher} 교사
              </div>
            </RecordItem>
          ))}
        </RecordsList>
      </>
    );
  };

  return (
    <DashboardLayout
      userName={teacherData.name}
      userRole={teacherData.role}
      userInfo={teacherData.subject}
    >
      <TeacherSidebar isCollapsed={false} />
      
      <ContentContainer>
        <PageContainer>
          <h1>학생부 관리</h1>
          
          <ControlsContainer>
            <Select
              placeholder="학생 선택"
              style={{ width: 250 }}
              onChange={handleStudentChange}
              value={selectedStudent}
            >
              {students.map(student => (
                <Select.Option key={student.id} value={student.id}>
                  {student.name} ({student.grade}-{student.classNum}-{student.number})
                </Select.Option>
              ))}
            </Select>
            
            {!isEditing ? (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEditStart}
                disabled={!selectedStudent}
              >
                편집
              </Button>
            ) : (
              <>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  저장
                </Button>
                <Button onClick={handleCancelEdit}>취소</Button>
              </>
            )}
          </ControlsContainer>
          
          {selectedStudent && currentStudentInfo ? (
            <DashboardCard>
              <CardTitle>
                {getSelectedStudentName()} 학생 학생부
              </CardTitle>
              
              <StyledTabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
              >
                <TabPane tab="기본 정보" key="1">
                  {renderBasicInfoForm()}
                </TabPane>
                <TabPane tab="출결 현황" key="2">
                  {renderAttendance()}
                </TabPane>
                <TabPane tab="행동 발달" key="3">
                  {renderBehavioral()}
                </TabPane>
                <TabPane tab="특기 사항" key="4">
                  {renderSpecialNotes()}
                </TabPane>
                <TabPane tab="활동 내역" key="5">
                  {renderActivities()}
                </TabPane>
              </StyledTabs>
            </DashboardCard>
          ) : (
            <DashboardCard>
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🎓</div>
                <div>학생을 선택하여 학생부 정보를 확인하고 관리하세요.</div>
              </div>
            </DashboardCard>
          )}
        </PageContainer>
      </ContentContainer>
      
      {/* 기록 추가/수정 모달 */}
      <Modal
        title={getModalTitle()}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        {renderModalContent()}
      </Modal>
    </DashboardLayout>
  );
};

export default TeacherRecordsPage;
