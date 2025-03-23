import React, { useState } from "react";
import styled from "@emotion/styled";
import { Select, Table, Input, Button, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import {
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// 임시 교사 데이터
const teacherData = {
  name: "권도훈",
  role: "교사",
  subject: "수학",
};

// 임시 학생 목록
const students = [
  { id: 1, name: "김민준", grade: 2, classNum: 3, number: 12 },
  { id: 2, name: "이서연", grade: 2, classNum: 3, number: 15 },
  { id: 3, name: "박지훈", grade: 2, classNum: 3, number: 8 },
  { id: 4, name: "최은지", grade: 2, classNum: 3, number: 21 },
  { id: 5, name: "정우진", grade: 2, classNum: 3, number: 5 },
];

// 학기 옵션
const semesterOptions = [
  { value: "1-1", label: "1학년 1학기" },
  { value: "1-2", label: "1학년 2학기" },
  { value: "2-1", label: "2학년 1학기" },
  { value: "2-2", label: "2학년 2학기" },
  { value: "3-1", label: "3학년 1학기" },
  { value: "3-2", label: "3학년 2학기" },
];

// 과목 데이터
const subjects = [
  { id: 1, name: "국어", maxScore: 100 },
  { id: 2, name: "영어", maxScore: 100 },
  { id: 3, name: "수학", maxScore: 100 },
  { id: 4, name: "과학", maxScore: 100 },
  { id: 5, name: "사회", maxScore: 100 },
  { id: 6, name: "음악", maxScore: 50 },
  { id: 7, name: "미술", maxScore: 50 },
  { id: 8, name: "체육", maxScore: 50 },
];

// 임시 성적 데이터
const initialGradesData = {
  1: {
    // 학생 ID
    "2-1": {
      // 학기
      subjects: {
        1: { score: 85, grade: "B" }, // 국어
        2: { score: 92, grade: "A" }, // 영어
        3: { score: 78, grade: "C" }, // 수학
        4: { score: 88, grade: "B" }, // 과학
        5: { score: 95, grade: "A" }, // 사회
        6: { score: 45, grade: "A" }, // 음악
        7: { score: 42, grade: "B" }, // 미술
        8: { score: 48, grade: "A" }, // 체육
      },
      totalScore: 573,
      averageScore: 88.1,
      ranking: 3,
      classRanking: 2,
      attendance: {
        present: 92,
        absent: 2,
        late: 3,
        earlyLeave: 1,
      },
      comments:
        "수학과목에 어려움을 겪고 있으나, 영어와 사회 과목에서 우수한 성적을 보이고 있습니다.",
    },
  },
};

// 등급 계산 함수
const calculateGrade = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

// 스타일 컴포넌트
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledSelect = styled(Select)`
  min-width: 150px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GradeStatContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const GradeStatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

const ChartContainer = styled.div`
  height: 350px;
  margin-bottom: 2rem;
`;

const SubjectsTable = styled(Table)`
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(Button)`
  margin-right: 0.5rem;
`;

const CommentsContainer = styled.div`
  margin-top: 1.5rem;
`;

const CommentsLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const CommentsValue = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  min-height: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledTextArea = styled(Input.TextArea)`
  width: 100%;
  min-height: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const TeacherGradesPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState(
    semesterOptions[3].value
  ); // 기본값: 2학년 2학기
  const [gradesData, setGradesData] = useState(initialGradesData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [comments, setComments] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 학생 선택 핸들러
  const handleStudentChange = (value) => {
    setSelectedStudent(value);
    setIsEditing(false);

    // 선택된 학생의 특정 학기 성적이 없을 경우 빈 데이터 생성
    if (value && !gradesData[value]?.[selectedSemester]) {
      const newGradesData = { ...gradesData };

      if (!newGradesData[value]) {
        newGradesData[value] = {};
      }

      newGradesData[value][selectedSemester] = {
        subjects: subjects.reduce((acc, subject) => {
          acc[subject.id] = { score: 0, grade: "F" };
          return acc;
        }, {}),
        totalScore: 0,
        averageScore: 0,
        ranking: 0,
        classRanking: 0,
        attendance: {
          present: 0,
          absent: 0,
          late: 0,
          earlyLeave: 0,
        },
        comments: "",
      };

      setGradesData(newGradesData);
    }

    // 코멘트 업데이트
    if (value && gradesData[value]?.[selectedSemester]) {
      setComments(gradesData[value][selectedSemester].comments || "");
    } else {
      setComments("");
    }
  };

  // 학기 선택 핸들러
  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    setIsEditing(false);

    // 학생이 선택되어 있고, 해당 학기 데이터가 없는 경우
    if (selectedStudent && !gradesData[selectedStudent]?.[value]) {
      const newGradesData = { ...gradesData };

      if (!newGradesData[selectedStudent]) {
        newGradesData[selectedStudent] = {};
      }

      newGradesData[selectedStudent][value] = {
        subjects: subjects.reduce((acc, subject) => {
          acc[subject.id] = { score: 0, grade: "F" };
          return acc;
        }, {}),
        totalScore: 0,
        averageScore: 0,
        ranking: 0,
        classRanking: 0,
        attendance: {
          present: 0,
          absent: 0,
          late: 0,
          earlyLeave: 0,
        },
        comments: "",
      };

      setGradesData(newGradesData);
    }

    // 코멘트 업데이트
    if (selectedStudent && gradesData[selectedStudent]?.[value]) {
      setComments(gradesData[selectedStudent][value].comments || "");
    } else {
      setComments("");
    }
  };

  // 편집 모드 진입
  const handleEditStart = () => {
    if (!selectedStudent) {
      message.warning("먼저 학생을 선택해주세요.");
      return;
    }

    setIsEditing(true);

    const currentData = gradesData[selectedStudent]?.[selectedSemester];
    if (currentData) {
      // 편집용 임시 데이터 생성
      setEditedData({
        subjects: { ...currentData.subjects },
        attendance: { ...currentData.attendance },
        comments: currentData.comments,
      });

      setComments(currentData.comments || "");
    }
  };

  // 성적 저장
  const handleSaveGrades = () => {
    if (!selectedStudent) return;

    // 총점, 평균, 등급 계산
    const subjectScores = Object.entries(editedData.subjects || {}).map(
      ([subjectId, data]) => {
        const subject = subjects.find((s) => s.id === parseInt(subjectId));
        const score = (data as { score: number }).score;

        return {
          subjectId: parseInt(subjectId),
          score,
          maxScore: subject ? subject.maxScore : 100,
          grade: calculateGrade(score, subject ? subject.maxScore : 100),
        };
      }
    );

    const totalScore = subjectScores.reduce(
      (sum, subject) => sum + subject.score,
      0
    );
    const totalMaxScore = subjectScores.reduce(
      (sum, subject) => sum + subject.maxScore,
      0
    );
    const averageScore = parseFloat(
      (totalScore / subjectScores.length).toFixed(1)
    );

    // 새로운 성적 데이터 업데이트
    const newGradesData = { ...gradesData };

    if (!newGradesData[selectedStudent]) {
      newGradesData[selectedStudent] = {};
    }

    if (!newGradesData[selectedStudent][selectedSemester]) {
      newGradesData[selectedStudent][selectedSemester] = {
        subjects: {},
        totalScore: 0,
        averageScore: 0,
        ranking: 0,
        classRanking: 0,
        attendance: {
          present: 0,
          absent: 0,
          late: 0,
          earlyLeave: 0,
        },
        comments: "",
      };
    }

    // 과목별 성적 업데이트
    subjectScores.forEach((subject) => {
      newGradesData[selectedStudent][selectedSemester].subjects[
        subject.subjectId
      ] = {
        score: subject.score,
        grade: subject.grade,
      };
    });

    // 출결 및 코멘트 업데이트
    newGradesData[selectedStudent][selectedSemester].attendance =
      editedData.attendance || {
        present: 0,
        absent: 0,
        late: 0,
        earlyLeave: 0,
      };

    newGradesData[selectedStudent][selectedSemester].comments = comments;

    // 총점/평균 업데이트
    newGradesData[selectedStudent][selectedSemester].totalScore = totalScore;
    newGradesData[selectedStudent][selectedSemester].averageScore =
      averageScore;

    // TODO: 순위 계산 로직 추가 (실제 구현 시 학생 전체의 성적을 비교해야 함)

    setGradesData(newGradesData);
    setIsEditing(false);
    message.success("성적이 저장되었습니다.");
  };

  // 성적 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({});

    // 코멘트 원래대로 복원
    if (selectedStudent && gradesData[selectedStudent]?.[selectedSemester]) {
      setComments(gradesData[selectedStudent][selectedSemester].comments || "");
    }
  };

  // 성적 수정 핸들러
  const handleScoreChange = (subjectId, value) => {
    const score = parseInt(value);
    if (isNaN(score)) return;

    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    // 최대 점수 제한
    const limitedScore = Math.min(Math.max(0, score), subject.maxScore);

    setEditedData({
      ...editedData,
      subjects: {
        ...(editedData.subjects || {}),
        [subjectId]: {
          ...((editedData.subjects || {})[subjectId] || {}),
          score: limitedScore,
          grade: calculateGrade(limitedScore, subject.maxScore),
        },
      },
    });
  };

  // 출결 수정 핸들러
  const handleAttendanceChange = (type, value) => {
    const attendance = parseInt(value);
    if (isNaN(attendance)) return;

    setEditedData({
      ...editedData,
      attendance: {
        ...(editedData.attendance || {}),
        [type]: Math.max(0, attendance),
      },
    });
  };

  // 코멘트 수정 핸들러
  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  // 학생 정보 삭제 모달 표시
  const showDeleteConfirm = () => {
    if (!selectedStudent) {
      message.warning("먼저 학생을 선택해주세요.");
      return;
    }

    setIsModalVisible(true);
  };

  // 학생 정보 삭제 처리
  const handleDelete = () => {
    if (!selectedStudent) return;

    const newGradesData = { ...gradesData };

    if (newGradesData[selectedStudent]) {
      if (
        selectedSemester &&
        newGradesData[selectedStudent][selectedSemester]
      ) {
        // 해당 학기 성적만 삭제
        delete newGradesData[selectedStudent][selectedSemester];

        // 해당 학생의 학기 성적이 모두 삭제되었으면 학생 정보도 삭제
        if (Object.keys(newGradesData[selectedStudent]).length === 0) {
          delete newGradesData[selectedStudent];
        }
      }
    }

    setGradesData(newGradesData);
    setIsModalVisible(false);
    setSelectedStudent(null);
    setComments("");
    message.success("성적 정보가 삭제되었습니다.");
  };

  // 성적 테이블 컬럼 설정
  const columns = [
    {
      title: "과목",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "점수",
      dataIndex: "score",
      key: "score",
      render: (text, record) => {
        if (isEditing) {
          const currentScore =
            ((editedData.subjects || {})[record.id] || {}).score || 0;
          return (
            <Input
              type="number"
              value={currentScore}
              onChange={(e) => handleScoreChange(record.id, e.target.value)}
              min={0}
              max={record.maxScore}
            />
          );
        }
        return text;
      },
    },
    {
      title: "최고점",
      dataIndex: "maxScore",
      key: "maxScore",
    },
    {
      title: "등급",
      dataIndex: "grade",
      key: "grade",
    },
  ];

  // 차트 데이터 생성
  const getChartData = () => {
    if (!selectedStudent || !gradesData[selectedStudent]?.[selectedSemester]) {
      return [];
    }

    const currentGrades = gradesData[selectedStudent][selectedSemester];

    return subjects.map((subject) => {
      const subjectData = currentGrades.subjects[subject.id] || { score: 0 };
      const percentage = (subjectData.score / subject.maxScore) * 100;

      return {
        subject: subject.name,
        score: subjectData.score,
        fullMark: subject.maxScore,
        percentage,
      };
    });
  };

  // 성적 테이블 데이터 생성
  const getTableData = () => {
    if (!selectedStudent || !gradesData[selectedStudent]?.[selectedSemester]) {
      return [];
    }

    const currentGrades = gradesData[selectedStudent][selectedSemester];

    return subjects.map((subject) => {
      const subjectData = currentGrades.subjects[subject.id] || {
        score: 0,
        grade: "F",
      };

      return {
        key: subject.id,
        id: subject.id,
        subject: subject.name,
        score: subjectData.score,
        maxScore: subject.maxScore,
        grade: subjectData.grade,
      };
    });
  };

  // 출결 데이터 가져오기
  const getAttendanceData = () => {
    if (!selectedStudent || !gradesData[selectedStudent]?.[selectedSemester]) {
      return { present: 0, absent: 0, late: 0, earlyLeave: 0 };
    }

    return gradesData[selectedStudent][selectedSemester].attendance;
  };

  // 현재 선택된 학생의 성적 데이터 가져오기
  const getCurrentData = () => {
    if (!selectedStudent || !gradesData[selectedStudent]?.[selectedSemester]) {
      return null;
    }

    return gradesData[selectedStudent][selectedSemester];
  };

  // 선택된 학생 이름 가져오기
  const getSelectedStudentName = () => {
    if (!selectedStudent) return "";
    const student = students.find((s) => s.id === selectedStudent);
    return student ? student.name : "";
  };

  const currentData = getCurrentData();
  const currentAttendance = getAttendanceData();
  const chartData = getChartData();
  const tableData = getTableData();

  return (
    <DashboardLayout
      userName={teacherData.name}
      userRole={teacherData.role}
      userInfo={teacherData.subject}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        <PageContainer>
          <h1>학생 성적 관리</h1>

          <ControlsContainer>
            <StyledSelect
              placeholder="학생 선택"
              value={selectedStudent}
              onChange={handleStudentChange}
              style={{ width: 200 }}
            >
              {students.map((student) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.name} ({student.grade}-{student.classNum}-
                  {student.number})
                </Select.Option>
              ))}
            </StyledSelect>

            <StyledSelect
              placeholder="학기 선택"
              value={selectedSemester}
              onChange={handleSemesterChange}
              style={{ width: 150 }}
            >
              {semesterOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </StyledSelect>

            {!isEditing ? (
              <>
                <ActionButton
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditStart}
                  disabled={!selectedStudent}
                >
                  편집
                </ActionButton>
                <ActionButton
                  danger
                  icon={<DeleteOutlined />}
                  onClick={showDeleteConfirm}
                  disabled={!selectedStudent}
                >
                  삭제
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveGrades}
                >
                  저장
                </ActionButton>
                <ActionButton onClick={handleCancelEdit}>취소</ActionButton>
              </>
            )}
          </ControlsContainer>

          {selectedStudent && currentData ? (
            <DashboardCard>
              <CardTitle>
                {getSelectedStudentName()} 학생 성적 -{" "}
                {
                  semesterOptions.find((s) => s.value === selectedSemester)
                    ?.label
                }
              </CardTitle>

              <GradeStatContainer>
                <GradeStatCard>
                  <StatLabel>총점</StatLabel>
                  <StatValue>{currentData.totalScore}</StatValue>
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>평균</StatLabel>
                  <StatValue>{currentData.averageScore}</StatValue>
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>전교 석차</StatLabel>
                  <StatValue>
                    {currentData.ranking === 0
                      ? "-"
                      : `${currentData.ranking}등`}
                  </StatValue>
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>반 석차</StatLabel>
                  <StatValue>
                    {currentData.classRanking === 0
                      ? "-"
                      : `${currentData.classRanking}등`}
                  </StatValue>
                </GradeStatCard>
              </GradeStatContainer>

              {/* 레이더 차트 */}
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={chartData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="성적"
                      dataKey="percentage"
                      stroke={colors.primary.main}
                      fill={colors.primary.main}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* 과목별 성적 테이블 */}
              <SubjectsTable
                columns={columns}
                dataSource={tableData}
                pagination={false}
                size="middle"
              />

              {/* 출결 현황 */}
              <CardTitle>출결 현황</CardTitle>
              <GradeStatContainer>
                <GradeStatCard>
                  <StatLabel>출석일수</StatLabel>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={
                        (editedData.attendance || {}).present ||
                        currentAttendance.present
                      }
                      onChange={(e) =>
                        handleAttendanceChange("present", e.target.value)
                      }
                      min={0}
                    />
                  ) : (
                    <StatValue>{currentAttendance.present}</StatValue>
                  )}
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>결석</StatLabel>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={
                        (editedData.attendance || {}).absent ||
                        currentAttendance.absent
                      }
                      onChange={(e) =>
                        handleAttendanceChange("absent", e.target.value)
                      }
                      min={0}
                    />
                  ) : (
                    <StatValue>{currentAttendance.absent}</StatValue>
                  )}
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>지각</StatLabel>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={
                        (editedData.attendance || {}).late ||
                        currentAttendance.late
                      }
                      onChange={(e) =>
                        handleAttendanceChange("late", e.target.value)
                      }
                      min={0}
                    />
                  ) : (
                    <StatValue>{currentAttendance.late}</StatValue>
                  )}
                </GradeStatCard>
                <GradeStatCard>
                  <StatLabel>조퇴</StatLabel>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={
                        (editedData.attendance || {}).earlyLeave ||
                        currentAttendance.earlyLeave
                      }
                      onChange={(e) =>
                        handleAttendanceChange("earlyLeave", e.target.value)
                      }
                      min={0}
                    />
                  ) : (
                    <StatValue>{currentAttendance.earlyLeave}</StatValue>
                  )}
                </GradeStatCard>
              </GradeStatContainer>

              {/* 코멘트 */}
              <CommentsContainer>
                <CommentsLabel>종합 의견</CommentsLabel>
                {isEditing ? (
                  <StyledTextArea
                    value={comments}
                    onChange={handleCommentsChange}
                    placeholder="학생에 대한 종합 의견을 입력하세요."
                    maxLength={500}
                    showCount
                  />
                ) : (
                  <CommentsValue>
                    {currentData.comments || "의견이 없습니다."}
                  </CommentsValue>
                )}
              </CommentsContainer>
            </DashboardCard>
          ) : (
            <DashboardCard>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <UserOutlined
                  style={{ fontSize: "24px", marginRight: "10px" }}
                />
                <span>학생을 선택하여 성적 정보를 확인하세요.</span>
              </div>
            </DashboardCard>
          )}
        </PageContainer>
      </ContentContainer>

      {/* 삭제 확인 모달 */}
      <Modal
        title="성적 정보 삭제"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="삭제"
        cancelText="취소"
      >
        <p>
          {getSelectedStudentName()} 학생의{" "}
          {semesterOptions.find((s) => s.value === selectedSemester)?.label}{" "}
          성적 정보를 삭제하시겠습니까?
        </p>
        <p>이 작업은 취소할 수 없습니다.</p>
      </Modal>
    </DashboardLayout>
  );
};

export default TeacherGradesPage;
