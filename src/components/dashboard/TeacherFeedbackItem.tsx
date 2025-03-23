import React from "react";
import {
  FeedbackItem,
  FeedbackHeader,
  FeedbackStudent,
  FeedbackDate,
  FeedbackCategory,
  FeedbackContent,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

interface TeacherFeedbackItemProps {
  studentName: string;
  date: string;
  category: string;
  content: string;
}

const TeacherFeedbackItem: React.FC<TeacherFeedbackItemProps> = ({
  studentName,
  date,
  category,
  content,
}) => {
  return (
    <FeedbackItem>
      <FeedbackHeader>
        <FeedbackStudent>{studentName}</FeedbackStudent>
        <FeedbackDate>{date}</FeedbackDate>
      </FeedbackHeader>
      <FeedbackCategory>{category}</FeedbackCategory>
      <FeedbackContent>{content}</FeedbackContent>
    </FeedbackItem>
  );
};

export default TeacherFeedbackItem;
