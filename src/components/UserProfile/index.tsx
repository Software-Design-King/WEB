import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../stores/userStore';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a5af8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-right: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
`;

const UserRole = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #4a5568;
`;

const UserType = styled.span`
  display: inline-block;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.children === 'STUDENT' ? '#ebf4ff' : '#f0fff4')};
  color: ${(props) => (props.children === 'STUDENT' ? '#3182ce' : '#38a169')};
`;

const UserProfile: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  if (!userInfo) {
    return null;
  }

  // 이름의 첫 글자를 가져오기
  const nameInitial = userInfo.name.charAt(0);

  return (
    <ProfileContainer>
      <Avatar>{nameInitial}</Avatar>
      <UserInfo>
        <UserName>{userInfo.name}</UserName>
        <UserRole>{userInfo.roleInfo}</UserRole>
        <UserType>{userInfo.userType}</UserType>
      </UserInfo>
    </ProfileContainer>
  );
};

export default UserProfile;
