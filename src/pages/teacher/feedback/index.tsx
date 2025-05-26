import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import StudentSidebar from "../../../components/teacher/StudentSidebar";
import { useUserStore } from "../../../stores/userStore";
import { FeedbackContainer } from "./components/FeedbackContainer";
import { PageContainer, ContentArea } from "./styles";

const TeacherFeedbackPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || "선생님"}
      userRole="교사"
      userInfo="피드백 관리"
      notificationCount={0}
    >
      <TeacherSidebar isCollapsed={false} />
      <PageContainer>
        <StudentSidebar 
          onSelectStudent={handleSelectStudent} 
          selectedStudentId={selectedStudentId} 
        />
        
        <ContentArea>
          <h1>피드백 관리</h1>
          <p>학생들의 학습 및 행동 피드백을 관리합니다.</p>
          
          <FeedbackContainer selectedStudentId={selectedStudentId} />
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default TeacherFeedbackPage;
