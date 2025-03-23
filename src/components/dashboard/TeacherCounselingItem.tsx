import React from "react";
import {
  CounselingItem,
  CounselingHeader,
  CounselingStudent,
  CounselingDate,
  CounselingTitle,
  CounselingContent,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

export interface CounselingData {
  id: number;
  studentName: string;
  date: string;
  title: string;
  content: string;
}

interface TeacherCounselingItemProps {
  counseling: CounselingData;
}

const TeacherCounselingItem: React.FC<TeacherCounselingItemProps> = ({
  counseling,
}) => {
  const { studentName, date, title, content } = counseling;
  
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
