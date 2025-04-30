import React from 'react';
import {
  AttendanceContainer,
  AttendanceItem,
  AttendanceNumber,
  AttendanceLabel
} from '../../pages/student/dashboard/styles/StudentDashboard.styles';

interface AttendanceStatsProps {
  present: number;
  absent: number;
  late: number;
  earlyLeave: number;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  present,
  absent,
  late,
  earlyLeave
}) => {
  return (
    <AttendanceContainer>
      <AttendanceItem>
        <AttendanceNumber>{present}</AttendanceNumber>
        <AttendanceLabel>출석</AttendanceLabel>
      </AttendanceItem>
      <AttendanceItem>
        <AttendanceNumber>{absent}</AttendanceNumber>
        <AttendanceLabel>결석</AttendanceLabel>
      </AttendanceItem>
      <AttendanceItem>
        <AttendanceNumber>{late}</AttendanceNumber>
        <AttendanceLabel>지각</AttendanceLabel>
      </AttendanceItem>
      <AttendanceItem>
        <AttendanceNumber>{earlyLeave}</AttendanceNumber>
        <AttendanceLabel>조퇴</AttendanceLabel>
      </AttendanceItem>
    </AttendanceContainer>
  );
};

export default AttendanceStats;
