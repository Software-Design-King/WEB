import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import { NotificationContainer } from "./styles/StudentDashboard.styles";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import { useUserStore } from "../../../stores/userStore";

// 데이터 임포트
import { notificationData } from "../../../constants/dashboard/studentDashboardData";

// 필요한 컴포넌트 임포트 (실제 사용하는 것만 유지)
import NotificationItem from "../../../components/dashboard/NotificationItem";

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

// 학생 대시보드 컴포넌트
const StudentDashboard = () => {
  // Zustand 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);
  
  // 사용자 정보 로딩 중인 경우 로딩 표시
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

  // 사용자 정보 파싱 - roleInfo에서 학년, 반 정보 추출
  const roleInfoParts = userInfo?.roleInfo
    ? userInfo.roleInfo.match(/(\d+)학년\s*(\d+)반/)
    : null;
  const grade = roleInfoParts ? roleInfoParts[1] : "";
  const classNum = roleInfoParts ? roleInfoParts[2] : "";

  return (
    <DashboardLayout
      userName={userInfo?.name || "사용자"}
      userRole={
        userInfo?.userType == "STUDENT"
          ? "학생"
          : userInfo?.userType == "PARENT"
          ? "학부모"
          : "학생"
      }
      userInfo={userInfo?.roleInfo || ""}
      notificationCount={2}
    >
      <StudentSidebar {...{ isCollapsed: false }} />

      <ContentContainer>
        {/* 2x2 그리드 레이아웃의 네비게이션 카드 */}
        <DashboardGridContainer>
          {/* 학생 성적 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/grades")}
          >
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 22V8H7V22H3ZM10 22V2H14V22H10ZM17 22V14H21V22H17Z" fill={colors.primary.main} />
              </svg>
            </NavIcon>
            <NavTitle>나의 성적 관리</NavTitle>
            <NavDescription>
              나의 학기별 성적을 확인하고 관리할 수 있습니다. 과목별 성적 추이와
              평균을 확인해보세요.
            </NavDescription>
          </NavigationCard>

          {/* 학생부 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/records")}
          >
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={colors.primary.main} opacity="0.3" />
                <path d="M14 2V8H20M16 13H8V15H16V13ZM16 17H8V19H16V17ZM10 9H8V11H10V9Z" stroke={colors.primary.main} strokeWidth="1.5" />
              </svg>
            </NavIcon>
            <NavTitle>나의 학생부 관리</NavTitle>
            <NavDescription>
              나의 출결 상황, 특기사항, 활동 내역 등 학생부 정보를 확인할 수
              있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 피드백 및 상담내역 통합 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/feedback")}
          >
            <NavIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill={colors.primary.main} opacity="0.3" />
                <path d="M13 14H11V12H13V14ZM13 10H11V6H13V10Z" fill={colors.primary.main} />
                <path d="M16 11.78C16 10.73 15.71 9.79 15.21 8.98C15.7 8.52 16 7.87 16 7.14C16 5.96 15.04 5 13.86 5C13 5 12.27 5.43 11.86 6.14C11 6.04 10.13 6 9.23 6C6.36 6 3.87 6.89 3.87 8V10C3.87 11.11 6.36 12 9.23 12C12.1 12 14.59 11.11 14.59 10" stroke={colors.primary.main} strokeWidth="1.5" />
              </svg>
            </NavIcon>
            <NavTitle>피드백 및 상담내역</NavTitle>
            <NavDescription>
              교사로부터 받은 피드백과 상담 내역을 확인할 수 있습니다.
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
                time={notification.time}
                content={notification.content}
                isNew={notification.isNew}
              />
            ))}
          </NotificationContainer>
        </AlertCenterContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentDashboard;
