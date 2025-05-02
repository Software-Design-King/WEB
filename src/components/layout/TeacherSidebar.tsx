import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "../common/Common.styles";

// 사이드바 컨테이너
const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 2rem;
  min-width: 0;
`;

// 메뉴 그룹
const MenuGroup = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

// 메뉴 그룹 제목
const MenuGroupTitle = styled.div<{ isCollapsed: boolean }>`
  padding: ${(props) => (props.isCollapsed ? "1rem 0" : "1rem")};
  color: ${colors.text.secondary};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  display: ${(props) => (props.isCollapsed ? "none" : "block")};
`;

// 메뉴 아이템
const MenuItem = styled.div<{ active: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(props) => (props.isCollapsed ? "1rem 0" : "0.75rem 1rem")};
  cursor: pointer;
  color: ${(props) =>
    props.active ? colors.primary.main : colors.text.primary};
  background-color: ${(props) =>
    props.active ? colors.primary.light + "33" : "transparent"};
  border-left: ${(props) =>
    props.active
      ? `3px solid ${colors.primary.main}`
      : "3px solid transparent"};
  transition: all 0.2s ease;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
  white-space: nowrap;
  width: 100%;

  &:hover {
    background-color: ${colors.grey[100]};
  }
`;

// 메뉴 아이콘
const MenuIcon = styled.span<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => (props.isCollapsed ? "0" : "0.75rem")};
  min-width: ${(props) => (props.isCollapsed ? "24px" : "24px")};
  flex-shrink: 0;
`;

// 메뉴 텍스트
const MenuText = styled.span<{ isCollapsed: boolean }>`
  display: ${(props) => (props.isCollapsed ? "none" : "block")};
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface TeacherSidebarProps {
  isCollapsed: boolean;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  isCollapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 활성화된 메뉴 확인
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <SidebarContainer>
      <MenuGroup>
        <MenuGroupTitle isCollapsed={isCollapsed}>메인</MenuGroupTitle>
        <MenuItem
          active={isActive("/teacher/dashboard")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/dashboard")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
                fill={
                  isActive("/teacher/dashboard")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>대시보드</MenuText>
        </MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuGroupTitle isCollapsed={isCollapsed}>학생 관리</MenuGroupTitle>
        <MenuItem
          active={isActive("/teacher/students")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/students")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill={
                  isActive("/teacher/students")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>학생 목록</MenuText>
        </MenuItem>

        <MenuItem
          active={isActive("/teacher/grades")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/grades")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                fill={
                  isActive("/teacher/grades")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>성적 관리</MenuText>
        </MenuItem>

        <MenuItem
          active={isActive("/teacher/records")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/records")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
                fill={
                  isActive("/teacher/records")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>학생부 관리</MenuText>
        </MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuGroupTitle isCollapsed={isCollapsed}>
          상담 및 피드백
        </MenuGroupTitle>
        <MenuItem
          active={isActive("/teacher/consultation")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/consultation")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                fill={
                  isActive("/teacher/consultation")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>상담내역 관리</MenuText>
        </MenuItem>

        <MenuItem
          active={isActive("/teacher/feedback")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/feedback")}
        >
          <MenuIcon isCollapsed={isCollapsed}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM13 14H11V12H13V14ZM13 10H11V6H13V10Z"
                fill={
                  isActive("/teacher/feedback")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>피드백 관리</MenuText>
        </MenuItem>
      </MenuGroup>
    </SidebarContainer>
  );
};

export default TeacherSidebar;
