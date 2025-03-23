import React from 'react';
import {
  NotificationItem as StyledNotificationItem,
  NotificationTime,
  NotificationContent,
  NotificationBadge
} from '../../pages/student/dashboard/styles/StudentDashboard.styles';

interface NotificationItemProps {
  time: string;
  content: string;
  isNew: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  time,
  content,
  isNew
}) => {
  return (
    <StyledNotificationItem>
      {isNew && <NotificationBadge />}
      <NotificationTime>{time}</NotificationTime>
      <NotificationContent>{content}</NotificationContent>
    </StyledNotificationItem>
  );
};

export default NotificationItem;
