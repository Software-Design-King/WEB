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
import { useUserStore } from "../../../stores/userStore";

// 임시 유저 데이터
const userData = {
  name: "권도훈",
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
};

// 출결 현황
const attendanceRecord = {
  year: "2024",
  semester: "1학기",
  attendanceDays: 97,
  absenceDays: 0,
  lateDays: 2,
  earlyLeaveDays: 1,
  sickLeaveDays: 0,
  details: [
    { date: "2024-04-05", type: "late", reason: "교통 지연", description: "교통 지연으로 인한 지각" },
    { date: "2024-05-12", type: "late", reason: "늦잠", description: "늦잠으로 인한 지각" },
    { date: "2024-05-20", type: "earlyLeave", reason: "병원 방문", description: "병원 방문으로 인한 조퇴" },
  ],
};

// 행동 발달 기록
const behavioralRecord = [
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
];

// 특기 사항
const specialNotes = [
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
];

// 활동 내역
const activityRecord = [
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
  
  // Zustand에서 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);
  
  // 로딩 중이거나 사용자 정보가 없는 경우
  if (isLoading || !userInfo) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userRole="학생"
        userInfo="정보를 불러오는 중입니다."
        notificationCount={0}
      >
        <div>사용자 정보를 불러오는 중입니다...</div>
      </DashboardLayout>
    );
  }
  
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
      userName="권도훈"
      userRole="학생"
      userInfo="2학년 3반 12번"
      notificationCount={2}
    >
      <StudentSidebar {...{ isCollapsed: false }} />
      
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
