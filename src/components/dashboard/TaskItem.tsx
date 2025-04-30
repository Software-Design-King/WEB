import React from "react";
import {
  AssignmentStatusContainer,
  AssignmentTitle,
  CounselingDate,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

interface TaskItemProps {
  title: string;
  deadline: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, deadline }) => {
  return (
    <AssignmentStatusContainer>
      <div>
        <AssignmentTitle>{title}</AssignmentTitle>
        <CounselingDate>마감일: {deadline}</CounselingDate>
      </div>
    </AssignmentStatusContainer>
  );
};

export default TaskItem;
