import React, { useState } from "react";
import styled from "@emotion/styled";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { colors } from "../../../components/common/Common.styles";
import { userData } from "../../../constants/dashboard/teacherDashboardData";

// 학생 기본 정보 타입
interface Student {
  id: number;
  name: string;
  grade: number;
  classNumber: number;
  studentNumber: number;
  birthdate: string;
  gender: "남" | "여";
  address: string;
  phone: string;
  parentPhone: string;
  photo?: string;
}

// 학생부 항목 타입
interface RecordCategory {
  id: number;
  name: string;
  isEditable: boolean;
}

// 학생부 기록 타입
interface StudentRecord {
  id: number;
  studentId: number;
  categoryId: number;
  date: string;
  content: string;
}

// 출결 정보 타입
interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: "출석" | "결석" | "지각" | "조퇴" | "병결";
  reason?: string;
}

// 더미 데이터
const students: Student[] = [
  {
    id: 1,
    name: "홍길동",
    grade: 2,
    classNumber: 3,
    studentNumber: 1,
    birthdate: "2009-05-15",
    gender: "남",
    address: "서울시 강남구 테헤란로 123",
    phone: "010-1234-5678",
    parentPhone: "010-9876-5432",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "김철수",
    grade: 2,
    classNumber: 3,
    studentNumber: 2,
    birthdate: "2009-07-22",
    gender: "남",
    address: "서울시 서초구 방배로 456",
    phone: "010-2345-6789",
    parentPhone: "010-8765-4321",
    photo: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    id: 3,
    name: "이영희",
    grade: 2,
    classNumber: 3,
    studentNumber: 3,
    birthdate: "2009-03-10",
    gender: "여",
    address: "서울시 송파구 올림픽로 789",
    phone: "010-3456-7890",
    parentPhone: "010-7654-3210",
    photo: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: 4,
    name: "박지민",
    grade: 2,
    classNumber: 3,
    studentNumber: 4,
    birthdate: "2009-11-05",
    gender: "여",
    address: "서울시 강동구 천호대로 101",
    phone: "010-4567-8901",
    parentPhone: "010-6543-2109",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    id: 5,
    name: "정민수",
    grade: 2,
    classNumber: 3,
    studentNumber: 5,
    birthdate: "2009-09-18",
    gender: "남",
    address: "서울시 마포구 홍대로 202",
    phone: "010-5678-9012",
    parentPhone: "010-5432-1098",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
  },
];

const recordCategories: RecordCategory[] = [
  { id: 1, name: "기본 정보", isEditable: false },
  { id: 2, name: "출결 상황", isEditable: true },
  { id: 3, name: "특기사항", isEditable: true },
  { id: 4, name: "봉사활동", isEditable: true },
  { id: 5, name: "진로 희망사항", isEditable: true },
  { id: 6, name: "행동발달", isEditable: true },
  { id: 7, name: "종합의견", isEditable: true },
];

const studentRecords: StudentRecord[] = [
  {
    id: 1,
    studentId: 1,
    categoryId: 3,
    date: "2025-03-15",
    content:
      "수학 과목에 특별한 재능을 보임. 교내 수학 경시대회에서 우수한 성적을 거둠.",
  },
  {
    id: 2,
    studentId: 1,
    categoryId: 5,
    date: "2025-03-10",
    content:
      "IT 분야에 관심이 많으며, 프로그래머를 희망함. 코딩 동아리에서 활발히 활동 중.",
  },
  {
    id: 3,
    studentId: 1,
    categoryId: 7,
    date: "2025-03-20",
    content:
      "성실하고 책임감이 강함. 학급 내에서 리더십을 발휘하며 급우들과 원만한 관계를 유지함.",
  },
  {
    id: 4,
    studentId: 2,
    categoryId: 3,
    date: "2025-03-12",
    content: "음악적 재능이 뛰어남. 교내 합창부에서 솔리스트로 활동 중.",
  },
  {
    id: 5,
    studentId: 2,
    categoryId: 6,
    date: "2025-03-18",
    content:
      "최근 수업 집중도가 떨어지는 모습을 보임. 개인 상담을 통해 원인 파악 필요.",
  },
];

const attendanceRecords: AttendanceRecord[] = [
  { id: 1, studentId: 1, date: "2025-03-01", status: "출석" },
  { id: 2, studentId: 1, date: "2025-03-02", status: "출석" },
  {
    id: 3,
    studentId: 1,
    date: "2025-03-03",
    status: "지각",
    reason: "교통 체증",
  },
  { id: 4, studentId: 1, date: "2025-03-04", status: "출석" },
  { id: 5, studentId: 1, date: "2025-03-05", status: "출석" },

  { id: 6, studentId: 2, date: "2025-03-01", status: "출석" },
  { id: 7, studentId: 2, date: "2025-03-02", status: "결석", reason: "병가" },
  { id: 8, studentId: 2, date: "2025-03-03", status: "결석", reason: "병가" },
  { id: 9, studentId: 2, date: "2025-03-04", status: "출석" },
  { id: 10, studentId: 2, date: "2025-03-05", status: "출석" },
];

// 스타일 컴포넌트
const PageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 2rem 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
`;

const Card = styled.div<{ gridColumn?: string }>`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  grid-column: ${({ gridColumn }) => gridColumn || "span 12"};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  min-width: 150px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: ${colors.primary.main};
  color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: ${colors.primary.dark};
  }
`;

const StudentInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StudentPhoto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PhotoFrame = styled.div`
  width: 150px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const InfoLabel = styled.div`
  font-weight: 500;
  color: ${colors.text.primary};
  width: 100px;
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  color: ${colors.text.secondary};
  flex: 1;
`;

const TabContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.grey[300]};
  margin-bottom: 1.5rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.grey[300]};
    border-radius: 4px;
  }
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  color: ${({ active }) =>
    active ? colors.primary.main : colors.text.secondary};
  border-bottom: ${({ active }) =>
    active ? `2px solid ${colors.primary.main}` : "none"};
  margin-bottom: -1px;
  white-space: nowrap;
`;

const RecordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${colors.grey[300]};
  resize: vertical;
  min-height: 100px;
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[200]};
  background-color: ${colors.grey[50]};
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const RecordDate = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`;

const RecordContent = styled.div`
  color: ${colors.text.primary};
  line-height: 1.5;
`;

const RecordActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: ${colors.grey[200]};
  color: ${colors.text.secondary};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: ${colors.grey[300]};
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: ${colors.error.light};
  color: ${colors.error.dark};

  &:hover {
    background-color: ${colors.error.main};
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid ${colors.grey[300]};
  color: ${colors.text.primary};
  font-weight: 600;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case "출석":
        return colors.success.light;
      case "결석":
        return colors.error.light;
      case "지각":
        return colors.warning.light;
      case "조퇴":
        return colors.info.light;
      case "병결":
        return colors.grey[200];
      default:
        return colors.grey[200];
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "출석":
        return colors.success.dark;
      case "결석":
        return colors.error.dark;
      case "지각":
        return colors.warning.dark;
      case "조퇴":
        return colors.info.dark;
      case "병결":
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  }};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.text.secondary};
  font-style: italic;
`;

const AddCategoryButton = styled(Button)`
  margin-left: auto;
`;

const AttendanceButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const AttendanceButton = styled(Button)<{ status: string }>`
  background-color: ${(props) => {
    switch (props.status) {
      case "출석":
        return colors.success.main;
      case "결석":
        return colors.error.main;
      case "지각":
        return colors.warning.main;
      case "조퇴":
        return colors.warning.light;
      case "병결":
        return colors.info.main;
      default:
        return colors.primary.main;
    }
  }};
  color: white;
  &:hover {
    background-color: ${(props) => {
      switch (props.status) {
        case "출석":
          return colors.success.dark;
        case "결석":
          return colors.error.dark;
        case "지각":
          return colors.warning.dark;
        case "조퇴":
          return colors.warning.dark;
        case "병결":
          return colors.info.dark;
        default:
          return colors.primary.dark;
      }
    }};
  }
`;

const StudentRecordsPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number>(
    students[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState<number>(
    recordCategories[0].id
  );
  const [newRecordContent, setNewRecordContent] = useState<string>("");
  const [studentRecordsData, setStudentRecordsData] = useState<StudentRecord[]>(
    [...studentRecords]
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    ...attendanceRecords,
  ]);

  // 선택된 학생
  const student = students.find((s) => s.id === selectedStudent);

  // 선택된 카테고리
  const category = recordCategories.find((c) => c.id === selectedCategory);

  // 학생별, 카테고리별 기록 필터링
  const filteredRecords = studentRecordsData
    .filter(
      (record) =>
        record.studentId === selectedStudent &&
        record.categoryId === selectedCategory
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 학생별 출결 기록 필터링
  const filteredAttendance = attendanceData
    .filter((record) => record.studentId === selectedStudent)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 새 기록 추가 핸들러
  const handleAddRecord = () => {
    if (!newRecordContent.trim()) return;

    const newRecord: StudentRecord = {
      id: Math.max(...studentRecordsData.map((r) => r.id), 0) + 1,
      studentId: selectedStudent,
      categoryId: selectedCategory,
      date: new Date().toISOString().split("T")[0],
      content: newRecordContent.trim(),
    };

    setStudentRecordsData([...studentRecordsData, newRecord]);
    setNewRecordContent("");
  };

  // 출결 기록 추가 핸들러
  const handleAddAttendance = (
    status: AttendanceRecord["status"],
    reason?: string
  ) => {
    const newAttendance: AttendanceRecord = {
      id: Math.max(...attendanceData.map((a) => a.id), 0) + 1,
      studentId: selectedStudent,
      date: new Date().toISOString().split("T")[0],
      status,
      reason,
    };

    setAttendanceData([...attendanceData, newAttendance]);
  };

  // 출결 기록 삭제 핸들러
  const handleDeleteAttendance = (id: number) => {
    setAttendanceData(attendanceData.filter((record) => record.id !== id));
  };

  // 기록 삭제 핸들러
  const handleDeleteRecord = (recordId: number) => {
    setStudentRecordsData(
      studentRecordsData.filter((record) => record.id !== recordId)
    );
  };

  // 기록 수정 핸들러
  const handleEditRecord = (recordId: number) => {
    const record = studentRecordsData.find((r) => r.id === recordId);
    if (record) {
      setNewRecordContent(record.content);
      handleDeleteRecord(recordId);
    }
  };

  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.subject} ${
        userData.isHomeroom
          ? `/ ${userData.homeroomGrade}학년 ${userData.homeroomClass}반 담임`
          : ""
      }`}
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />

      <PageContainer>
        <PageTitle>학생부 관리</PageTitle>

        <FilterContainer>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.grade}학년 {student.classNumber}반{" "}
                {student.studentNumber}번 {student.name}
              </option>
            ))}
          </Select>
        </FilterContainer>

        <ContentGrid>
          {student && (
            <Card gridColumn="span 12">
              <CardTitle>학생 기본 정보</CardTitle>
              <StudentInfoGrid>
                <StudentPhoto>
                  <PhotoFrame>
                    {student.photo ? (
                      <Photo src={student.photo} alt={student.name} />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: colors.grey[200],
                        }}
                      >
                        사진 없음
                      </div>
                    )}
                  </PhotoFrame>
                </StudentPhoto>

                <InfoList>
                  <InfoItem>
                    <InfoLabel>이름</InfoLabel>
                    <InfoValue>{student.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>학년/반/번호</InfoLabel>
                    <InfoValue>
                      {student.grade}학년 {student.classNumber}반{" "}
                      {student.studentNumber}번
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>생년월일</InfoLabel>
                    <InfoValue>{student.birthdate}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>성별</InfoLabel>
                    <InfoValue>{student.gender}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>주소</InfoLabel>
                    <InfoValue>{student.address}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>연락처</InfoLabel>
                    <InfoValue>{student.phone}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>보호자 연락처</InfoLabel>
                    <InfoValue>{student.parentPhone}</InfoValue>
                  </InfoItem>
                </InfoList>
              </StudentInfoGrid>
            </Card>
          )}

          <Card gridColumn="span 12">
            <CardTitle>
              학생부 항목
              <AddCategoryButton>항목 추가</AddCategoryButton>
            </CardTitle>

            <TabContainer>
              <TabList>
                {recordCategories.map((category) => (
                  <Tab
                    key={category.id}
                    active={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Tab>
                ))}
              </TabList>

              {category && category.isEditable && (
                <RecordForm>
                  <TextArea
                    value={newRecordContent}
                    onChange={(e) => setNewRecordContent(e.target.value)}
                    placeholder={`${category.name}에 대한 내용을 입력하세요...`}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={handleAddRecord}>기록 추가</Button>
                  </div>
                </RecordForm>
              )}

              {selectedCategory === 2 ? (
                // 출결 상황 탭
                <>
                  {filteredAttendance.length > 0 ? (
                    <Table>
                      <thead>
                        <tr>
                          <Th>날짜</Th>
                          <Th>상태</Th>
                          <Th>사유</Th>
                          <Th>액션</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendance.map((record) => (
                          <tr key={record.id}>
                            <Td>{record.date}</Td>
                            <Td>
                              <StatusBadge status={record.status}>
                                {record.status}
                              </StatusBadge>
                            </Td>
                            <Td>{record.reason || "-"}</Td>
                            <Td>
                              <RecordActions>
                                <ActionButton>수정</ActionButton>
                                <DeleteButton
                                  onClick={() =>
                                    handleDeleteAttendance(record.id)
                                  }
                                >
                                  삭제
                                </DeleteButton>
                              </RecordActions>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <NoDataMessage>출결 기록이 없습니다.</NoDataMessage>
                  )}
                  <AttendanceButtonGroup>
                    <AttendanceButton
                      status="출석"
                      onClick={() => handleAddAttendance("출석")}
                    >
                      출석 추가
                    </AttendanceButton>
                    <AttendanceButton
                      status="결석"
                      onClick={() => handleAddAttendance("결석")}
                    >
                      결석 추가
                    </AttendanceButton>
                    <AttendanceButton
                      status="지각"
                      onClick={() => handleAddAttendance("지각")}
                    >
                      지각 추가
                    </AttendanceButton>
                    <AttendanceButton
                      status="조퇴"
                      onClick={() => handleAddAttendance("조퇴")}
                    >
                      조퇴 추가
                    </AttendanceButton>
                    <AttendanceButton
                      status="병결"
                      onClick={() => handleAddAttendance("병결")}
                    >
                      병결 추가
                    </AttendanceButton>
                  </AttendanceButtonGroup>
                </>
              ) : (
                // 다른 카테고리 탭
                <RecordList>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <RecordItem key={record.id}>
                        <RecordHeader>
                          <RecordDate>{record.date}</RecordDate>
                        </RecordHeader>
                        <RecordContent>{record.content}</RecordContent>
                        {category?.isEditable && (
                          <RecordActions>
                            <ActionButton
                              onClick={() => handleEditRecord(record.id)}
                            >
                              수정
                            </ActionButton>
                            <DeleteButton
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              삭제
                            </DeleteButton>
                          </RecordActions>
                        )}
                      </RecordItem>
                    ))
                  ) : (
                    <NoDataMessage>기록이 없습니다.</NoDataMessage>
                  )}
                </RecordList>
              )}
            </TabContainer>
          </Card>
        </ContentGrid>
      </PageContainer>
    </DashboardLayout>
  );
};

export default StudentRecordsPage;
