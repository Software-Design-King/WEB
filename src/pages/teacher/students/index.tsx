import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import { useUserStore } from "../../../stores/userStore";
import { colors } from "../../../components/common/Common.styles";
import { ClassroomStudentsStyles } from "./ClassroomStudents.styles";

// 학생 정보 인터페이스
interface Student {
  id: number;
  studentId: string;
  name: string;
  contact: string;
  note: string;
}

// 임시 학생 데이터
const initialStudents: Student[] = [
  {
    id: 1,
    studentId: "2301012",
    name: "권도훈",
    contact: "010-1234-5678",
    note: "프로그래밍 특기생, 코딩대회 수상",
  },
  {
    id: 2,
    studentId: "2025001",
    name: "김민준",
    contact: "010-2345-6789",
    note: "과학 경시대회 참가 예정",
  },
  {
    id: 3,
    studentId: "2025002",
    name: "이서연",
    contact: "010-3456-7890",
    note: "미술 특기생",
  },
  {
    id: 4,
    studentId: "2025003",
    name: "박지훈",
    contact: "010-4567-8901",
    note: "전교 회장",
  },
  {
    id: 5,
    studentId: "2025004",
    name: "최예은",
    contact: "010-5678-9012",
    note: "",
  },
  {
    id: 6,
    studentId: "2025005",
    name: "정우진",
    contact: "010-9012-3456",
    note: "수학 경시대회 참가 예정",
  },
];

const ClassroomStudents = () => {
  // Zustand 스토어에서 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);

  // 학생 목록 상태 관리
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    studentId: "",
    name: "",
    contact: "",
    note: "",
  });

  // 학급 정보 (예: "1학년 1반")
  const classInfo = userInfo?.roleInfo || "학급 정보 없음";

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewStudent({
      studentId: "",
      name: "",
      contact: "",
      note: "",
    });
  };

  // 입력 필드 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  // 학생 추가
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.studentId) {
      alert("학번과 이름은 필수 입력 항목입니다.");
      return;
    }

    const newId =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

    setStudents([
      ...students,
      {
        id: newId,
        ...newStudent,
      },
    ]);

    handleCloseModal();
  };

  // 학생 삭제
  const handleDeleteStudent = (id: number) => {
    if (window.confirm("정말 이 학생을 목록에서 삭제하시겠습니까?")) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  // 로딩 중이거나 사용자 정보가 없는 경우
  if (isLoading || !userInfo) {
    return (
      <DashboardLayout
        userName="로딩 중..."
        userRole="교사"
        userInfo="정보를 불러오는 중입니다."
        notificationCount={0}
      >
        <div>사용자 정보를 불러오는 중입니다...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={userInfo.name}
      userRole={userInfo.userType === "TEACHER" ? "교사" : "사용자"}
      userInfo={userInfo.roleInfo || "과목 정보 없음"}
      notificationCount={2}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        {/* 헤더 섹션 */}
        <ClassroomStudentsStyles.Header>
          <ClassroomStudentsStyles.Title>
            {classInfo} 학생 목록
          </ClassroomStudentsStyles.Title>
          <ClassroomStudentsStyles.AddButton onClick={handleOpenModal}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                fill="white"
              />
            </svg>
            학생 추가
          </ClassroomStudentsStyles.AddButton>
        </ClassroomStudentsStyles.Header>

        {/* 학생 테이블 */}
        <ClassroomStudentsStyles.TableContainer>
          <ClassroomStudentsStyles.Table>
            <thead>
              <tr>
                <ClassroomStudentsStyles.TableHeader width="5%">
                  No
                </ClassroomStudentsStyles.TableHeader>
                <ClassroomStudentsStyles.TableHeader width="15%">
                  학번
                </ClassroomStudentsStyles.TableHeader>
                <ClassroomStudentsStyles.TableHeader width="20%">
                  이름
                </ClassroomStudentsStyles.TableHeader>
                <ClassroomStudentsStyles.TableHeader width="20%">
                  연락처
                </ClassroomStudentsStyles.TableHeader>
                <ClassroomStudentsStyles.TableHeader width="30%">
                  특이사항
                </ClassroomStudentsStyles.TableHeader>
                <ClassroomStudentsStyles.TableHeader width="10%">
                  관리
                </ClassroomStudentsStyles.TableHeader>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <ClassroomStudentsStyles.TableCell>
                    {index + 1}
                  </ClassroomStudentsStyles.TableCell>
                  <ClassroomStudentsStyles.TableCell>
                    {student.studentId}
                  </ClassroomStudentsStyles.TableCell>
                  <ClassroomStudentsStyles.TableCell>
                    {student.name}
                  </ClassroomStudentsStyles.TableCell>
                  <ClassroomStudentsStyles.TableCell>
                    {student.contact}
                  </ClassroomStudentsStyles.TableCell>
                  <ClassroomStudentsStyles.TableCell>
                    {student.note || "-"}
                  </ClassroomStudentsStyles.TableCell>
                  <ClassroomStudentsStyles.TableCell>
                    <ClassroomStudentsStyles.ActionButton
                      onClick={() => handleDeleteStudent(student.id)}
                      color="#f44336"
                    >
                      삭제
                    </ClassroomStudentsStyles.ActionButton>
                  </ClassroomStudentsStyles.TableCell>
                </tr>
              ))}
            </tbody>
          </ClassroomStudentsStyles.Table>
        </ClassroomStudentsStyles.TableContainer>

        {/* 학생 없는 경우 */}
        {students.length === 0 && (
          <ClassroomStudentsStyles.EmptyState>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 15C14.7 15 17.8 16.29 18 17V18H6V17.01C6.2 16.29 9.3 15 12 15ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"
                fill={colors.grey[400]}
              />
            </svg>
            <p>등록된 학생이 없습니다.</p>
          </ClassroomStudentsStyles.EmptyState>
        )}

        {/* 학생 추가 모달 */}
        {isModalOpen && (
          <ClassroomStudentsStyles.ModalOverlay>
            <ClassroomStudentsStyles.Modal>
              <ClassroomStudentsStyles.ModalHeader>
                <h3>학생 추가</h3>
                <ClassroomStudentsStyles.CloseButton onClick={handleCloseModal}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill={colors.text.secondary}
                    />
                  </svg>
                </ClassroomStudentsStyles.CloseButton>
              </ClassroomStudentsStyles.ModalHeader>

              <ClassroomStudentsStyles.ModalContent>
                <ClassroomStudentsStyles.FormGroup>
                  <label htmlFor="studentId">학번 *</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={newStudent.studentId}
                    onChange={handleInputChange}
                    placeholder="학번을 입력하세요"
                    required
                  />
                </ClassroomStudentsStyles.FormGroup>

                <ClassroomStudentsStyles.FormGroup>
                  <label htmlFor="name">이름 *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                    required
                  />
                </ClassroomStudentsStyles.FormGroup>

                <ClassroomStudentsStyles.FormGroup>
                  <label htmlFor="contact">연락처</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={newStudent.contact}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력하세요"
                  />
                </ClassroomStudentsStyles.FormGroup>

                <ClassroomStudentsStyles.FormGroup>
                  <label htmlFor="note">특이사항</label>
                  <textarea
                    id="note"
                    name="note"
                    value={newStudent.note}
                    onChange={handleInputChange}
                    placeholder="특이사항을 입력하세요"
                    rows={3}
                  ></textarea>
                </ClassroomStudentsStyles.FormGroup>
              </ClassroomStudentsStyles.ModalContent>

              <ClassroomStudentsStyles.ModalFooter>
                <ClassroomStudentsStyles.CancelButton
                  onClick={handleCloseModal}
                >
                  취소
                </ClassroomStudentsStyles.CancelButton>
                <ClassroomStudentsStyles.SaveButton onClick={handleAddStudent}>
                  저장
                </ClassroomStudentsStyles.SaveButton>
              </ClassroomStudentsStyles.ModalFooter>
            </ClassroomStudentsStyles.Modal>
          </ClassroomStudentsStyles.ModalOverlay>
        )}
      </ContentContainer>
    </DashboardLayout>
  );
};

export default ClassroomStudents;
