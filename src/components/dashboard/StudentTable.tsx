import React from "react";
import {
  TableContainer,
  StudentTable as StyledStudentTable,
  TableRow,
  TableCell,
  TableHeader,
  StatusBadge,
} from "../../pages/teacher/dashboard/styles/TeacherDashboard.styles";
import { StudentStatus } from "../../constants/dashboard/teacherDashboardData";

interface Student {
  id: number;
  number: number;
  name: string;
  attendance: number;
  averageGrade: number;
  status: StudentStatus;
}

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ students }) => {
  const getStatusText = (status: StudentStatus) => {
    switch (status) {
      case "good":
        return "양호";
      case "warning":
        return "주의";
      case "alert":
        return "경고";
      default:
        return "";
    }
  };

  return (
    <TableContainer>
      <StyledStudentTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>출석률</TableHeader>
            <TableHeader>평균 성적</TableHeader>
            <TableHeader>상태</TableHeader>
            <TableHeader>액션</TableHeader>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.number}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.attendance}%</TableCell>
              <TableCell>{student.averageGrade}</TableCell>
              <TableCell>
                <StatusBadge status={student.status}>
                  {getStatusText(student.status)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2196f3",
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                    }}
                  >
                    상세
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2196f3",
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "4px",
                      transition: "background-color 0.2s",
                    }}
                  >
                    상담
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledStudentTable>
    </TableContainer>
  );
};

export default StudentTable;
