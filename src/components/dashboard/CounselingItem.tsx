import React from 'react';
import {
  CounselingItem as StyledCounselingItem,
  CounselingDate,
  CounselingTitle,
  CounselingContent,
  CounselingTeacher
} from '../../pages/student/dashboard/styles/StudentDashboard.styles';

interface CounselingItemProps {
  date: string;
  title: string;
  content: string;
  teacher: string;
}

const CounselingItem: React.FC<CounselingItemProps> = ({
  date,
  title,
  content,
  teacher
}) => {
  return (
    <StyledCounselingItem>
      <CounselingDate>{date}</CounselingDate>
      <CounselingTitle>{title}</CounselingTitle>
      <CounselingContent>{content}</CounselingContent>
      <CounselingTeacher>담당 교사: {teacher}</CounselingTeacher>
    </StyledCounselingItem>
  );
};

export default CounselingItem;
