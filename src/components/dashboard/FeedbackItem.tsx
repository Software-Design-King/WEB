import React from 'react';
import {
  FeedbackItem as StyledFeedbackItem,
  FeedbackCategory,
  FeedbackDate,
  FeedbackContent,
  FeedbackTeacher
} from '../../pages/student/dashboard/styles/StudentDashboard.styles';

interface FeedbackItemProps {
  category: string;
  date: string;
  content: string;
  teacher: string;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  category,
  date,
  content,
  teacher
}) => {
  return (
    <StyledFeedbackItem>
      <FeedbackCategory>{category}</FeedbackCategory>
      <FeedbackDate>{date}</FeedbackDate>
      <FeedbackContent>{content}</FeedbackContent>
      <FeedbackTeacher>담당 교사: {teacher}</FeedbackTeacher>
    </StyledFeedbackItem>
  );
};

export default FeedbackItem;
