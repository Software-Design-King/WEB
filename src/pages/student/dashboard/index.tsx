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

// 학생 대시보드 컴포넌트
const StudentDashboard = () => {
  // Zustand로부터 사용자 정보 가져오기
  const { userInfo } = useUserStore();

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
      <StudentSidebar isCollapsed={false} />

      <ContentContainer>
        {/* 2x2 그리드 레이아웃의 네비게이션 카드 */}
        <DashboardGridContainer>
          {/* 학생 성적 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/grades")}
          >
            <NavIcon>📊</NavIcon>
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
            <NavIcon>📝</NavIcon>
            <NavTitle>나의 학생부 관리</NavTitle>
            <NavDescription>
              나의 출결 상황, 특기사항, 활동 내역 등 학생부 정보를 확인할 수
              있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 피드백 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/feedback")}
          >
            <NavIcon>💬</NavIcon>
            <NavTitle>피드백 열람</NavTitle>
            <NavDescription>
              교사로부터 받은 피드백을 확인하고 관리할 수 있습니다.
            </NavDescription>
          </NavigationCard>

          {/* 상담내역 관리 */}
          <NavigationCard
            onClick={() => (window.location.href = "/student/consultation")}
          >
            <NavIcon>🤝</NavIcon>
            <NavTitle>상담내역 관리</NavTitle>
            <NavDescription>
              상담 일정을 예약하고 이전 상담 내역을 확인할 수 있습니다.
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
