import React from "react";
import {
  FeedbackItem,
  FeedbackHeader,
  FeedbackStudent,
  FeedbackDate,
  FeedbackCategory,
  FeedbackContent,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

export interface FeedbackData {
  id: number;
  studentName: string;
  category: string;
  date: string;
  content: string;
}

interface TeacherFeedbackItemProps {
  feedback: FeedbackData;
}

const TeacherFeedbackItem: React.FC<TeacherFeedbackItemProps> = ({
  feedback,
}) => {
  const { studentName, date, category, content } = feedback;
  
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
