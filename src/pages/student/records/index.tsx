import { useState } from 'react';
import styled from '@emotion/styled';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StudentSidebar from '../../../components/layout/StudentSidebar';
import { colors } from '../../../components/common/Common.styles';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// 사용자 데이터
const userData = {
  name: '김학생',
  role: '학생',
  grade: 2,
  class: 3,
  number: 15,
};

// 학기 데이터
const semesterOptions = [
  { value: '2025-1', label: '2025년 1학기' },
  { value: '2024-2', label: '2024년 2학기' },
  { value: '2024-1', label: '2024년 1학기' },
];

// 학생 기본 정보
const studentInfo = {
  name: '김학생',
  birthDate: '2008-05-15',
  gender: '남',
  address: '서울시 강남구 테헤란로 123',
  phone: '010-1234-5678',
  email: 'student@school.edu',
  parentName: '김부모',
  parentPhone: '010-9876-5432',
  admissionDate: '2023-03-02',
};

// 출결 현황 데이터
const attendanceData = [
  { name: '출석', value: 85, color: colors.success.main },
  { name: '결석', value: 2, color: colors.error.main },
  { name: '지각', value: 3, color: colors.warning.main },
  { name: '조퇴', value: 1, color: colors.secondary.main },
];

// 월별 출결 데이터
const monthlyAttendance = [
  { month: '3월', present: 20, absent: 0, late: 1, earlyLeave: 0 },
  { month: '4월', present: 21, absent: 0, late: 0, earlyLeave: 0 },
  { month: '5월', present: 19, absent: 1, late: 1, earlyLeave: 0 },
  { month: '6월', present: 18, absent: 1, late: 1, earlyLeave: 1 },
  { month: '7월', present: 7, absent: 0, late: 0, earlyLeave: 0 },
];

// 특별활동 데이터
const activities = [
  { 
    id: 1, 
    type: '동아리', 
    name: '과학탐구반', 
    period: '2024-03 ~ 2024-07', 
    description: '다양한 과학 실험을 통해 물리, 화학 원리를 탐구하고 과학적 사고력을 향상시키는 활동을 진행함.' 
  },
  { 
    id: 2, 
    type: '봉사활동', 
    name: '지역아동센터 학습지도', 
    period: '2024-04-15 ~ 2024-06-30', 
    description: '지역아동센터에서 초등학생들의 학습을 지도하고 멘토링 활동을 수행함. 총 봉사시간 15시간.' 
  },
  { 
    id: 3, 
    type: '대회참가', 
    name: '교내 과학경진대회', 
    period: '2024-05-20', 
    description: '친환경 에너지를 주제로 한 연구 프로젝트를 발표하여 우수상을 수상함.' 
  },
];

// 교사 의견 데이터
const teacherComments = [
  {
    id: 1,
    date: '2024-04-15',
    teacher: '이수학',
    subject: '수학',
    comment: '수학적 개념 이해력이 뛰어나며, 문제 해결 과정을 논리적으로 설명하는 능력이 우수함. 특히 기하학적 증명 문제에서 창의적인 접근법을 보여줌.'
  },
  {
    id: 2,
    date: '2024-05-20',
    teacher: '김과학',
    subject: '과학',
    comment: '과학적 호기심이 많고 실험에 적극적으로 참여함. 관찰력이 뛰어나며 실험 결과를 분석하는 능력이 우수함. 조별 활동에서 리더십을 발휘함.'
  },
  {
    id: 3,
    date: '2024-06-10',
    teacher: '박국어',
    subject: '국어',
    comment: '문학 작품에 대한 이해도가 높고 자신의 생각을 글로 표현하는 능력이 우수함. 토론 활동에서 논리적인 의견 제시와 타인의 의견을 존중하는 태도를 보임.'
  },
];

// 콘텐츠 컨테이너
const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

// 페이지 제목
const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${colors.text.primary};
`;

// 필터 컨테이너
const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

// 필터 셀렉트
const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  font-size: 0.875rem;
  color: ${colors.text.primary};
  min-width: 150px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// 카드 컨테이너
const CardContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

// 카드 제목
const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${colors.text.primary};
`;

// 정보 그리드
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 정보 항목
const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

// 정보 라벨
const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.25rem;
`;

// 정보 값
const InfoValue = styled.div`
  font-size: 1rem;
  color: ${colors.text.primary};
`;

// 차트 컨테이너
const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

// 테이블 컨테이너
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

// 테이블
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

// 테이블 헤더
const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 2px solid ${colors.grey[300]};
  color: ${colors.text.secondary};
  font-weight: 600;
  white-space: nowrap;
`;

// 테이블 셀
const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.primary};
`;

// 활동 타입 뱃지
const ActivityTypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ type }) => {
    switch (type) {
      case '동아리': return `${colors.primary.light}`;
      case '봉사활동': return `${colors.success.light}`;
      case '대회참가': return `${colors.warning.light}`;
      default: return `${colors.grey[300]}`;
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case '동아리': return colors.primary.dark;
      case '봉사활동': return colors.success.dark;
      case '대회참가': return colors.warning.dark;
      default: return colors.text.secondary;
    }
  }};
`;

// 코멘트 카드
const CommentCard = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${colors.grey[50]};
  margin-bottom: 1rem;
  border-left: 4px solid ${colors.primary.main};
`;

// 코멘트 헤더
const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

// 코멘트 교사
const CommentTeacher = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 코멘트 날짜
const CommentDate = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
`;

// 코멘트 과목
const CommentSubject = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary.main};
  margin-bottom: 0.5rem;
`;

// 코멘트 내용
const CommentContent = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  line-height: 1.5;
`;

// 학생부 관리 페이지
const StudentRecords = () => {
  const [selectedSemester, setSelectedSemester] = useState(semesterOptions[0].value);
  
  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.grade}학년 ${userData.class}반 ${userData.number}번`}
      notificationCount={2}
    >
      <StudentSidebar isCollapsed={false} />
      
      <ContentContainer>
        <PageTitle>내 학생부 관리</PageTitle>
        
        <FilterContainer>
          <FilterSelect 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            {semesterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
        
        <CardContainer>
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
              <InfoValue>{studentInfo.phone}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>이메일</InfoLabel>
              <InfoValue>{studentInfo.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>보호자 성명</InfoLabel>
              <InfoValue>{studentInfo.parentName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>보호자 연락처</InfoLabel>
              <InfoValue>{studentInfo.parentPhone}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>입학일</InfoLabel>
              <InfoValue>{studentInfo.admissionDate}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </CardContainer>
        
        <CardContainer>
          <CardTitle>출결 현황</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <TableContainer style={{ marginTop: '1.5rem' }}>
            <Table>
              <thead>
                <tr>
                  <TableHeader>월</TableHeader>
                  <TableHeader>출석</TableHeader>
                  <TableHeader>결석</TableHeader>
                  <TableHeader>지각</TableHeader>
                  <TableHeader>조퇴</TableHeader>
                </tr>
              </thead>
              <tbody>
                {monthlyAttendance.map((month, index) => (
                  <tr key={index}>
                    <TableCell>{month.month}</TableCell>
                    <TableCell>{month.present}</TableCell>
                    <TableCell>{month.absent}</TableCell>
                    <TableCell>{month.late}</TableCell>
                    <TableCell>{month.earlyLeave}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </CardContainer>
        
        <CardContainer>
          <CardTitle>특별활동</CardTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>활동 유형</TableHeader>
                  <TableHeader>활동명</TableHeader>
                  <TableHeader>기간</TableHeader>
                  <TableHeader>활동 내용</TableHeader>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <TableCell>
                      <ActivityTypeBadge type={activity.type}>
                        {activity.type}
                      </ActivityTypeBadge>
                    </TableCell>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.period}</TableCell>
                    <TableCell>{activity.description}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </CardContainer>
        
        <CardContainer>
          <CardTitle>교사 의견</CardTitle>
          {teacherComments.map((comment) => (
            <CommentCard key={comment.id}>
              <CommentHeader>
                <CommentTeacher>{comment.teacher} 선생님</CommentTeacher>
                <CommentDate>{comment.date}</CommentDate>
              </CommentHeader>
              <CommentSubject>{comment.subject}</CommentSubject>
              <CommentContent>{comment.comment}</CommentContent>
            </CommentCard>
          ))}
        </CardContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentRecords;
