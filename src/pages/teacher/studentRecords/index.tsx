import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { ContentContainer } from "../../../components/dashboard/DashboardComponents.styles";
import { useUserStore } from "../../../stores/userStore";
import styled from "styled-components";
import { colors } from "../../../components/common/Common.styles";
import {
  getStudentList,
  getStudentDetail,
  updateStudentInfo,
  UpdateStudentInfoRequest,
} from "../../../apis/student";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tabs,
  message,
  Space,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

// antd 최신 버전에서는 items 속성을 사용하도록 권장합니다

// 학생 정보 인터페이스
interface Student {
  studentId: number;
  name: string;
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

// 출결 기록 인터페이스
interface AttendanceRecord {
  date: string;
  type: "absent" | "late" | "earlyLeave" | "sickLeave";
  reason: string;
}

// 출결 등록 요청 인터페이스
interface AttendanceRegisterRequest {
  type: string;  // 출결 유형 (지각, 결석, 조퇴, 병결)
  date: string;  // 날짜 (yyyy-mm-ddThh:mm:ss)
  title: string;  // 사유명
  reason: string; // 사유
}

// 출결 등록 응답 인터페이스
interface AttendanceRegisterResponse {
  code: number;
  message: string;
  data: {
    id?: number;
    success?: boolean;
  };
}

// 행동 발달 기록 인터페이스
interface BehavioralRecord {
  date: string;
  category: string;
  description: string;
  teacher: string;
}

// 특기 사항 인터페이스
interface SpecialNote {
  date: string;
  category: string;
  description: string;
  teacher: string;
}

// 활동 내역 인터페이스
interface ActivityRecord {
  date: string;
  category: string;
  title: string;
  description: string;
  teacher: string;
}

// 학생 학생부 전체 데이터 인터페이스
interface StudentRecord {
  basicInfo: StudentDetail;
  attendance: {
    year: string;
    semester: string;
    attendanceDays: number;
    absenceDays: number;
    lateDays: number;
    earlyLeaveDays: number;
    sickLeaveDays: number;
    details: AttendanceRecord[];
  };
  behavioral: BehavioralRecord[];
  specialNotes: SpecialNote[];
  activities: ActivityRecord[];
}

// 더미 학생부 데이터 (실제로는 API에서 가져와야 함)
const studentRecordsData: Record<number, StudentRecord> = {
  1: {
    basicInfo: {
      name: "권도훈",
      birthDate: "2009-07-22",
      gender: "MALE",
      address: "서울시 강남구 역삼로 123",
      contact: "010-1234-5678",
      entranceDate: "2023-03-02",
      grade: 2,
      classNum: 3,
      studentNum: 12,
    },
    attendance: {
      year: "2024",
      semester: "1학기",
      attendanceDays: 97,
      absenceDays: 0,
      lateDays: 2,
      earlyLeaveDays: 1,
      sickLeaveDays: 0,
      details: [
        { date: "2024-04-05", type: "late", reason: "교통 지연" },
        { date: "2024-05-12", type: "late", reason: "늦잠" },
        { date: "2024-05-20", type: "earlyLeave", reason: "병원 방문" },
      ],
    },
    behavioral: [
      {
        date: "2024-04-15",
        category: "리더십",
        description:
          "그룹 프로젝트에서 리더십을 발휘하여 팀원들을 잘 이끌었습니다.",
        teacher: "박지성",
      },
      {
        date: "2024-05-10",
        category: "창의적 사고",
        description:
          "문제 해결 능력이 뛰어나며 창의적인 아이디어를 많이 제시합니다.",
        teacher: "김승환",
      },
    ],
    specialNotes: [
      {
        date: "2024-03-15",
        category: "진로 희망",
        description: "소프트웨어 개발자(인공지능 분야)",
        teacher: "김승환",
      },
      {
        date: "2024-04-20",
        category: "교과 특기",
        description:
          "수학과 과학 분야에 특별한 재능을 보임. 특히 알고리즘 문제 해결 능력이 뛰어남.",
        teacher: "박지성",
      },
    ],
    activities: [
      {
        date: "2024-03-15",
        category: "동아리",
        title: "소프트웨어 동아리 'Code Masters'",
        description:
          "학교 소프트웨어 개발 동아리에서 웹 개발 팀장으로 활동 중.",
        teacher: "박지성",
      },
      {
        date: "2024-05-17",
        category: "대회",
        title: "전국 고교 프로그래밍 경진대회",
        description:
          "알고리즘 문제 해결 및 창의적 소프트웨어 설계 경진대회 참가",
        teacher: "김승환",
      },
    ],
  },
};

const StudentRecordsPage: React.FC = () => {
  // Zustand 스토어에서 사용자 정보 가져오기
  const userInfo = useUserStore((state) => state.userInfo);
  const isLoading = useUserStore((state) => state.isLoading);

  // 학생 목록 상태 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetail, setStudentDetail] = useState<StudentDetail | null>(
    null
  );
  const [studentRecord, setStudentRecord] = useState<StudentRecord | null>(
    null
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState("1");

  // 출결 등록 관련 상태
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceForm] = Form.useForm();
  const [isAttendanceSubmitting, setIsAttendanceSubmitting] = useState(false);

  // 학생 정보 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API에서 학생 목록 가져오기
  const fetchStudents = async () => {
    setIsApiLoading(true);
    setError(null);
    try {
      const response = await getStudentList();

      if (response.code === 20000) {
        console.log("학생 목록 조회 성공:", response.data);
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } else {
        setError(`데이터를 불러오는데 실패했습니다: ${response.message}`);
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

  // 출결 현황 데이터 조회 API
  const fetchAttendance = async (studentId: number) => {
    try {
      console.log(`학생 ID ${studentId}의 출결 현황 조회 시작...`);

      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/attendance/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("출결 현황 응답:", response.data);

      if (response.data.code === 20000) {
        return response.data.data;
      } else {
        console.error(
          `출결 정보를 불러오는데 실패했습니다: ${response.data.message}`
        );
        return null;
      }
    } catch (err) {
      console.error("출결 정보 조회 실패:", err);
      return null;
    }
  };
  
  // 출결 등록 API
  const registerAttendance = async (studentId: number, attendanceData: AttendanceRegisterRequest): Promise<boolean> => {
    try {
      console.log(`학생 ID ${studentId}의 출결 등록 시작...`);
      console.log("등록할 출결 데이터:", attendanceData);

      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await axios.post<AttendanceRegisterResponse>(
        `${BASE_URL}/student/attendance/${studentId}`,
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("출결 등록 응답:", response.data);

      if (response.data.code === 20000) {
        message.success("출결 정보가 성공적으로 등록되었습니다.");
        return true;
      } else {
        message.error(`출결 등록 실패: ${response.data.message}`);
        return false;
      }
    } catch (err) {
      console.error("출결 등록 실패:", err);
      message.error("출결 등록중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return false;
    }
  };
  
  // 출결 삭제 API
  const deleteAttendance = async (studentId: number, date: string): Promise<boolean> => {
    try {
      console.log(`학생 ID ${studentId}의 출결 삭제 시작... 날짜: ${date}`);

      // 날짜 형식 처리: YYYY-MM-DD 형식으로 변환
      // 만약 date가 다른 형식이라면 적절히 처리
      const formattedDate = date.split('T')[0]; // 시간 부분 제거
      console.log(`포맷팅된 날짜: ${formattedDate}`);
      
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      // 날짜를 path variable로 전달
      const response = await axios.delete(
        `${BASE_URL}/student/attendance/${studentId}/${encodeURIComponent(formattedDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("출결 삭제 응답:", response.data);

      if (response.data.code === 20000) {
        message.success("출결 정보가 성공적으로 삭제되었습니다.");
        return true;
      } else {
        message.error(`출결 삭제 실패: ${response.data.message}`);
        return false;
      }
    } catch (err) {
      console.error("출결 삭제 실패:", err);
      message.error("출결 삭제중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return false;
    }
  };

  // 학생 상세 정보 조회
  const fetchStudentDetail = async (studentId: number) => {
    setIsDetailLoading(true);
    console.log(`학생 ID ${studentId}의 상세 정보 조회 시작...`);
    try {
      // 1. 기본 정보 받아오기
      const response = await getStudentDetail(studentId);
      console.log("학생 상세 정보 응답:", response);

      if (response.code === 20000) {
        // API 응답에서는 이미 studentNum 필드를 사용하고 있음
        setStudentDetail(response.data);

        // 2. 출결 정보 API 호출
        const attendanceData = await fetchAttendance(studentId);

        // 기본 학생부 레코드 생성
        const newRecord: StudentRecord = {
          basicInfo: response.data,
          attendance: {
            year: new Date().getFullYear().toString(),
            semester: "1학기",
            attendanceDays: 0,
            absenceDays: 0,
            lateDays: 0,
            earlyLeaveDays: 0,
            sickLeaveDays: 0,
            details: [],
          },
          behavioral: studentRecordsData[1]?.behavioral || [], // 행동발달은 기존 더미 데이터 유지
          specialNotes: studentRecordsData[1]?.specialNotes || [], // 특기사항은 기존 더미 데이터 유지
          activities: studentRecordsData[1]?.activities || [], // 활동내역은 기존 더미 데이터 유지
        };

        // 출결 정보가 있으면 매핑
        if (attendanceData) {
          newRecord.attendance = {
            year: new Date().getFullYear().toString(),
            semester: "1학기",
            attendanceDays:
              attendanceData.totalDays -
              (attendanceData.absentCount +
                attendanceData.lateCount +
                attendanceData.leaveCount +
                attendanceData.sickCount),
            absenceDays: attendanceData.absentCount,
            lateDays: attendanceData.lateCount,
            earlyLeaveDays: attendanceData.leaveCount,
            sickLeaveDays: attendanceData.sickCount,
            details: attendanceData.details.map((detail) => {
              // API 응답의 type을 UI에 맞게 변환
              let type: "absent" | "late" | "earlyLeave" | "sickLeave" =
                "absent";

              if (detail.type === "결석") type = "absent";
              else if (detail.type === "지각") type = "late";
              else if (detail.type === "조퇴") type = "earlyLeave";
              else if (detail.type === "병결") type = "sickLeave";

              return {
                date: detail.date,
                type,
                reason: detail.reason,
              };
            }),
          };
        }

        setStudentRecord(newRecord);
      } else {
        alert(`학생 정보를 불러오는데 실패했습니다: ${response.message}`);
        setStudentDetail(null);
        setStudentRecord(null);
      }
    } catch (err) {
      console.error("학생 상세 정보 조회 실패:", err);
      alert("학생 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setStudentDetail(null);
      setStudentRecord(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  // 출결 등록 모달 열기
  const showAttendanceModal = () => {
    attendanceForm.resetFields();
    // 현재 날짜 기본값 설정 - DatePicker에는 dayjs 객체를 직접 전달
    attendanceForm.setFieldsValue({
      date: undefined, // 날짜는 DatePicker에서 직접 선택하도록 초기값 미설정
      defaultDate: dayjs() // DatePicker에 전달할 기본 날짜 (dayjs 객체)
    });
    setIsAttendanceModalOpen(true);
  };

  // 출결 등록 모달 닫기
  const handleAttendanceCancel = () => {
    setIsAttendanceModalOpen(false);
  };

  // 출결 등록 제출 처리
  const handleAttendanceSubmit = async () => {
    try {
      setIsAttendanceSubmitting(true);
      const values = await attendanceForm.validateFields();

      if (!selectedStudent) {
        message.error("학생을 선택해주세요.");
        return;
      }

      // API 요청 데이터 형식에 맞게 변환
      const date = values.date || dayjs(values.defaultDate).format("YYYY-MM-DDTHH:mm:ss");
      
      const attendanceData: AttendanceRegisterRequest = {
        type: values.type,
        date: date,
        title: values.title,
        reason: values.reason,
      };

      // 출결 등록 API 호출
      const success = await registerAttendance(selectedStudent.studentId, attendanceData);

      if (success) {
        setIsAttendanceModalOpen(false);
        // 출결 데이터 새로 가져오기
        if (selectedStudent) {
          fetchStudentDetail(selectedStudent.studentId);
        }
      }
    } catch (error) {
      console.error("출결 등록 양식 유효성 검사 오류:", error);
    } finally {
      setIsAttendanceSubmitting(false);
    }
  };
  
  // 출결 삭제 처리
  const handleAttendanceDelete = async (date: string) => {
    if (!selectedStudent) {
      message.error("학생을 선택해주세요.");
      return;
    }
    
    try {
      // 출결 삭제 API 호출
      const success = await deleteAttendance(selectedStudent.studentId, date);
      
      if (success) {
        // 출결 데이터 새로 가져오기
        fetchStudentDetail(selectedStudent.studentId);
      }
    } catch (error) {
      console.error("출결 삭제 처리 오류:", error);
    }
  };

  // 컴포넌트 마운트 시 학생 목록 가져오기
  useEffect(() => {
    fetchStudents();
  }, []);

  // 검색 쿼리 변경 시 필터링 적용
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.studentId.toString().includes(query)
    );

    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // 학생 선택 시 상세 정보 불러오기
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentDetail(student.studentId);
    // 학생 변경 시 항상 기본 정보 탭으로 초기화
    setActiveTab("1");
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

  // 출결 현황 렌더링
  const renderAttendance = () => {
    if (!studentRecord) return null;

    const attendance = studentRecord.attendance;

    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3>출결 현황</h3>
          <Button
            type="primary"
            onClick={showAttendanceModal}
            icon={<PlusOutlined />}
          >
            출결 등록
          </Button>
        </div>

        <AttendanceSummary>
          <AttendanceCard>
            <AttendanceValue>{attendance.attendanceDays}</AttendanceValue>
            <AttendanceLabel>출석일수</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.absenceDays}</AttendanceValue>
            <AttendanceLabel>결석</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.lateDays}</AttendanceValue>
            <AttendanceLabel>지각</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.earlyLeaveDays}</AttendanceValue>
            <AttendanceLabel>조퇴</AttendanceLabel>
          </AttendanceCard>
          <AttendanceCard>
            <AttendanceValue>{attendance.sickLeaveDays}</AttendanceValue>
            <AttendanceLabel>병결</AttendanceLabel>
          </AttendanceCard>
        </AttendanceSummary>

        <RecordsList>
          {attendance.details.map((record, index) => (
            <RecordItem key={index}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>{record.date}</div>
                <div>
                  <Popconfirm
                    title="출결 삭제"
                    description="정말 이 출결 기록을 삭제하시겠습니까?"
                    onConfirm={() => handleAttendanceDelete(record.date)}
                    okText="예"
                    cancelText="아니오"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>
                </div>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <StatusBadge
                  color={
                    record.type === "absent"
                      ? "error"
                      : record.type === "late"
                      ? "warning"
                      : record.type === "sickLeave"
                      ? "default"
                      : "processing"
                  }
                >
                  {record.type === "absent"
                    ? "결석"
                    : record.type === "late"
                    ? "지각"
                    : record.type === "earlyLeave"
                    ? "조퇴"
                    : record.type === "sickLeave"
                    ? "병결"
                    : "기타"}
                </StatusBadge>
                <span style={{ marginLeft: "0.5rem" }}>{record.reason}</span>
              </div>
            </RecordItem>
          ))}
        </RecordsList>

        {/* 출결 등록 모달 */}
        <Modal
          title="출결 등록"
          open={isAttendanceModalOpen}
          onCancel={handleAttendanceCancel}
          footer={[
            <Button key="cancel" onClick={handleAttendanceCancel}>
              취소
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isAttendanceSubmitting}
              onClick={handleAttendanceSubmit}
            >
              등록
            </Button>,
          ]}
        >
          <Form
            form={attendanceForm}
            layout="vertical"
            style={{ marginTop: "1rem" }}
          >
            <Form.Item
              name="type"
              label="출결 유형"
              rules={[{ required: true, message: "출결 유형을 선택해주세요" }]}
            >
              <Select placeholder="출결 유형 선택">
                <Select.Option value="지각">지각</Select.Option>
                <Select.Option value="결석">결석</Select.Option>
                <Select.Option value="조퇴">조퇴</Select.Option>
                <Select.Option value="병결">병결</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              noStyle
            >
              <Input type="hidden" />
            </Form.Item>
            
            <Form.Item
              name="defaultDate"
              label="날짜"
              rules={[{ required: true, message: "날짜를 입력해주세요" }]}
            >
              <DatePicker 
                style={{ width: "100%" }} 
                format="YYYY-MM-DD"
                defaultValue={dayjs()}
                onChange={(value) => {
                  if (value) {
                    // dayjs 객체를 사용하여 안전하게 변환
                    attendanceForm.setFieldsValue({ 
                      date: dayjs(value).format("YYYY-MM-DDTHH:mm:ss") 
                    });
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label="사유명"
              rules={[{ required: true, message: "사유명을 입력해주세요" }]}
            >
              <Input placeholder="예: 병원 방문, 가족 사정" />
            </Form.Item>

            <Form.Item
              name="reason"
              label="상세 사유"
              rules={[{ required: true, message: "상세 사유를 입력해주세요" }]}
            >
              <Input.TextArea
                placeholder="상세 사유를 입력해주세요"
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  // 행동 발달 기록 렌더링
  const renderBehavioral = () => {
    if (!studentRecord) return null;

    return (
      <RecordsList>
        {studentRecord.behavioral.map((record, index) => (
          <RecordItem key={index}>
            <div style={{ marginBottom: "0.5rem" }}>{record.date}</div>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              {record.category}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>{record.description}</div>
            <div style={{ textAlign: "right", fontStyle: "italic" }}>
              담당: {record.teacher} 교사
            </div>
          </RecordItem>
        ))}
      </RecordsList>
    );
  };

  // 특기 사항 렌더링
  const renderSpecialNotes = () => {
    if (!studentRecord) return null;

    return (
      <RecordsList>
        {studentRecord.specialNotes.map((record, index) => (
          <RecordItem key={index}>
            <div style={{ marginBottom: "0.5rem" }}>{record.date}</div>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              {record.category}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>{record.description}</div>
            <div style={{ textAlign: "right", fontStyle: "italic" }}>
              담당: {record.teacher} 교사
            </div>
          </RecordItem>
        ))}
      </RecordsList>
    );
  };

  // 활동 내역 렌더링
  const renderActivities = () => {
    if (!studentRecord) return null;

    return (
      <RecordsList>
        {studentRecord.activities.map((record, index) => (
          <RecordItem key={index}>
            <div style={{ marginBottom: "0.5rem" }}>
              {record.date} | {record.category}
            </div>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              {record.title}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>{record.description}</div>
            <div style={{ textAlign: "right", fontStyle: "italic" }}>
              담당: {record.teacher} 교사
            </div>
          </RecordItem>
        ))}
      </RecordsList>
    );
  };

  // 편집 모드 시작
  const startEditing = () => {
    if (!studentDetail) return;

    form.setFieldsValue({
      name: studentDetail.name,
      birthDate: dayjs(studentDetail.birthDate),
      gender: studentDetail.gender,
      address: studentDetail.address,
      contact: studentDetail.contact,
      entranceDate: dayjs(studentDetail.entranceDate),
      grade: studentDetail.grade,
      classNum: studentDetail.classNum,
      studentNum: studentDetail.studentNum,
    });

    setIsEditing(true);
  };

  // 편집 취소
  const cancelEditing = () => {
    setIsEditing(false);
    form.resetFields();
  };

  // 정보 저장 처리
  const handleSaveInfo = async () => {
    if (!selectedStudent) return;

    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // 날짜 형식 변환 및 필드명 변환 (studentNum -> number)
      const formattedValues: UpdateStudentInfoRequest = {
        ...values,
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : undefined,
        entranceDate: values.entranceDate
          ? values.entranceDate.format("YYYY-MM-DD")
          : undefined,
        // API는 number 필드를 사용하므로 변환
        number: values.studentNum,
      };

      // studentNum 필드는 API에 보내지 않음
      delete formattedValues.studentNum;

      // API 호출
      const response = await updateStudentInfo(
        selectedStudent.studentId,
        formattedValues
      );

      if (response.code === 20000) {
        message.success("학생 정보가 성공적으로 수정되었습니다.");
        // 학생 정보 다시 불러오기
        fetchStudentDetail(selectedStudent.studentId);
        setIsEditing(false);
      } else {
        message.error(`정보 수정 실패: ${response.message}`);
      }
    } catch (err) {
      message.error("입력 정보를 확인해주세요.");
      console.error("폼 제출 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 기본 정보 렌더링
  const renderBasicInfo = () => {
    if (!studentDetail) return null;

    if (isEditing) {
      return (
        <>
          <InfoHeader>
            <h3>학생 기본정보</h3>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveInfo}
                loading={isSubmitting}
              >
                저장
              </Button>
              <Button
                onClick={cancelEditing}
                disabled={isSubmitting}
              >
                취소
              </Button>
            </Space>
          </InfoHeader>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: studentDetail.name,
              birthDate: dayjs(studentDetail.birthDate),
              gender: studentDetail.gender,
              address: studentDetail.address,
              contact: studentDetail.contact,
              entranceDate: dayjs(studentDetail.entranceDate),
              grade: studentDetail.grade,
              classNum: studentDetail.classNum,
              studentNum: studentDetail.studentNum,
            }}
          >
            <InfoCardContainer>
              <InfoCard>
                <InfoCardHeader>
                  <InfoCardIcon>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill={colors.primary.main}
                      />
                    </svg>
                  </InfoCardIcon>
                  <h4>개인정보</h4>
                </InfoCardHeader>
                <Form.Item
                  name="name"
                  label="이름"
                  rules={[{ required: true, message: "이름을 입력하세요" }]}
                >
                  <Input placeholder="이름" />
                </Form.Item>
                <Form.Item
                  name="birthDate"
                  label="생년월일"
                  rules={[{ required: true, message: "생년월일을 선택하세요" }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    placeholder="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="성별"
                  rules={[{ required: true, message: "성별을 선택하세요" }]}
                >
                  <Select>
                    <Select.Option value="MALE">남성</Select.Option>
                    <Select.Option value="FEMALE">여성</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="contact"
                  label="연락처"
                  rules={[{ required: true, message: "연락처를 입력하세요" }]}
                >
                  <Input placeholder="010-XXXX-XXXX" />
                </Form.Item>
              </InfoCard>

              <InfoCard>
                <InfoCardHeader>
                  <InfoCardIcon>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                        fill={colors.primary.main}
                      />
                    </svg>
                  </InfoCardIcon>
                  <h4>학적정보</h4>
                </InfoCardHeader>
                <Form.Item
                  name="entranceDate"
                  label="입학일"
                  rules={[{ required: true, message: "입학일을 선택하세요" }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    placeholder="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item
                  name="grade"
                  label="학년"
                  rules={[{ required: true, message: "학년을 입력하세요" }]}
                >
                  <Input type="number" min={1} max={6} />
                </Form.Item>
                <Form.Item
                  name="classNum"
                  label="반"
                  rules={[{ required: true, message: "반을 입력하세요" }]}
                >
                  <Input type="number" min={1} max={20} />
                </Form.Item>
                <Form.Item
                  name="studentNum"
                  label="번호"
                  rules={[{ required: true, message: "번호를 입력하세요" }]}
                >
                  <Input type="number" min={1} max={50} />
                </Form.Item>
              </InfoCard>

              <InfoCard>
                <InfoCardHeader>
                  <InfoCardIcon>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                        fill={colors.primary.main}
                      />
                    </svg>
                  </InfoCardIcon>
                  <h4>추가정보</h4>
                </InfoCardHeader>
                <Form.Item
                  name="address"
                  label="주소"
                  rules={[{ required: true, message: "주소를 입력하세요" }]}
                >
                  <Input.TextArea rows={3} placeholder="주소" />
                </Form.Item>
              </InfoCard>
            </InfoCardContainer>
          </Form>
        </>
      );
    }

    return (
      <>
        <InfoHeader>
          <h3>학생 기본정보</h3>
          <Tooltip title="정보 수정">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={startEditing}
            />
          </Tooltip>
        </InfoHeader>

        <InfoCardContainer>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill={colors.primary.main}
                  />
                </svg>
              </InfoCardIcon>
              <h4>개인정보</h4>
            </InfoCardHeader>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{studentDetail.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>생년월일</InfoLabel>
              <InfoValue>{studentDetail.birthDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>성별</InfoLabel>
              <InfoValue>
                {studentDetail.gender === "MALE" ? "남성" : "여성"}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>연락처</InfoLabel>
              <InfoValue>{studentDetail.contact}</InfoValue>
            </InfoRow>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <InfoCardIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                    fill={colors.primary.main}
                  />
                </svg>
              </InfoCardIcon>
              <h4>학적정보</h4>
            </InfoCardHeader>
            <InfoRow>
              <InfoLabel>입학일</InfoLabel>
              <InfoValue>{studentDetail.entranceDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>학년</InfoLabel>
              <InfoValue>{studentDetail.grade}학년</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>반</InfoLabel>
              <InfoValue>{studentDetail.classNum}반</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>번호</InfoLabel>
              <InfoValue>{studentDetail.studentNum}번</InfoValue>
            </InfoRow>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <InfoCardIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    fill={colors.primary.main}
                  />
                </svg>
              </InfoCardIcon>
              <h4>추가정보</h4>
            </InfoCardHeader>
            <InfoRow>
              <InfoLabel>주소</InfoLabel>
              <InfoValue>{studentDetail.address}</InfoValue>
            </InfoRow>
          </InfoCard>
        </InfoCardContainer>
      </>
    );
  };

  return (
    <DashboardLayout
      userName={userInfo.name}
      userRole={userInfo.userType === "TEACHER" ? "교사" : "사용자"}
      userInfo={userInfo.roleInfo || "과목 정보 없음"}
      notificationCount={2}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        <PageTitle>학생부 관리</PageTitle>

        <ContentWrapper>
          {/* 왼쪽 영역 - 학생 목록 */}
          <StudentListContainer>
            <SearchBox>
              <SearchIcon viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="학생 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>

            <StudentList>
              {isApiLoading ? (
                <LoadingMessage>학생 목록을 불러오는 중...</LoadingMessage>
              ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
              ) : filteredStudents.length === 0 ? (
                <EmptyMessage>등록된 학생이 없습니다.</EmptyMessage>
              ) : (
                filteredStudents.map((student) => (
                  <StudentItem
                    key={student.studentId}
                    onClick={() => handleStudentSelect(student)}
                    $isSelected={
                      selectedStudent?.studentId === student.studentId
                    }
                  >
                    {student.name}
                  </StudentItem>
                ))
              )}
            </StudentList>
          </StudentListContainer>

          {/* 오른쪽 영역 - 학생 상세 정보 */}
          <StudentDetailContainer>
            {isDetailLoading ? (
              <LoadingMessage>학생 정보를 불러오는 중...</LoadingMessage>
            ) : !selectedStudent ? (
              <EmptyDetailMessage>
                좌측에서 학생을 선택하면 상세 정보가 표시됩니다.
              </EmptyDetailMessage>
            ) : !studentDetail ? (
              <ErrorMessage>학생 정보를 불러오는데 실패했습니다.</ErrorMessage>
            ) : (
              <>
                <DetailHeader>
                  <h2>{studentDetail.name} 학생 학생부</h2>
                </DetailHeader>

                <Tabs
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  style={{ width: "100%" }}
                  items={[
                    {
                      key: "1",
                      label: "기본 정보",
                      children: renderBasicInfo()
                    },
                    {
                      key: "2",
                      label: "출결 현황",
                      children: renderAttendance()
                    },
                    {
                      key: "3",
                      label: "행동 발달",
                      children: renderBehavioral()
                    },
                    {
                      key: "4",
                      label: "특기 사항",
                      children: renderSpecialNotes()
                    },
                    {
                      key: "5",
                      label: "활동 내역",
                      children: renderActivities()
                    }
                  ]}
                />
              </>
            )}
          </StudentDetailContainer>
        </ContentWrapper>
      </ContentContainer>
    </DashboardLayout>
  );
};

// 스타일 컴포넌트
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${colors.text.primary};
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100vh - 200px);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const StudentListContainer = styled.div`
  flex: 1;
  max-width: 300px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 16px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.grey[200]};
  background-color: ${colors.background.paper};
`;

const SearchIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: ${colors.text.secondary};
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  padding: 4px;
  color: ${colors.text.primary};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${colors.text.secondary};
  }
`;

const StudentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const StudentItem = styled.div<{ $isSelected: boolean }>`
  padding: 12px 16px;
  font-size: 15px;
  cursor: pointer;
  border-left: 3px solid
    ${(props) => (props.$isSelected ? colors.primary.main : "transparent")};
  background-color: ${(props) =>
    props.$isSelected ? colors.primary.light : "transparent"};
  color: ${(props) =>
    props.$isSelected ? colors.primary.dark : colors.text.primary};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$isSelected ? colors.primary.light : colors.grey[100]};
  }
`;

const StudentDetailContainer = styled.div`
  flex: 3;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
`;

const DetailHeader = styled.div`
  border-bottom: 1px solid ${colors.grey[200]};
  padding-bottom: 16px;
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0;
  }
`;

// 정보 카드 컨테이너
const InfoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 정보 카드
const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
`;

// 정보 카드 헤더
const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${colors.text.primary};
  }
`;

// 정보 카드 아이콘
const InfoCardIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 8px;
  background-color: ${colors.primary.light};
`;

// 정보 행 스타일
const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

// 정보 라벨
const InfoLabel = styled.div`
  font-size: 12px;
  color: ${colors.text.secondary};
  margin-bottom: 4px;
`;

// 정보 값
const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text.primary};
  padding: 4px 0;
`;

// 섹션 헤더
const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0;
  }
`;

const LoadingMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${colors.error.main};
  font-size: 14px;
`;

const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${colors.text.secondary};
  font-size: 14px;
`;

const EmptyDetailMessage = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: ${colors.text.secondary};
  font-size: 15px;
  text-align: center;
  padding: 24px;
`;

// 출결 현황 관련 스타일 컴포넌트
const AttendanceSummary = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const AttendanceCard = styled.div`
  flex: 1;
  min-width: 80px;
  background-color: ${colors.background.paper};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AttendanceValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.primary.main};
  margin-bottom: 4px;
`;

const AttendanceLabel = styled.div`
  font-size: 14px;
  color: ${colors.text.secondary};
`;

// 기록 목록 관련 스타일 컴포넌트
const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecordItem = styled.div`
  background-color: ${colors.background.paper};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatusBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${(props) =>
    props.color === "error"
      ? colors.error.light
      : props.color === "warning"
      ? colors.warning.light
      : props.color === "success"
      ? colors.success.light
      : colors.primary.light};
  color: ${(props) =>
    props.color === "error"
      ? colors.error.dark
      : props.color === "warning"
      ? colors.warning.dark
      : props.color === "success"
      ? colors.success.dark
      : colors.primary.dark};
`;

export default StudentRecordsPage;
