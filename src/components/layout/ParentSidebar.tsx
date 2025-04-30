import React from 'react';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import { colors } from '../common/Common.styles';

// 아이콘을 위한 SVG 컴포넌트
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ConsultationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 스타일 컴포넌트
const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  width: ${(props) => (props.isCollapsed ? '80px' : '280px')};
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 10;
  overflow-x: hidden;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const SidebarLogo = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  color: ${colors.primary.main};
`;

const SidebarMenu = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 0.5rem;
`;

const MenuLink = styled(Link)<{ active: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(props) => (props.isCollapsed ? '0.75rem' : '0.75rem 1.5rem')};
  color: ${(props) => (props.active ? colors.primary.main : colors.text.secondary)};
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 4px solid ${(props) => (props.active ? colors.primary.main : 'transparent')};
  background-color: ${(props) => (props.active ? colors.primary.light + '20' : 'transparent')};
  
  &:hover {
    background-color: ${colors.grey[100]};
    color: ${colors.primary.main};
  }
  
  svg {
    margin-right: ${(props) => (props.isCollapsed ? '0' : '1rem')};
    margin-left: ${(props) => (props.isCollapsed ? '0.25rem' : '0')};
  }
`;

const MenuText = styled.span<{ isCollapsed: boolean }>`
  display: ${(props) => (props.isCollapsed ? 'none' : 'inline')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${colors.grey[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${colors.text.secondary};
  padding: 0.5rem;
  
  &:hover {
    color: ${colors.primary.main};
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

// 테마 전환 버튼 컴포넌트
const ThemeToggleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 사이드바 접기/펼치기 아이콘
const CollapseIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ParentSidebarProps {
  isCollapsed: boolean;
}

const ParentSidebar: React.FC<ParentSidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  
  // 현재 경로와 메뉴 아이템 경로를 비교하여 active 상태 확인
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <SidebarHeader>
        {!isCollapsed && <SidebarLogo>학부모 페이지</SidebarLogo>}
      </SidebarHeader>
      
      <SidebarMenu>
        <MenuList>
          <MenuItem>
            <MenuLink to="/parent/dashboard" active={isActive('/parent/dashboard')} isCollapsed={isCollapsed}>
              <HomeIcon />
              <MenuText isCollapsed={isCollapsed}>대시보드</MenuText>
            </MenuLink>
          </MenuItem>
          
          <MenuItem>
            <MenuLink to="/parent/feedback" active={isActive('/parent/feedback')} isCollapsed={isCollapsed}>
              <FeedbackIcon />
              <MenuText isCollapsed={isCollapsed}>피드백 내역</MenuText>
            </MenuLink>
          </MenuItem>
          
          <MenuItem>
            <MenuLink to="/parent/consultation" active={isActive('/parent/consultation')} isCollapsed={isCollapsed}>
              <ConsultationIcon />
              <MenuText isCollapsed={isCollapsed}>상담 내역</MenuText>
            </MenuLink>
          </MenuItem>
          
          <MenuItem>
            <MenuLink to="/parent/settings" active={isActive('/parent/settings')} isCollapsed={isCollapsed}>
              <SettingsIcon />
              <MenuText isCollapsed={isCollapsed}>설정</MenuText>
            </MenuLink>
          </MenuItem>
        </MenuList>
      </SidebarMenu>
      
      <SidebarFooter>
        {!isCollapsed && (
          <ToggleButton>
            <ThemeToggleIcon />
          </ToggleButton>
        )}
        
        <ToggleButton>
          <CollapseIcon isCollapsed={isCollapsed} />
        </ToggleButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default ParentSidebar;
