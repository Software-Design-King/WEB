import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import {
  DashboardGrid,
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import {
  FeedbackContainer,
  CounselingContainer,
  NotificationContainer,
  NotificationItem,
  NotificationTime,
  NotificationContent,
  NotificationBadge,
} from "./styles/TeacherDashboard.styles";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";

// 컴포넌트 임포트
import FeedbackItem from "../../../components/dashboard/FeedbackItem";
import CounselingItem from "../../../components/dashboard/CounselingItem";

// 데이터 임포트
import {
  userData,
  feedbackData,
  counselingData,
  FeedbackData,
  CounselingData,
} from "../../../constants/dashboard/teacherDashboardData";

// 알림 데이터 타입 정의
interface NotificationData {
  id: number;
  time: string;
  content: string;
  isNew: boolean;
}

// 임시 알림 데이터
const notificationData: NotificationData[] = [
  {
    id: 1,
    time: "오늘 09:15",
    content: "김민준 학생이 상담 요청을 보냈습니다.",
    isNew: true,
  },
  {
    id: 2,
    time: "오늘 08:30",
    content: "이주원 학생의 과제가 제출되었습니다.",
    isNew: true,
  },
  {
    id: 3,
    time: "어제 15:45",
    content: "박서연 학생의 출석 상태가 변경되었습니다.",
    isNew: false,
  },
  {
    id: 4,
    time: "어제 13:20",
    content: "다음 주 학부모 상담 일정이 확정되었습니다.",
    isNew: false,
  },
];

// 대시보드 그리드 컨테이너 - 2x2 그리드 레이아웃을 위한 컴포넌트
const DashboardGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

// 네비게이션 카드
const NavigationCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 220px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    height: 180px;
  }
`;

// 알림 센터 컨테이너
const AlertCenterContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

// 알림 센터 제목
const AlertCenterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
`;

// 네비게이션 아이콘
const NavIcon = styled.div`
  font-size: 3rem;
  color: ${colors.primary.main};
  margin-bottom: 1rem;
`;

// 네비게이션 제목
const NavTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

// 네비게이션 설명
const NavDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin: 0;
`;

// 교사 대시보드 컴포넌트
const TeacherDashboard = () => {
  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.subject} 담당`}
      notificationCount={2}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        {/* 2x2 그리드 레이아웃의 네비게이션 카드 */}
        <DashboardGridContainer>
          {/* 학생 성적 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/grades")}
          >
            <NavIcon>📊</NavIcon>
            <NavTitle>학생 성적 관리</NavTitle>
            <NavDescription>
              학생들의 성적을 입력하고 관리할 수 있습니다. 성적 추이와 통계를
              확인해보세요.
            </NavDescription>
          </NavigationCard>

          {/* 학생부 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/records")}
          >
            <NavIcon>📝</NavIcon>
            <NavTitle>학생부 관리</NavTitle>
            <NavDescription>
              학생들의 출결 상황, 특기사항, 활동 내역 등 학생부 정보를 관리할 수
              있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 피드백 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/feedback")}
          >
            <NavIcon>💬</NavIcon>
            <NavTitle>피드백 관리</NavTitle>
            <NavDescription>
              학생들에게 피드백을 작성하고 관리할 수 있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 상담내역 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/counseling")}
          >
            <NavIcon>🤝</NavIcon>
            <NavTitle>상담내역 관리</NavTitle>
            <NavDescription>
              학생 및 학부모 상담 일정을 관리하고 상담 내역을 기록할 수
              있습니다.
            </NavDescription>
          </NavigationCard>
        </DashboardGridContainer>

        {/* 알림 센터 */}
        <AlertCenterContainer>
          <AlertCenterTitle>
            <span style={{ marginRight: "0.5rem" }}>🔔</span> 알림센터
          </AlertCenterTitle>
          <NotificationContainer>
            {notificationData.map((notification) => (
              <NotificationItem
                key={notification.id}
                isNew={notification.isNew}
              >
                <NotificationTime>{notification.time}</NotificationTime>
                <NotificationContent>
                  {notification.content}
                  {notification.isNew && <NotificationBadge />}
                </NotificationContent>
              </NotificationItem>
            ))}
          </NotificationContainer>
        </AlertCenterContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
