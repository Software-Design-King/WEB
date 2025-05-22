import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import { useUserStore } from "../../../stores/userStore";
import { colors } from "../../../components/common/Common.styles";
import { ClassroomStudentsStyles } from "./ClassroomStudents.styles";
import BatchUpload from "./BatchUpload";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
// API 응답 인터페이스
interface StudentListResponse {
  code: number;
  message: string;
  data: {
    grade: number;
    students: Student[];
  }
}

// 학생 정보 인터페이스
interface Student {
  id: number; // 내부 고유 ID
  name: string;
  // 추가 정보를 위한 필드
  studentNumber?: string; 
  contact?: string;
  note?: string;
  status?: "active" | "inactive";
}

// 제거됨: 더 이상 사용하지 않는 임시 학생 데이터

const ClassroomStudents = () => {
  // Zustand 스토어에서 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);

  // 학생 목록 상태 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [grade, setGrade] = useState<number | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    studentNumber: "",
    name: "",
    contact: "",
    note: "",
    status: "active",
  });

  // 학급 정보 (학년 포함)
  const classInfo = grade ? `${grade}학년 ${userInfo?.roleInfo || ""}` : userInfo?.roleInfo || "학급 정보 없음";

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBatchMode(false);
    setNewStudent({
      studentNumber: "",
      name: "",
      contact: "",
      note: "",
      status: "active",
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
    if (!newStudent.name || !newStudent.studentNumber) {
      alert("번호와 이름은 필수 입력 항목입니다.");
      return;
    }

    const newId =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

    const updatedStudents = [
      ...students,
      {
        id: newId,
        ...newStudent,
      },
    ];

    setStudents(updatedStudents);
    updateFilteredStudents(updatedStudents);
    handleCloseModal();
  };

  // 일괄 학생 추가
  const handleBatchUpload = (batchStudents: Omit<Student, "id">[]) => {
    if (batchStudents.length === 0) return;

    let lastId =
      students.length > 0 ? Math.max(...students.map((s) => s.id)) : 0;

    const newStudents = batchStudents.map((student) => ({
      ...student,
      id: ++lastId,
      status: "active" as const,
    }));

    const updatedStudents = [...students, ...newStudents];
    setStudents(updatedStudents);
    updateFilteredStudents(updatedStudents);
    handleCloseModal();
  };

  // 필터링 및 검색 기능
  const updateFilteredStudents = (studentList: Student[] = students) => {
    if (!searchQuery) {
      setFilteredStudents(studentList);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = studentList.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.studentNumber.toLowerCase().includes(query) ||
        student.contact.toLowerCase().includes(query) ||
        student.note.toLowerCase().includes(query)
    );

    setFilteredStudents(filtered);
  };

  // API에서 학생 목록 가져오기
  const fetchStudents = async () => {
    setIsApiLoading(true);
    setError(null);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://www.software-design-king.p-e.kr";
      const response = await axios.get<StudentListResponse>(`${apiBaseUrl}/student/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.code === 20000) {
        console.log('학생 목록 조회 성공:', response.data);
        setGrade(response.data.data.grade);
        setStudents(response.data.data.students);
        setFilteredStudents(response.data.data.students);
      } else {
        setError(`데이터를 불러오는데 실패했습니다: ${response.data.message}`);
      }
    } catch (err) {
      console.error('학생 목록을 불러오는데 실패했습니다:', err);
      setError('학생 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsApiLoading(false);
    }
  };

  // 컴포넌트 마운트 시 학생 목록 가져오기
  useEffect(() => {
    fetchStudents();
  }, []);

  // 검색 쿼리 변경 시 필터링 적용
  useEffect(() => {
    updateFilteredStudents();
    // 검색 결과가 바뀌면 1페이지로 리셋
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // 페이지네이션 처리
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // 학생 삭제
  const handleDeleteStudent = (id: number) => {
    if (window.confirm("정말 이 학생을 목록에서 삭제하시겠습니까?")) {
      const updatedStudents = students.filter((student) => student.id !== id);
      setStudents(updatedStudents);
      updateFilteredStudents(updatedStudents);
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
          <ClassroomStudentsStyles.ButtonGroup>
            <ClassroomStudentsStyles.AddButton
              onClick={() => {
                setIsBatchMode(false);
                setIsModalOpen(true);
              }}
            >
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
            <ClassroomStudentsStyles.DropdownButton
              onClick={() => {
                setIsBatchMode(true);
                setIsModalOpen(true);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                  fill={colors.primary.main}
                />
              </svg>
              일괄 등록
            </ClassroomStudentsStyles.DropdownButton>
          </ClassroomStudentsStyles.ButtonGroup>
        </ClassroomStudentsStyles.Header>

        {/* 검색 및 뷰 모드 전환 */}
        <ClassroomStudentsStyles.Toolbar>
          <ClassroomStudentsStyles.SearchBox>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
            <input
              type="text"
              placeholder="학생 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </ClassroomStudentsStyles.SearchBox>

          <ClassroomStudentsStyles.ViewTabs>
            <ClassroomStudentsStyles.ViewTab
              active={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.5rem" }}
              >
                <path
                  d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
                  fill="currentColor"
                />
              </svg>
              목록
            </ClassroomStudentsStyles.ViewTab>
            <ClassroomStudentsStyles.ViewTab
              active={viewMode === "card"}
              onClick={() => setViewMode("card")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.5rem" }}
              >
                <path
                  d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8 12h8v-8h-8v8zm2-6h4v4h-4v-4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-10v8h8V3h-8zm6 6h-4V5h4v4z"
                  fill="currentColor"
                />
              </svg>
              카드
            </ClassroomStudentsStyles.ViewTab>
          </ClassroomStudentsStyles.ViewTabs>
        </ClassroomStudentsStyles.Toolbar>

        {/* 목록 뷰 및 카드 뷰 전환 */}
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ClassroomStudentsStyles.TableContainer>
                <ClassroomStudentsStyles.Table>
                  <thead>
                    <tr>
                      <ClassroomStudentsStyles.TableHeader width="5%">
                        No
                      </ClassroomStudentsStyles.TableHeader>
                      <ClassroomStudentsStyles.TableHeader width="10%">
                        번호
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
                    {currentStudents.map((student, index) => (
                      <tr key={student.id}>
                        <ClassroomStudentsStyles.TableCell>
                          {indexOfFirstStudent + index + 1}
                        </ClassroomStudentsStyles.TableCell>
                        <ClassroomStudentsStyles.TableCell>
                          {student.studentNumber || "-"}
                        </ClassroomStudentsStyles.TableCell>
                        <ClassroomStudentsStyles.TableCell>
                          {student.name}
                        </ClassroomStudentsStyles.TableCell>
                        <ClassroomStudentsStyles.TableCell>
                          {student.contact || "-"}
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
            </motion.div>
          ) : (
            <motion.div
              key="card-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ClassroomStudentsStyles.CardGrid>
                {currentStudents.map((student) => (
                  <ClassroomStudentsStyles.StudentCard key={student.id}>
                    <ClassroomStudentsStyles.CardHeader>
                      <ClassroomStudentsStyles.CardName>
                        {student.name}
                      </ClassroomStudentsStyles.CardName>
                      <ClassroomStudentsStyles.CardId>
                        번호: {student.studentNumber || "-"}
                      </ClassroomStudentsStyles.CardId>
                    </ClassroomStudentsStyles.CardHeader>

                    <ClassroomStudentsStyles.CardContent>
                      <ClassroomStudentsStyles.CardDetail>
                        <ClassroomStudentsStyles.CardIcon>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                              fill="currentColor"
                            />
                          </svg>
                        </ClassroomStudentsStyles.CardIcon>
                        <ClassroomStudentsStyles.CardText>
                          {student.contact || "-"}
                        </ClassroomStudentsStyles.CardText>
                      </ClassroomStudentsStyles.CardDetail>

                      <ClassroomStudentsStyles.CardDetail>
                        <ClassroomStudentsStyles.CardIcon>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                              fill="currentColor"
                            />
                          </svg>
                        </ClassroomStudentsStyles.CardIcon>
                        <ClassroomStudentsStyles.CardText>
                          {student.note || "-"}
                        </ClassroomStudentsStyles.CardText>
                      </ClassroomStudentsStyles.CardDetail>
                    </ClassroomStudentsStyles.CardContent>

                    <ClassroomStudentsStyles.CardFooter>
                      <ClassroomStudentsStyles.ActionButton
                        onClick={() => handleDeleteStudent(student.id)}
                        color="#f44336"
                      >
                        삭제
                      </ClassroomStudentsStyles.ActionButton>
                    </ClassroomStudentsStyles.CardFooter>
                  </ClassroomStudentsStyles.StudentCard>
                ))}
              </ClassroomStudentsStyles.CardGrid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API 로딩 중 표시 */}
        {isApiLoading && (
          <ClassroomStudentsStyles.EmptyState>
            <p>학생 목록을 불러오는 중입니다...</p>
          </ClassroomStudentsStyles.EmptyState>
        )}

        {/* 에러 메시지 표시 */}
        {error && !isApiLoading && (
          <ClassroomStudentsStyles.EmptyState>
            <p style={{ color: "#f44336" }}>{error}</p>
            <ClassroomStudentsStyles.ActionButton
              onClick={fetchStudents}
              color="#2196f3"
              style={{ marginTop: '1rem' }}
            >
              다시 시도
            </ClassroomStudentsStyles.ActionButton>
          </ClassroomStudentsStyles.EmptyState>
        )}

        {/* 학생 없는 경우 */}
        {!isApiLoading && !error && filteredStudents.length === 0 && (
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
            {searchQuery ? (
              <p>키워드 "{searchQuery}"와 일치하는 학생이 없습니다.</p>
            ) : (
              <p>등록된 학생이 없습니다.</p>
            )}
          </ClassroomStudentsStyles.EmptyState>
        )}

        {/* 페이지네이션 */}
        {filteredStudents.length > 0 && totalPages > 1 && (
          <ClassroomStudentsStyles.Pagination>
            <ClassroomStudentsStyles.PageButton
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                  fill="currentColor"
                />
              </svg>
            </ClassroomStudentsStyles.PageButton>

            {[...Array(totalPages)].map((_, index) => (
              <ClassroomStudentsStyles.PageButton
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </ClassroomStudentsStyles.PageButton>
            ))}

            <ClassroomStudentsStyles.PageButton
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                  fill="currentColor"
                />
              </svg>
            </ClassroomStudentsStyles.PageButton>
          </ClassroomStudentsStyles.Pagination>
        )}

        {/* 학생 추가/일괄업로드 모달 */}
        {isModalOpen && (
          <ClassroomStudentsStyles.ModalOverlay>
            <ClassroomStudentsStyles.Modal>
              <ClassroomStudentsStyles.ModalHeader>
                <h3>{isBatchMode ? "학생 일괄 등록" : "학생 추가"}</h3>
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

              {isBatchMode ? (
                /* 일괄 업로드 모드 */
                <BatchUpload
                  onUpload={handleBatchUpload}
                  onCancel={handleCloseModal}
                />
              ) : (
                /* 개별 추가 모드 */
                <>
                  <ClassroomStudentsStyles.ModalContent>
                    <ClassroomStudentsStyles.FormGroup>
                      <label htmlFor="studentNumber">번호 *</label>
                      <input
                        type="text"
                        id="studentNumber"
                        name="studentNumber"
                        value={newStudent.studentNumber}
                        onChange={handleInputChange}
                        placeholder="번호를 입력하세요"
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
                    <ClassroomStudentsStyles.SaveButton
                      onClick={handleAddStudent}
                    >
                      저장
                    </ClassroomStudentsStyles.SaveButton>
                  </ClassroomStudentsStyles.ModalFooter>
                </>
              )}
            </ClassroomStudentsStyles.Modal>
          </ClassroomStudentsStyles.ModalOverlay>
        )}
      </ContentContainer>
    </DashboardLayout>
  );
};

export default ClassroomStudents;
