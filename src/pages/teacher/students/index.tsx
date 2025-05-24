import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import { useUserStore } from "../../../stores/userStore";
import * as ClassroomStudentsStyles from "./ClassroomStudents.styles";
import { colors } from "../../../components/common/Common.styles";
import BatchUpload from "./BatchUpload";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { getStudentDetail, enrollStudents } from "../../../apis/student";
import DaumPostcode from "react-daum-postcode";

// 다음 우편번호 API 응답 인터페이스
interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}
// API 응답 인터페이스
interface StudentListResponse {
  code: number;
  message: string;
  data: {
    grade: number;
    students: Student[];
  };
}

// 학생 정보 인터페이스
interface Student {
  studentId: number; // 내부 고유 ID
  name: string;
  status?: "active" | "inactive";
  studentNum?: number; // 학생 번호
}

// 학생 상세 정보 인터페이스
interface StudentDetail {
  name: string;
  birthDate: string;
  gender: string;
  address: string;
  contact: string;
  entranceDate: string;
  grade: number;
  classNum: number;
  studentNum: number;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [grade, setGrade] = useState<number | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [newStudent, setNewStudent] = useState({
    userName: "",
    grade: grade || 1,
    classNum: 1,
    number: 1,
    userType: "STUDENT" as const,
    age: 16,
    address: "",
    gender: "MALE" as "MALE" | "FEMALE",
    birthDate: "",
    contact: "",
    parentContact: "",
  });

  // 학급 정보 (학년 포함)
  const classInfo = grade
    ? `${grade}학년 ${userInfo?.roleInfo || ""}`
    : userInfo?.roleInfo || "학급 정보 없음";

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBatchMode(false);
    setCurrentStep(1);
    setNewStudent({
      userName: "",
      grade: grade || 1,
      classNum: 1,
      number: 1,
      userType: "STUDENT" as const,
      age: 16,
      address: "",
      gender: "MALE" as "MALE" | "FEMALE",
      birthDate: "",
      contact: "",
      parentContact: "",
    });
  };

  // 다음 우편번호 API 완료 이벤트 핸들러
  const handleComplete = (data: DaumPostcodeData) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setNewStudent({
      ...newStudent,
      address: fullAddress,
    });
    setIsAddressModalOpen(false);
  };

  // 다음 스텝으로 이동
  const handleNextStep = () => {
    // 기본 필수 필드 검증
    if (!newStudent.userName) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!newStudent.birthDate) {
      alert("생년월일을 입력해주세요.");
      return;
    }
    setCurrentStep(2);
  };

  // 이전 스텝으로 이동
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // 상세 정보 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setStudentDetail(null);
  };

  // 입력 값 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  // 학생 추가
  const handleAddStudent = async () => {
    if (!newStudent.userName) {
      alert("이름은 필수 입력 항목입니다.");
      return;
    }

    if (!newStudent.birthDate) {
      alert("생년월일은 필수 입력 항목입니다.");
      return;
    }

    try {
      setIsApiLoading(true);
      const response = await enrollStudents([newStudent]);

      if (response.code === 20000) {
        alert(`학생이 성공적으로 등록되었습니다.`);
        fetchStudents(); // 학생 목록 다시 불러오기
        handleCloseModal();
      } else {
        alert(`학생 등록 실패: ${response.message}`);
      }
    } catch (err) {
      console.error("학생 등록 오류:", err);
      alert("학생 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsApiLoading(false);
    }
  };

  // StudentData 인터페이스 (BatchUpload 컴포넌트와 호환)
  interface StudentData {
    studentNumber: string; // 번호
    name: string; // 이름
    grade?: string; // 학년 (교사 정보에서 자동 설정)
    classNum?: string; // 반 (교사 정보에서 자동 설정)
    gender: string; // 성별
    age: string; // 나이
    birthDate: string; // 생년월일
    address: string; // 주소
    contact: string; // 연락처
    parentContact: string; // 보호자 연락처
    note: string; // 특이사항
  }

  // 일괄 학생 추가
  const handleBatchUpload = async (batchStudents: StudentData[]) => {
    if (batchStudents.length === 0) return;

    // BatchUpload에서 받은 데이터를 API 형식에 맞게 변환
    const formattedStudents = batchStudents.map((student) => ({
      userName: student.name || "",
      grade: grade || 1, // 교사의 담당 학년으로 고정
      classNum: 1, // 교사의 담당 반으로 고정
      number: parseInt(student.studentNumber) || 1,
      userType: "STUDENT" as const,
      age: parseInt(student.age) || 16,
      address: student.address || "",
      gender:
        student.gender === "여" || student.gender === "FEMALE"
          ? "FEMALE"
          : ("MALE" as "MALE" | "FEMALE"),
      birthDate: student.birthDate || new Date().toISOString().split("T")[0],
      contact: student.contact || "",
      parentContact: student.parentContact || "",
    }));

    try {
      setIsApiLoading(true);
      const response = await enrollStudents(formattedStudents);

      if (response.code === 20000) {
        alert(`학생이 성공적으로 등록되었습니다.`);
        fetchStudents(); // 학생 목록 다시 불러오기
        handleCloseModal();
      } else {
        alert(`학생 일괄 등록 실패: ${response.message}`);
      }
    } catch (err) {
      console.error("학생 일괄 등록 오류:", err);
      alert("학생 일괄 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsApiLoading(false);
    }
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
        student.studentId.toString().includes(query)
    );

    setFilteredStudents(filtered);
  };

  // API에서 학생 목록 가져오기
  const fetchStudents = async () => {
    setIsApiLoading(true);
    setError(null);
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://www.software-design-king.p-e.kr";
      const response = await axios.get<StudentListResponse>(
        `${apiBaseUrl}/student/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 20000) {
        console.log("학생 목록 조회 성공:", response.data);
        setGrade(response.data.data.grade);
        setStudents(response.data.data.students);
        setFilteredStudents(response.data.data.students);
      } else {
        setError(`데이터를 불러오는데 실패했습니다: ${response.data.message}`);
      }
    } catch (err) {
      console.error("학생 목록을 불러오는데 실패했습니다:", err);
      setError(
        "학생 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
      );
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

  // 학생 상세 정보 조회
  const handleViewStudentDetail = async (studentId: number) => {
    setIsDetailLoading(true);
    console.log(`학생 ID ${studentId}의 상세 정보 조회 시작...`);
    try {
      const response = await getStudentDetail(studentId);
      console.log("학생 상세 정보 응답:", response);
      console.log("학생 데이터:", response.data);

      if (response.code === 20000) {
        setStudentDetail(response.data);
        setIsDetailModalOpen(true);
      } else {
        alert(`학생 정보를 불러오는데 실패했습니다: ${response.message}`);
      }
    } catch (err) {
      console.error("학생 상세 정보 조회 실패:", err);
      alert("학생 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsDetailLoading(false);
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
                      <ClassroomStudentsStyles.TableHeader width="100px">
                        번호
                      </ClassroomStudentsStyles.TableHeader>
                      <ClassroomStudentsStyles.TableHeader>
                        이름
                      </ClassroomStudentsStyles.TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.length === 0 ? (
                      <tr>
                        <ClassroomStudentsStyles.TableCell
                          colSpan={2}
                          style={{ textAlign: "center" }}
                        >
                          학생 정보가 없습니다.
                        </ClassroomStudentsStyles.TableCell>
                      </tr>
                    ) : (
                      currentStudents.map((student) => (
                        <ClassroomStudentsStyles.TableRow
                          key={student.studentId}
                          onClick={() =>
                            handleViewStudentDetail(student.studentId)
                          }
                        >
                          <ClassroomStudentsStyles.StudentIdCell>
                            {student.studentNum || "-"}
                          </ClassroomStudentsStyles.StudentIdCell>
                          <ClassroomStudentsStyles.StudentNameCell>
                            {student.name}
                          </ClassroomStudentsStyles.StudentNameCell>
                        </ClassroomStudentsStyles.TableRow>
                      ))
                    )}
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
                  <ClassroomStudentsStyles.StudentCard
                    key={student.studentId}
                    onClick={() => handleViewStudentDetail(student.studentId)}
                  >
                    <ClassroomStudentsStyles.CardAvatar>
                      {student.name.charAt(0)}
                    </ClassroomStudentsStyles.CardAvatar>

                    <ClassroomStudentsStyles.CardHeader>
                      <ClassroomStudentsStyles.CardName>
                        {student.name}
                      </ClassroomStudentsStyles.CardName>
                      <ClassroomStudentsStyles.CardId>
                        번호: <span>{student.studentNum || "-"}</span>
                      </ClassroomStudentsStyles.CardId>
                    </ClassroomStudentsStyles.CardHeader>
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
              style={{ marginTop: "1rem" }}
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
                    {currentStep === 1 ? (
                      <>
                        <h3
                          style={{
                            marginBottom: "1.5rem",
                            color: colors.primary.main,
                          }}
                        >
                          학생 기본 정보
                        </h3>
                        <ClassroomStudentsStyles.FormGroup>
                          <label htmlFor="userName">이름 *</label>
                          <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={newStudent.userName}
                            onChange={handleInputChange}
                            placeholder="이름을 입력하세요"
                            required
                          />
                        </ClassroomStudentsStyles.FormGroup>

                        <div style={{ display: "flex", gap: "1rem" }}>
                          <ClassroomStudentsStyles.FormGroup
                            style={{ flex: 1 }}
                          >
                            <label htmlFor="grade">학년</label>
                            <input
                              type="number"
                              id="grade"
                              name="grade"
                              min="1"
                              max="6"
                              value={grade || 1}
                              readOnly
                              style={{ backgroundColor: "#f0f0f0" }}
                            />
                          </ClassroomStudentsStyles.FormGroup>

                          <ClassroomStudentsStyles.FormGroup
                            style={{ flex: 1 }}
                          >
                            <label htmlFor="classNum">반</label>
                            <input
                              type="number"
                              id="classNum"
                              name="classNum"
                              min="1"
                              value={1} // 교사의 담당 반 정보
                              readOnly
                              style={{ backgroundColor: "#f0f0f0" }}
                            />
                          </ClassroomStudentsStyles.FormGroup>

                          <ClassroomStudentsStyles.FormGroup
                            style={{ flex: 1 }}
                          >
                            <label htmlFor="number">번호</label>
                            <input
                              type="number"
                              id="number"
                              name="number"
                              min="1"
                              value={newStudent.number}
                              onChange={handleInputChange}
                              placeholder="번호"
                            />
                          </ClassroomStudentsStyles.FormGroup>
                        </div>

                        <ClassroomStudentsStyles.FormGroup>
                          <label htmlFor="birthDate">생년월일 *</label>
                          <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={newStudent.birthDate}
                            onChange={handleInputChange}
                            required
                          />
                        </ClassroomStudentsStyles.FormGroup>

                        <ClassroomStudentsStyles.FormGroup>
                          <label>성별</label>
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: `1px solid ${colors.primary.main}`,
                                backgroundColor:
                                  newStudent.gender === "MALE"
                                    ? colors.primary.main
                                    : "transparent",
                                color:
                                  newStudent.gender === "MALE"
                                    ? "white"
                                    : colors.primary.main,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={newStudent.gender === "MALE"}
                                onChange={(e) =>
                                  setNewStudent({
                                    ...newStudent,
                                    gender: e.target.value as "MALE" | "FEMALE",
                                  })
                                }
                                style={{
                                  marginRight: "0.5rem",
                                  opacity: 0,
                                  position: "absolute",
                                }}
                              />
                              남자
                            </label>
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: `1px solid ${colors.primary.main}`,
                                backgroundColor:
                                  newStudent.gender === "FEMALE"
                                    ? colors.primary.main
                                    : "transparent",
                                color:
                                  newStudent.gender === "FEMALE"
                                    ? "white"
                                    : colors.primary.main,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={newStudent.gender === "FEMALE"}
                                onChange={(e) =>
                                  setNewStudent({
                                    ...newStudent,
                                    gender: e.target.value as "MALE" | "FEMALE",
                                  })
                                }
                                style={{
                                  marginRight: "0.5rem",
                                  opacity: 0,
                                  position: "absolute",
                                }}
                              />
                              여자
                            </label>
                          </div>
                        </ClassroomStudentsStyles.FormGroup>

                        <ClassroomStudentsStyles.FormGroup>
                          <label htmlFor="age">나이</label>
                          <input
                            type="number"
                            id="age"
                            name="age"
                            min="7"
                            max="20"
                            value={newStudent.age}
                            onChange={handleInputChange}
                            placeholder="나이"
                          />
                        </ClassroomStudentsStyles.FormGroup>
                      </>
                    ) : (
                      <>
                        <h3
                          style={{
                            marginBottom: "1.5rem",
                            color: colors.primary.main,
                          }}
                        >
                          연락처 정보
                        </h3>
                        <ClassroomStudentsStyles.FormGroup>
                          <label htmlFor="address">주소</label>
                          <div style={{ display: "flex" }}>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={newStudent.address}
                              onChange={handleInputChange}
                              placeholder="주소를 입력하세요"
                              style={{ flex: 1 }}
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() => setIsAddressModalOpen(true)}
                              style={{
                                marginLeft: "8px",
                                padding: "0 16px",
                                backgroundColor: colors.primary.main,
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              주소 검색
                            </button>
                          </div>
                        </ClassroomStudentsStyles.FormGroup>

                        {isAddressModalOpen && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1100,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                width: "500px",
                                maxWidth: "90%",
                                position: "relative",
                              }}
                            >
                              <button
                                onClick={() => setIsAddressModalOpen(false)}
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  background: "none",
                                  border: "none",
                                  fontSize: "18px",
                                  cursor: "pointer",
                                  zIndex: 1,
                                }}
                              >
                                ✕
                              </button>
                              <DaumPostcode onComplete={handleComplete} />
                            </div>
                          </div>
                        )}

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
                          <label htmlFor="parentContact">보호자 연락처</label>
                          <input
                            type="text"
                            id="parentContact"
                            name="parentContact"
                            value={newStudent.parentContact}
                            onChange={handleInputChange}
                            placeholder="보호자 연락처를 입력하세요"
                          />
                        </ClassroomStudentsStyles.FormGroup>
                      </>
                    )}
                  </ClassroomStudentsStyles.ModalContent>

                  <ClassroomStudentsStyles.ModalFooter>
                    {currentStep === 1 ? (
                      <>
                        <ClassroomStudentsStyles.CancelButton
                          onClick={handleCloseModal}
                        >
                          취소
                        </ClassroomStudentsStyles.CancelButton>
                        <ClassroomStudentsStyles.SaveButton
                          onClick={handleNextStep}
                        >
                          다음
                        </ClassroomStudentsStyles.SaveButton>
                      </>
                    ) : (
                      <>
                        <ClassroomStudentsStyles.CancelButton
                          onClick={handlePrevStep}
                        >
                          이전
                        </ClassroomStudentsStyles.CancelButton>
                        <ClassroomStudentsStyles.SaveButton
                          onClick={handleAddStudent}
                        >
                          저장
                        </ClassroomStudentsStyles.SaveButton>
                      </>
                    )}
                  </ClassroomStudentsStyles.ModalFooter>
                </>
              )}
            </ClassroomStudentsStyles.Modal>
          </ClassroomStudentsStyles.ModalOverlay>
        )}

        {/* 학생 상세 정보 모달 */}
        <AnimatePresence>
          {isDetailModalOpen && studentDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "24px",
                  width: "100%",
                  maxWidth: "500px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}
              >
                <button
                  onClick={handleCloseDetailModal}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
                <h2
                  style={{ marginBottom: "20px", color: colors.primary.main }}
                >
                  학생 상세 정보
                </h2>
                {isDetailLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <p>정보를 불러오는 중입니다...</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "16px" }}>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>이름:</span>
                        <strong>{studentDetail.name}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>학년/반/번호:</span>
                        <strong>
                          {`${studentDetail.grade || "-"}학년 ${
                            studentDetail.classNum || "-"
                          }반 ${studentDetail.studentNum || "-"}번`}
                        </strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>생년월일:</span>
                        <strong>{studentDetail.birthDate}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>성별:</span>
                        <strong>{studentDetail.gender}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>주소:</span>
                        <strong>{studentDetail.address}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>연락처:</span>
                        <strong>{studentDetail.contact}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                      <ClassroomStudentsStyles.DetailItem>
                        <span>입학일:</span>
                        <strong>{studentDetail.entranceDate}</strong>
                      </ClassroomStudentsStyles.DetailItem>
                    </div>
                    <button
                      onClick={handleCloseDetailModal}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: colors.primary.main,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "10px",
                      }}
                    >
                      닫기
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default ClassroomStudents;
