import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import {
  NotificationContainer,
  NotificationItem,
  NotificationTime,
  NotificationContent,
  NotificationBadge,
} from "./styles/TeacherDashboard.styles";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import { useUserStore } from "../../../stores/userStore";

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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 48px;
    height: 48px;
  }
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
  // Zustand 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);

  // 콘솔 로그 추가
  console.log("교사 대시보드 - Zustand에 저장된 사용자 정보:", userInfo);

  // 사용자 정보 로딩 중인 경우 로딩 표시
  if (isLoading || !userInfo) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userRole="교사"
        userInfo="정보를 불러오는 중입니다."
        notificationCount={0}
      >
        <div>사용자 정보를 불러오는 중입니다...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={userInfo.name}
      userRole={userInfo.userType === "TEACHER" ? "교사" : "사용자"}
      userInfo={userInfo.roleInfo || "과목 정보 없음"}
      notificationCount={2}
    >
      <TeacherSidebar {...{ isCollapsed: false }} />

      <ContentContainer>
        {/* 2x2 그리드 레이아웃의 네비게이션 카드 */}
        <DashboardGridContainer>
          {/* 학생 성적 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/grades")}
          >
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill={colors.primary.main} />
              </svg>
            </NavIcon>
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
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={colors.primary.main} opacity="0.3" />
                <path d="M14 2V8H20M16 13H8V15H16V13ZM16 17H8V19H16V17ZM10 9H8V11H10V9Z" stroke={colors.primary.main} strokeWidth="1.5" />
              </svg>
            </NavIcon>
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
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill={colors.primary.main} opacity="0.3" />
                <path d="M13 14H11V12H13V14ZM13 10H11V6H13V10Z" fill={colors.primary.main} />
              </svg>
            </NavIcon>
            <NavTitle>피드백 관리</NavTitle>
            <NavDescription>
              학생들에게 피드백을 작성하고 관리할 수 있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 상담 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/teacher/consultation")}
          >
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill={colors.primary.main} />
                <path d="M11 12H13V14H11V12ZM11 6H13V10H11V6Z" fill={colors.primary.main} />
              </svg>
            </NavIcon>
            <NavTitle>상담내역 관리</NavTitle>
            <NavDescription>
              학생 및 학부모와의 상담 일정을 관리하고 상담 내역을 기록할 수
              있습니다.
            </NavDescription>
          </NavigationCard>
        </DashboardGridContainer>

        {/* 알림 센터 */}
        <AlertCenterContainer>
          <AlertCenterTitle>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill={colors.primary.main} />
            </svg>
            알림센터
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
