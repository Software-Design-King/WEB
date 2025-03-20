import React from "react";
import {
  CounselingItem,
  CounselingHeader,
  CounselingStudent,
  CounselingDate,
  CounselingTitle,
  CounselingContent,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

interface TeacherCounselingItemProps {
  studentName: string;
  date: string;
  title: string;
  content: string;
}

const TeacherCounselingItem: React.FC<TeacherCounselingItemProps> = ({
  studentName,
  date,
  title,
  content,
}) => {
  return (
    <CounselingItem>
      <CounselingHeader>
        <CounselingStudent>{studentName}</CounselingStudent>
        <CounselingDate>{date}</CounselingDate>
      </CounselingHeader>
      <CounselingTitle>{title}</CounselingTitle>
      <CounselingContent>{content}</CounselingContent>
    </CounselingItem>
  );
};

export default TeacherCounselingItem;
