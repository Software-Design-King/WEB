import React, { useState } from "react";
import styled from "@emotion/styled";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import {
  DashboardGrid,
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";

// 임시 유저 데이터
const userData = {
  name: "김민준",
  role: "학생",
  grade: 2,
  class: 3,
  number: 12,
};

// 학생부 카테고리
const recordCategories = [
  { id: 1, name: "기본 정보" },
  { id: 2, name: "출결 현황" },
  { id: 3, name: "행동 발달" },
  { id: 4, name: "특기 사항" },
  { id: 5, name: "활동 내역" },
];

// 학생 기본 정보
const studentInfo = {
  name: "김민준",
  birthDate: "2009-05-15",
  gender: "남",
  address: "서울시 강남구 테헤란로 123",
  contact: "010-1234-5678",
  parentName: "김철수",
  parentContact: "010-9876-5432",
  admissionDate: "2023-03-02",
  schoolName: "한국중학교",
  grade: 2,
  class: 3,
  studentNumber: 12,
};

// 출결 현황
const attendanceRecord = {
  year: "2024",
  semester: "1학기",
  attendanceDays: 92,
  absenceDays: 2,
  lateDays: 3,
  earlyLeaveDays: 1,
  sickLeaveDays: 2,
  details: [
    { date: "2024-03-15", type: "absent", reason: "병결", description: "감기로 인한 결석" },
    { date: "2024-04-22", type: "late", reason: "교통 지연", description: "버스 지연으로 인한 지각" },
    { date: "2024-05-08", type: "late", reason: "기타", description: "교문 통과 후 지각" },
    { date: "2024-05-17", type: "late", reason: "기타", description: "교문 통과 후 지각" },
    { date: "2024-06-02", type: "earlyLeave", reason: "병가", description: "치과 진료로 인한 조퇴" },
    { date: "2024-06-10", type: "absent", reason: "병결", description: "병원 진료로 인한 결석" },
  ],
};

// 행동 발달 기록
const behavioralRecord = [
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
  {
    date: "2024-06-20",
    category: "학습 발달",
    description: "자기주도적 학습 태도가 많이 향상되었으며, 특히 수학 과목에 대한 흥미가 높아졌습니다.",
    teacher: "이지원",
  },
];

// 특기 사항
const specialNotes = [
  {
    date: "2024-03-20",
    category: "교과 특기",
    description: "영어 회화에 뛰어난 능력을 보이며, 교내 영어 토론 대회에서 두각을 나타냈습니다.",
    teacher: "김수진",
  },
  {
    date: "2024-04-15",
    category: "예체능 특기",
    description: "음악 시간에 피아노 연주 실력이 뛰어나며, 교내 합창부에서 중요한 역할을 담당하고 있습니다.",
    teacher: "정민석",
  },
  {
    date: "2024-05-25",
    category: "진로 적성",
    description: "과학 분야에 관심이 많으며, 특히 천문학 관련 도서를 자주 읽고 관련 실험에 적극적으로 참여합니다.",
    teacher: "이지원",
  },
];

// 활동 내역
const activityRecord = [
  {
    date: "2024-03-15",
    category: "동아리",
    title: "과학 탐구 동아리",
    description: "화학 실험 활동에 참여하여 산과 염기의 반응에 대한 탐구를 진행하였으며, 관련 보고서를 작성하였습니다.",
    teacher: "정민석",
  },
  {
    date: "2024-04-10",
    category: "봉사활동",
    title: "지역사회 환경 정화",
    description: "학교 인근 공원에서 쓰레기 줍기 봉사활동에 참여하였으며, 총 4시간의 봉사 시간을 기록하였습니다.",
    teacher: "한지연",
  },
  {
    date: "2024-05-20",
    category: "대회",
    title: "교내 영어 말하기 대회",
    description: "교내 영어 말하기 대회에 참가하여 '환경 보호'를 주제로 발표하였으며, 장려상을 수상하였습니다.",
    teacher: "김수진",
  },
  {
    date: "2024-06-15",
    category: "진로 체험",
    title: "대학 캠퍼스 탐방",
    description: "서울대학교 자연과학대학 캠퍼스 탐방 프로그램에 참여하여 물리학과 생물학 실험실을 견학하였습니다.",
    teacher: "박준호",
  },
];

// 스타일 컴포넌트
const RecordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
`;

const CategoryNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const CategoryButton = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background-color: ${(props) => props.isActive ? colors.primary.main : 'white'};
  color: ${(props) => props.isActive ? 'white' : colors.text.primary};
  border: 1px solid ${(props) => props.isActive ? colors.primary.main : colors.grey[300]};
  font-weight: ${(props) => props.isActive ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${(props) => props.isActive ? colors.primary.dark : colors.grey[100]};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
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

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: ${colors.text.primary};
  font-weight: 500;
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

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${colors.primary.main};
`;

const RecordDate = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const RecordTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`;

const RecordDescription = styled.div`
  font-size: 0.95rem;
  color: ${colors.text.primary};
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const RecordTeacher = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  text-align: right;
  font-style: italic;
`;

const RecordTable = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${colors.grey[100]};
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.text.primary};
  border-bottom: 1px solid ${colors.grey[300]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: ${colors.grey[50]};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.primary};
`;

const StatusBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.type) {
      case 'absent':
        return colors.error.light;
      case 'late':
        return colors.warning.light;
      case 'earlyLeave':
        return colors.info.light;
      default:
        return colors.grey[100];
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'absent':
        return colors.error.dark;
      case 'late':
        return colors.warning.dark;
      case 'earlyLeave':
        return colors.info.dark;
      default:
        return colors.text.primary;
    }
  }};
`;

const StudentRecordsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(recordCategories[0].id);
  
  // 선택된 카테고리에 따른 내용 렌더링
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 1: // 기본 정보
        return (
          <DashboardCard>
            <CardTitle>기본 정보</CardTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>이름</InfoLabel>
                <InfoValue>{studentInfo.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>생년월일</InfoLabel>
                <InfoValue>{studentInfo.birthDate}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>성별</InfoLabel>
                <InfoValue>{studentInfo.gender}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>주소</InfoLabel>
                <InfoValue>{studentInfo.address}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>연락처</InfoLabel>
                <InfoValue>{studentInfo.contact}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>보호자 이름</InfoLabel>
                <InfoValue>{studentInfo.parentName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>보호자 연락처</InfoLabel>
                <InfoValue>{studentInfo.parentContact}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>입학일</InfoLabel>
                <InfoValue>{studentInfo.admissionDate}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>학교</InfoLabel>
                <InfoValue>{studentInfo.schoolName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>학년/반/번호</InfoLabel>
                <InfoValue>{`${studentInfo.grade}학년 ${studentInfo.class}반 ${studentInfo.studentNumber}번`}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </DashboardCard>
        );
        
      case 2: // 출결 현황
        return (
          <DashboardCard>
            <CardTitle>
              출결 현황 ({attendanceRecord.year} {attendanceRecord.semester})
            </CardTitle>
            <AttendanceSummary>
              <AttendanceCard>
                <AttendanceValue>{attendanceRecord.attendanceDays}</AttendanceValue>
                <AttendanceLabel>출석일수</AttendanceLabel>
              </AttendanceCard>
              <AttendanceCard>
                <AttendanceValue>{attendanceRecord.absenceDays}</AttendanceValue>
                <AttendanceLabel>결석</AttendanceLabel>
              </AttendanceCard>
              <AttendanceCard>
                <AttendanceValue>{attendanceRecord.lateDays}</AttendanceValue>
                <AttendanceLabel>지각</AttendanceLabel>
              </AttendanceCard>
              <AttendanceCard>
                <AttendanceValue>{attendanceRecord.earlyLeaveDays}</AttendanceValue>
                <AttendanceLabel>조퇴</AttendanceLabel>
              </AttendanceCard>
              <AttendanceCard>
                <AttendanceValue>{attendanceRecord.sickLeaveDays}</AttendanceValue>
                <AttendanceLabel>병결</AttendanceLabel>
              </AttendanceCard>
            </AttendanceSummary>
            
            <RecordTable>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>날짜</TableHeaderCell>
                    <TableHeaderCell>유형</TableHeaderCell>
                    <TableHeaderCell>사유</TableHeaderCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {attendanceRecord.details.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <StatusBadge type={record.type}>
                          {record.type === 'absent' ? '결석' :
                           record.type === 'late' ? '지각' :
                           record.type === 'earlyLeave' ? '조퇴' : '기타'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{record.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RecordTable>
          </DashboardCard>
        );
        
      case 3: // 행동 발달
        return (
          <DashboardCard>
            <CardTitle>행동 발달 기록</CardTitle>
            <RecordsList>
              {behavioralRecord.map((record, index) => (
                <RecordItem key={index}>
                  <RecordDate>{record.date}</RecordDate>
                  <RecordTitle>{record.category}</RecordTitle>
                  <RecordDescription>{record.description}</RecordDescription>
                  <RecordTeacher>담당: {record.teacher} 교사</RecordTeacher>
                </RecordItem>
              ))}
            </RecordsList>
          </DashboardCard>
        );
        
      case 4: // 특기 사항
        return (
          <DashboardCard>
            <CardTitle>특기 사항</CardTitle>
            <RecordsList>
              {specialNotes.map((record, index) => (
                <RecordItem key={index}>
                  <RecordDate>{record.date}</RecordDate>
                  <RecordTitle>{record.category}</RecordTitle>
                  <RecordDescription>{record.description}</RecordDescription>
                  <RecordTeacher>담당: {record.teacher} 교사</RecordTeacher>
                </RecordItem>
              ))}
            </RecordsList>
          </DashboardCard>
        );
        
      case 5: // 활동 내역
        return (
          <DashboardCard>
            <CardTitle>활동 내역</CardTitle>
            <RecordsList>
              {activityRecord.map((record, index) => (
                <RecordItem key={index}>
                  <RecordDate>{record.date} | {record.category}</RecordDate>
                  <RecordTitle>{record.title}</RecordTitle>
                  <RecordDescription>{record.description}</RecordDescription>
                  <RecordTeacher>담당: {record.teacher} 교사</RecordTeacher>
                </RecordItem>
              ))}
            </RecordsList>
          </DashboardCard>
        );
        
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.grade}학년 ${userData.class}반 ${userData.number}번`}
    >
      <StudentSidebar isCollapsed={false} />
      
      <ContentContainer>
        <RecordsContainer>
          <h1>학생부 관리</h1>
          
          <CategoryNav>
            {recordCategories.map((category) => (
              <CategoryButton
                key={category.id}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryNav>
          
          {renderCategoryContent()}
        </RecordsContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentRecordsPage;
