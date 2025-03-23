import React from "react";
import {
  AssignmentStatusContainer,
  AssignmentTitle,
  CounselingDate,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";

export interface TaskData {
  id: number;
  title: string;
  deadline: string;
}

interface TaskItemProps {
  task: TaskData;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { title, deadline } = task;
  
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
