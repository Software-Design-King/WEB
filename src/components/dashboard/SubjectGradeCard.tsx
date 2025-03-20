import React from 'react';
import { 
  SubjectGradeCard as StyledSubjectGradeCard, 
  SubjectName, 
  SubjectScore, 
  SubjectGrade 
} from '../../pages/student/dashboard/styles/StudentDashboard.styles';

interface SubjectGradeCardProps {
  subject: string;
  score: number;
  grade: string;
  performance: "excellent" | "good" | "average" | "poor";
}

const SubjectGradeCard: React.FC<SubjectGradeCardProps> = ({ 
  subject, 
  score, 
  grade, 
  performance 
}) => {
  return (
    <StyledSubjectGradeCard performance={performance}>
      <SubjectName>{subject}</SubjectName>
      <SubjectScore>{score}</SubjectScore>
      <SubjectGrade>{grade}</SubjectGrade>
    </StyledSubjectGradeCard>
  );
};

export default SubjectGradeCard;
