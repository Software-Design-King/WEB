import React, { useState } from "react";
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

// 메뉴 카운트
const MenuCount = styled.span<{ isCollapsed: boolean }>`
  display: ${(props) => (props.isCollapsed ? "none" : "flex")};
  margin-left: auto;
  background-color: ${colors.primary.main};
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
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
          active={isActive("/teacher/counseling")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/counseling")}
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
                  isActive("/teacher/counseling")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>상담 내역</MenuText>
          <MenuCount isCollapsed={isCollapsed}>3</MenuCount>
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

      <MenuGroup>
        <MenuGroupTitle isCollapsed={isCollapsed}>보고서</MenuGroupTitle>
        <MenuItem
          active={isActive("/teacher/reports")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/teacher/reports")}
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
                  isActive("/teacher/reports")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>보고서 생성</MenuText>
        </MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuGroupTitle isCollapsed={isCollapsed}>시스템</MenuGroupTitle>
        <MenuItem
          active={isActive("/settings")}
          isCollapsed={isCollapsed}
          onClick={() => navigate("/settings")}
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
                d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.14 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.91 7.63 6.29L5.24 5.33C5.02 5.26 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.07 2.66 9.34 2.86 9.48L4.88 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.86 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.74 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.16 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
                fill={
                  isActive("/settings")
                    ? colors.primary.main
                    : colors.text.secondary
                }
              />
            </svg>
          </MenuIcon>
          <MenuText isCollapsed={isCollapsed}>설정</MenuText>
        </MenuItem>
      </MenuGroup>
    </SidebarContainer>
  );
};

export default TeacherSidebar;
