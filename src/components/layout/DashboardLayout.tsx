import React, { useState, ReactNode } from "react";
import styled from "@emotion/styled";
import { colors } from "../common/Common.styles";

// 반응형 레이아웃을 위한 미디어 쿼리 브레이크포인트
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1200px",
};

interface LayoutProps {
  children: ReactNode;
  userName: string;
  userRole: string;
  userInfo?: string;
  notificationCount?: number;
}

// 레이아웃 컨테이너
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.background.default};
  max-width: 100%;
`;

// 상단 헤더
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;
`;

// 로고 영역
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: ${colors.primary.main};

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.9rem;

    span {
      display: none;
    }

    span:first-of-type {
      display: block;
    }
  }
`;

// 우측 사용자 정보 영역
const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// 알림 아이콘
const NotificationIcon = styled.div<{ hasNotifications: boolean }>`
  position: relative;
  cursor: pointer;

  &::after {
    content: ${(props) => (props.hasNotifications ? "''" : "none")};
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: ${colors.error.main};
    border-radius: 50%;
  }
`;

// 사용자 아바타
const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary.light};
  color: ${colors.primary.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
`;

// 사용자 정보
const UserInfo = styled.div`
  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

// 사용자 이름
const UserName = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 사용자 역할
const UserRole = styled.div`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
`;

// 메인 컨텐츠 영역 (사이드바 + 컨텐츠)
const MainContent = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 64px);
  width: 100%;
  position: relative;
`;

// 사이드바
const Sidebar = styled.aside<{ isCollapsed: boolean }>`
  width: ${(props) => (props.isCollapsed ? "64px" : "240px")};
  min-width: ${(props) => (props.isCollapsed ? "64px" : "240px")};
  background-color: white;
  border-right: 1px solid ${colors.grey[200]};
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 64px;
  left: 0;
  height: calc(100vh - 64px);
  z-index: 50;
  flex-shrink: 0;

  @media (max-width: ${breakpoints.tablet}) {
    left: ${(props) => (props.isCollapsed ? "-240px" : "0")};
    width: 240px;
    min-width: 240px;
    box-shadow: ${(props) =>
      props.isCollapsed ? "none" : "0 4px 10px rgba(0, 0, 0, 0.1)"};
  }
`;

// 컨텐츠 영역
const ContentArea = styled.main<{ sidebarCollapsed: boolean }>`
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  transition: all 0.3s ease;
  margin-left: ${(props) => (props.sidebarCollapsed ? "64px" : "240px")};
  width: calc(100% - ${(props) => (props.sidebarCollapsed ? "64px" : "240px")});

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

// 사이드바 토글 버튼
const SidebarToggle = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 101;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
  }
`;

// 모바일 오버레이
const MobileOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

export const DashboardLayout: React.FC<LayoutProps> = ({
  children,
  userName,
  userRole,
  userInfo,
  notificationCount = 0,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 사용자 이니셜 생성
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // 첫 번째 자식을 사이드바로, 나머지 자식을 콘텐츠 영역으로 분리
  const childrenArray = React.Children.toArray(children);
  const sidebarContent = childrenArray[0];
  const mainContent = childrenArray.slice(1);

  // 사이드바에 props 전달
  const sidebarWithProps = React.isValidElement(sidebarContent)
    ? React.cloneElement(sidebarContent as React.ReactElement<{ isCollapsed: boolean }>, {
        isCollapsed: sidebarCollapsed,
      })
    : sidebarContent;

  return (
    <LayoutContainer>
      <Header>
        <Logo>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
              fill={colors.primary.main}
            />
            <path
              d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
              fill={colors.primary.main}
            />
          </svg>
          <span>학생 성적 및 상담 관리 시스템</span>
        </Logo>

        <UserSection>
          <NotificationIcon hasNotifications={notificationCount > 0}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                fill={colors.text.secondary}
              />
            </svg>
          </NotificationIcon>

          <UserAvatar>{getInitials(userName)}</UserAvatar>

          <UserInfo>
            <UserName>{userName}</UserName>
            <UserRole>
              {userRole} {userInfo && `(${userInfo})`}
            </UserRole>
          </UserInfo>
        </UserSection>
      </Header>

      <MainContent>
        <Sidebar isCollapsed={sidebarCollapsed}>{sidebarWithProps}</Sidebar>

        <ContentArea sidebarCollapsed={sidebarCollapsed}>
          {mainContent}
        </ContentArea>

        <SidebarToggle onClick={toggleSidebar}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
              fill="white"
            />
          </svg>
        </SidebarToggle>

        <MobileOverlay isVisible={!sidebarCollapsed} onClick={toggleSidebar} />
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
