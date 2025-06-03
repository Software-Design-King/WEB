import React, { useState, useEffect } from "react";
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
import { getStudentDetail, StudentDetailResponse } from "../../../apis/student";
import { getStudentAttendance, AttendanceResponse } from "../../../apis/attendance";


// 학생부 카테고리 (출결 현황과 기본 정보만 실제 API 데이터로 표시)
const recordCategories = [
  { id: 1, name: "기본 정보" },
  { id: 2, name: "출결 현황" },
  // 아래 항목들은 현재 API가 없어 나중에 구현
  // { id: 3, name: "행동 발달" },
  // { id: 4, name: "특기 사항" },
  // { id: 5, name: "활동 내역" },
];

// 로딩 상태 및 에러 메시지 컴포넌트
const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  font-size: 1rem;
  color: ${colors.text.secondary};
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
  font-size: 1rem;
  color: ${colors.error.main};
  background-color: ${colors.error.light};
  border-radius: 8px;
  margin: 1rem 0;
`;

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
