import React, { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../../../stores/userStore";
import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import StudentSidebar from "../../../components/teacher/StudentSidebar";
import {
  getCounselRecords,
  CounselRecord as ServerCounselRecord,
  createCounselRecord,
  CreateCounselRequest,
} from "../../../apis/counsel";
import { message } from "antd";

// 타입 정의
interface ConsultationRecord {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  content: string;
  nextPlan: string;
  tags: string[];
  isSharedWithOtherTeachers: boolean;
  createdAt: string;
  updatedAt: string;
}

// 스타일 컴포넌트
const PageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 64px); /* 헤더 높이(64px)를 고려하여 전체 높이 설정 */
  display: flex;
  flex-direction: row;
`;

const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const FilterContainer = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

// StyledInput은 여전히 사용 중이므로 유지합니다

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  background-color: white;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  &::placeholder {
    color: ${colors.grey[400]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  min-height: 100px;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  background-color: white;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  &::placeholder {
    color: ${colors.grey[400]};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchButton = styled(Button)`
  background-color: ${colors.primary.main};
  color: white;
  width: 100%;

  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px ${colors.primary.main}40;
  }
`;

const TabsWrapper = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: none;
  width: 100%;
  max-width: 500px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.active ? colors.primary.main : "white")};
  color: ${(props) => (props.active ? "white" : colors.text.secondary)};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) =>
      props.active ? colors.primary.main : colors.grey[100]};
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) =>
      props.active ? colors.primary.light : "transparent"};
  }
`;

const PageHeader = styled.div`
  background-color: ${colors.primary.main};
  color: white;
  padding: 1.5rem 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: 1.5rem 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.primary.dark};
  margin: 0;
`;

const ConsultationForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const FormGroup = styled.div<{ flex?: number }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const TagInput = styled(StyledInput)`
  margin-bottom: 0.5rem;
`;

// 상담 태그 옵션
const COUNSEL_TAGS = ["ACADEMIC", "COMPANIONSHIP", "ETC"];

const Tag = styled.div`
  padding: 0.35rem 0.75rem;
  background-color: ${colors.grey[100]};
  border-radius: 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 500;
  color: ${colors.text.secondary};
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.grey[200]};
  }
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  padding: 0;

  &:hover {
    color: ${colors.error.main};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin: 0;
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${colors.text.primary};
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${colors.primary.main};
  color: white;

  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px ${colors.primary.main}40;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  border: 1px solid ${colors.primary.main};
  color: ${colors.primary.main};

  &:hover {
    background-color: ${colors.primary.light}20;
  }
`;

const ConsultationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConsultationCardTeacher = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const ConsultationHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${colors.primary.light}20;
  border-bottom: 1px solid ${colors.grey[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 768px) {
    width: 100%;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0;
  }

  p {
    font-size: 0.85rem;
    color: ${colors.text.secondary};
    margin: 0;
  }
`;

const ConsultationContent = styled.div`
  padding: 1.25rem 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    color: ${colors.text.secondary};
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
    margin-top: 0.5rem;
  }
`;

const HistoryTag = styled.span`
  padding: 0.25rem 0.6rem;
  background-color: ${colors.grey[100]};
  color: ${colors.text.secondary};
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const ConsultationFooter = styled.div`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.grey[50]};
  border-top: 1px solid ${colors.grey[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
`;

const SharingStatus = styled.div<{ shared: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${(props) =>
    props.shared ? colors.success.main : colors.text.secondary};

  &:before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.shared ? colors.success.main : colors.text.secondary};
    margin-right: 4px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.95rem;
    color: ${colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const ContentTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.primary.dark};
  margin: 0 0 0.5rem 0;
`;

const ContentText = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-line;
  margin: 0 0 0.75rem 0;
`;

const ConsultationDate = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${colors.primary.dark};
`;

// 임시 데이터
const MOCK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: "1",
    studentId: "1",
    teacherId: "t1",
    teacherName: "권도훈",
    date: "2023-05-15",
    content:
      "학업 성취도가 떨어지는 원인에 대해 상담함. 집에서 공부할 시간이 부족하다고 함. 방과후 학습 추천.",
    nextPlan: "방과후 학습 신청하고 2주 후 다시 상담 예정",
    tags: ["학업상담", "방과후학습"],
    isSharedWithOtherTeachers: true,
    createdAt: "2023-05-15T14:30:00",
    updatedAt: "2023-05-15T14:30:00",
  },
  {
    id: "2",
    studentId: "1",
    teacherId: "t2",
    teacherName: "이수진",
    date: "2023-05-30",
    content:
      "방과후 학습 참여 후 변화에 대해 상담. 공부 시간이 증가했으나 아직 성적 변화는 없음.",
    nextPlan: "성적 향상 전략에 대해 추가 상담 필요",
    tags: ["학업상담", "방과후학습", "성적향상"],
    isSharedWithOtherTeachers: true,
    createdAt: "2023-05-30T15:20:00",
    updatedAt: "2023-05-30T15:20:00",
  },
  {
    id: "3",
    studentId: "2",
    teacherId: "t1",
    teacherName: "권도훈",
    date: "2023-06-02",
    content:
      "진로에 대한 고민이 있어 상담 요청. 이공계와 인문계 사이에서 고민 중.",
    nextPlan: "진로검사 후 다시 상담하기로 함",
    tags: ["진로상담"],
    isSharedWithOtherTeachers: false,
    createdAt: "2023-06-02T13:10:00",
    updatedAt: "2023-06-02T13:10:00",
  },
];

// StudentSidebar 컴포넌트로 대체되었으므로 관련 스타일 컴포넌트 제거

// 컴포넌트
const TeacherConsultationPage: React.FC = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  // 상담 태그 옵션
  const COUNSEL_TAGS = ["ACADEMIC", "COMPANIONSHIP", "ETC"];

  // 선택된 학생 및 상담 관련 상태
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [tagInput, setTagInput] = useState<string>("");

  const [formData, setFormData] = useState<{
    studentId: string;
    content: string;
    nextPlan: string;
    tags: string[];
    isSharedWithOtherTeachers: boolean;
  }>({
    studentId: "",
    content: "",
    nextPlan: "",
    tags: [],
    isSharedWithOtherTeachers: false,
  });

  const [studentConsultations, setStudentConsultations] = useState<
    ConsultationRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [showAllRecords, setShowAllRecords] = useState<boolean>(false);

  // 상담 기록 로드 함수 - useCallback으로 감싸서 참조 안정성 확보
  const loadConsultations = useCallback(async () => {
    if (!selectedStudent) {
      setConsultations([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`상담 기록 로드 API 호출: 학생 ID=${selectedStudent}`);

      // 실제 API 호출로 데이터 가져오기
      const response = await getCounselRecords(selectedStudent);

      if (response && response.data && response.data.counsels) {
        // 서버 응답 데이터를 컴포넌트 상태에 맞게 변환
        const serverCounsels = response.data.counsels;

        // 서버 데이터 형식을 컴포넌트에서 사용하는 형식으로 변환
        const formattedCounsels: ConsultationRecord[] = serverCounsels.map(
          (counsel, index) => ({
            id: index.toString(), // 서버에서 id가 없으면 임의로 생성
            studentId: selectedStudent,
            teacherId: userInfo.userId?.toString() || "", // 현재 로그인한 교사 ID
            teacherName: userInfo.name || "교사",
            date: counsel.createdAt,
            content: counsel.context,
            nextPlan: counsel.plan,
            tags: counsel.tags,
            isSharedWithOtherTeachers: counsel.shared,
            createdAt: counsel.createdAt,
            updatedAt: counsel.createdAt, // 서버에 updatedAt이 없으면 createdAt 사용
          })
        );

        setConsultations(formattedCounsels);
      } else {
        // 응답은 성공했지만 데이터가 없는 경우
        setConsultations([]);
      }
    } catch (err) {
      console.error("상담 기록 로드 실패:", err);
      setError("상담 기록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedStudent, userInfo.userId, userInfo.name]);

  // 탭 전환 처리
  const handleTabChange = useCallback(
    (tab: "new" | "history") => {
      setActiveTab(tab);
      if (tab === "history" && selectedStudent) {
        // 상담 기록 탭으로 전환할 때 데이터 로드
        loadConsultations();
      } else if (tab === "new") {
        setShowForm(true);
      }
    },
    [selectedStudent, loadConsultations]
  );

  // 학생 선택 처리
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setActiveTab("new");
    setShowForm(true);
  };

  // 학생 선택 또는 탭 변경 시 상담 기록 로드
  useEffect(() => {
    if (selectedStudent && activeTab === "history") {
      loadConsultations();
    }
  }, [selectedStudent, activeTab, loadConsultations]);

  useEffect(() => {
    if (selectedStudent) {
      setFormData((prev) => ({
        ...prev,
        studentId: selectedStudent,
      }));

      // 선택된 학생의 상담 기록 조회
      const filteredConsultations = MOCK_CONSULTATIONS.filter(
        (consultation) => consultation.studentId === selectedStudent
      );
      setStudentConsultations(filteredConsultations);
    }
  }, [selectedStudent]);

  // 폼 입력 처리
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 태그 관련 상수 및 데이터
  const TAG_INFO = [
    {
      id: "ACADEMIC",
      label: "학업",
      description: "학업 관련 상담",
      color: "#4285F4", // 파란색 - 학업(교육) 관련
      bgColor: "#E8F0FE",
      iconEmoji: "📚", // 책 이모티콘
    },
    {
      id: "COMPANIONSHIP",
      label: "교우 관계",
      description: "친구 관계 및 학교 생활",
      color: "#0F9D58", // 초록색 - 사회성 관련
      bgColor: "#E6F4EA",
      iconEmoji: "👥", // 사람들 이모티콘
    },
    {
      id: "ETC",
      label: "기타",
      description: "기타 상담",
      color: "#F4B400", // 노란색 - 기타 주제
      bgColor: "#FEF7E0",
      iconEmoji: "💬", // 대화바투 이모티콘
    },
  ];

  // 태그 토글 처리 (클릭 시 선택/선택해제)
  const toggleTag = (tagId: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tagId)
        ? formData.tags.filter((tag) => tag !== tagId) // 이미 있으면 제거
        : [...formData.tags, tagId], // 없으면 추가
    });
  };

  // 태그 선택 상태 확인
  const isTagSelected = (tagId: string) => formData.tags.includes(tagId);

  // 이전 방식을 위한 호환성 유지 함수
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 새 방식으로 전환했으니 이 함수는 사용하지 않음
  };

  // 태그 제거 (호환성 유지)
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // 체크박스 처리
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // 취소 버튼 처리
  const handleCancel = () => {
    setShowForm(false);
    // 폼 데이터 초기화
    setFormData({
      studentId: selectedStudent,
      content: "",
      nextPlan: "",
      tags: [],
      isSharedWithOtherTeachers: false,
    });
    setTagInput("");
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) {
      message.error("학생을 선택해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      message.error("상담 내용을 입력해주세요.");
      return;
    }

    try {
      // API 요청 데이터 형식에 맞게 변환
      const counselRequest: CreateCounselRequest = {
        context: formData.content,
        plan: formData.nextPlan,
        tags: formData.tags,
        isShared: formData.isSharedWithOtherTeachers,
      };

      // 상담 등록 API 호출
      const response = await createCounselRecord(
        selectedStudent,
        counselRequest
      );

      console.log("상담 기록 저장 성공:", response);

      // 제출 후 폼 초기화
      setFormData({
        studentId: selectedStudent,
        content: "",
        nextPlan: "",
        tags: [],
        isSharedWithOtherTeachers: false,
      });

      message.success("상담 기록이 저장되었습니다.");

      // 상담 기록 목록 다시 불러오기
      handleTabChange("history");

      // 상담 기록 다시 불러오기
      const fetchCounselRecords = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await getCounselRecords(selectedStudent, 0);

          // 서버 응답 형식을 애플리케이션 형식으로 변환
          const mappedRecords: ConsultationRecord[] =
            response.data.counsels.map(
              (record: ServerCounselRecord, index: number) => ({
                id: index.toString(),
                studentId: selectedStudent,
                teacherId: userInfo?.userId?.toString() || "",
                teacherName: userInfo?.name || "선생님",
                date: new Date(record.createdAt).toISOString().split("T")[0],
                content: record.context,
                nextPlan: record.plan,
                tags: record.tags,
                isSharedWithOtherTeachers: record.shared,
                createdAt: record.createdAt,
                updatedAt: record.createdAt,
              })
            );

          setStudentConsultations(mappedRecords);
        } catch (err) {
          console.error("상담 기록을 가져오는 중 오류가 발생했습니다:", err);
          setError("상담 기록을 가져오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchCounselRecords();
    } catch (error) {
      console.error("상담 기록 저장 중 오류 발생:", error);
      message.error("상담 기록 저장에 실패했습니다.");
    }
  };

  // 날짜 포맷 처리
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || "선생님"}
      userRole="교사"
      userInfo="상담 관리"
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />
      <PageContainer>
        {/* 학생 목록 사이드바 */}
        <StudentSidebar
          onSelectStudent={handleStudentSelect}
          selectedStudentId={selectedStudent}
        />

        {/* 상담 기록 컨텐츠 영역 */}
        <ContentArea>
          <PageHeader>
            <PageTitle>상담 기록</PageTitle>
          </PageHeader>
          <FilterContainer>
            <FilterGroup>
              <Label>검색어</Label>
              <StyledInput
                type="text"
                placeholder="상담 내용이나 태그로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <SearchButton
                onClick={() => {
                  if (!searchTerm.trim()) {
                    // 검색어가 없으면 전체 기록 로드
                    loadConsultations();
                    setShowAllRecords(false);
                    return;
                  }

                  const term = searchTerm.toLowerCase();
                  const filtered = consultations.filter((c) => {
                    // 내용과 계획에서 검색
                    const contentMatch = c.content.toLowerCase().includes(term);
                    const planMatch = c.nextPlan.toLowerCase().includes(term);

                    // 태그에서 검색 (한글명으로 매핑하여 검색)
                    const tagMatch = c.tags.some((tagId) => {
                      // 태그 ID에 직접 검색어가 포함되는지 확인
                      const directMatch = tagId.toLowerCase().includes(term);

                      // 태그 ID에 해당하는 한글명에서 검색어가 포함되는지 확인
                      const tagInfo = TAG_INFO.find((t) => t.id === tagId);
                      const koreanLabelMatch = tagInfo
                        ? tagInfo.label.toLowerCase().includes(term)
                        : false;

                      return directMatch || koreanLabelMatch;
                    });

                    return contentMatch || planMatch || tagMatch;
                  });

                  // 검색 결과를 consultations에 저장하여 화면에 반영
                  setConsultations(filtered);
                  setShowAllRecords(true); // 검색 결과는 모두 표시
                }}
              >
                검색하기
              </SearchButton>
            </FilterGroup>
          </FilterContainer>

          <TabsWrapper>
            <TabContainer>
              <Tab
                active={activeTab === "new"}
                onClick={() => handleTabChange("new")}
              >
                새 상담 기록
              </Tab>
              <Tab
                active={activeTab === "history"}
                onClick={() => handleTabChange("history")}
              >
                상담 기록 조회
              </Tab>
            </TabContainer>
          </TabsWrapper>

          {activeTab === "new" ? (
            <Card>
              {showForm && (
                <ConsultationForm onSubmit={handleSubmit}>
                  <FormSection>
                    <SectionTitle>상담 내용</SectionTitle>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: colors.grey[600],
                        marginBottom: "1rem",
                      }}
                    >
                      학생과의 상담 내용을 자세히 기록해주세요.
                    </p>
                    <FormGroup>
                      <TextArea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="여기에 내용을 작성하세요."
                        style={{
                          minHeight: "150px",
                          padding: "1rem",
                          fontSize: "0.95rem",
                          lineHeight: "1.5",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.grey[500],
                          marginTop: "0.5rem",
                          textAlign: "right",
                        }}
                      >
                        {formData.content.length}/2000
                      </div>
                    </FormGroup>
                  </FormSection>
                  <FormSection>
                    <SectionTitle>다음 계획 및 조치사항</SectionTitle>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: colors.grey[600],
                        marginBottom: "1rem",
                      }}
                    >
                      상담 이후 어떤 조치를 취할 계획인지, 어떤 지원이 필요한지
                      구체적으로 작성해주세요.
                    </p>
                    <FormGroup>
                      <TextArea
                        name="nextPlan"
                        value={formData.nextPlan}
                        onChange={handleInputChange}
                        placeholder="여기에 내용을 작성하세요."
                        style={{
                          minHeight: "120px",
                          padding: "1rem",
                          fontSize: "0.95rem",
                          lineHeight: "1.5",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.grey[500],
                          marginTop: "0.5rem",
                          textAlign: "right",
                        }}
                      >
                        {formData.nextPlan.length}/1000
                      </div>
                    </FormGroup>
                  </FormSection>
                  <FormSection>
                    <SectionTitle>상담 유형 선택</SectionTitle>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: colors.grey[600],
                        marginBottom: "1rem",
                      }}
                    >
                      상담 내용에 해당하는 유형을 선택해주세요. 여러 개 선택
                      가능합니다.
                    </p>
                    <FormGroup>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {TAG_INFO.map((tag) => (
                          <div
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            style={{
                              display: "flex",
                              padding: "0.75rem 1rem",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              backgroundColor: isTagSelected(tag.id)
                                ? tag.bgColor
                                : "#f9f9f9",
                              border: isTagSelected(tag.id)
                                ? `1px solid ${tag.color}`
                                : "1px solid #e0e0e0",
                              boxShadow: isTagSelected(tag.id)
                                ? `0 2px 4px rgba(0,0,0,0.05)`
                                : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  backgroundColor: tag.bgColor,
                                  border: `2px solid ${tag.color}`,
                                  marginRight: "1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "18px",
                                }}
                              >
                                {tag.iconEmoji}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    marginBottom: "0.25rem",
                                    color: isTagSelected(tag.id)
                                      ? tag.color
                                      : "#333",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {tag.label}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.85rem",
                                    color: isTagSelected(tag.id)
                                      ? "#555"
                                      : colors.grey[600],
                                  }}
                                >
                                  {tag.description}
                                </div>
                              </div>
                              <div
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  backgroundColor: isTagSelected(tag.id)
                                    ? tag.color
                                    : "transparent",
                                  border: isTagSelected(tag.id)
                                    ? "none"
                                    : `1px solid #bdbdbd`,
                                  marginLeft: "0.5rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {isTagSelected(tag.id) && "✓"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {formData.tags.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                          <div
                            style={{ fontWeight: 500, marginBottom: "0.5rem" }}
                          >
                            선택된 유형:
                          </div>
                          <TagsContainer>
                            {formData.tags.map((tagId) => {
                              const tagInfo = TAG_INFO.find(
                                (t) => t.id === tagId
                              );
                              return (
                                <Tag key={tagId}>
                                  {tagInfo?.label || tagId}
                                  <TagRemoveButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTag(tagId);
                                    }}
                                  >
                                    ×
                                  </TagRemoveButton>
                                </Tag>
                              );
                            })}
                          </TagsContainer>
                        </div>
                      )}
                    </FormGroup>
                  </FormSection>
                  <FormSection>
                    <SectionTitle>공유 설정</SectionTitle>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: colors.grey[600],
                        marginBottom: "1rem",
                      }}
                    >
                      상담 내용을 다른 교사와 공유할지 여부를 설정해주세요.
                    </p>
                    <FormGroup>
                      <div
                        onClick={() => {
                          setFormData({
                            ...formData,
                            isSharedWithOtherTeachers:
                              !formData.isSharedWithOtherTeachers,
                          });
                        }}
                        style={{
                          display: "flex",
                          padding: "1rem",
                          borderRadius: "8px",
                          backgroundColor: formData.isSharedWithOtherTeachers
                            ? `${colors.primary.light}30`
                            : "#f5f5f5",
                          border: formData.isSharedWithOtherTeachers
                            ? `1px solid ${colors.primary.main}`
                            : "1px solid #e0e0e0",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            backgroundColor: formData.isSharedWithOtherTeachers
                              ? colors.primary.main
                              : "white",
                            border: formData.isSharedWithOtherTeachers
                              ? "none"
                              : "1px solid #bdbdbd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "1rem",
                          }}
                        >
                          {formData.isSharedWithOtherTeachers && (
                            <span style={{ color: "white", fontSize: "16px" }}>
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: 600, marginBottom: "0.25rem" }}
                          >
                            다른 교사와 상담 내용 공유
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: colors.grey[600],
                            }}
                          >
                            이 설정을 활성화하면 다른 교사도 해당 학생의 상담
                            내용을 확인할 수 있습니다.
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: formData.isSharedWithOtherTeachers
                            ? colors.primary.main
                            : colors.grey[500],
                        }}
                      >
                        {formData.isSharedWithOtherTeachers
                          ? "상담 내용이 다른 교사와 공유됩니다."
                          : "상담 내용이 다른 교사에게 공유되지 않습니다."}
                      </div>
                    </FormGroup>
                  </FormSection>

                  <div
                    style={{
                      padding: "1rem 0",
                      borderTop: "1px solid #eee",
                      marginTop: "2rem",
                    }}
                  >
                    <ButtonContainer style={{ justifyContent: "flex-end" }}>
                      <SecondaryButton
                        type="button"
                        onClick={() => handleCancel()}
                        style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}
                      >
                        취소
                      </SecondaryButton>
                      <PrimaryButton
                        type="submit"
                        style={{
                          padding: "0.75rem 2rem",
                          fontSize: "1rem",
                          backgroundColor: colors.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        상담 기록 저장
                      </PrimaryButton>
                    </ButtonContainer>
                  </div>
                </ConsultationForm>
              )}
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>상담 기록</CardTitle>
              </CardHeader>
              {loading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>로딩 중...</p>
                </div>
              ) : error ? (
                <div
                  style={{ textAlign: "center", padding: "2rem", color: "red" }}
                >
                  {error}
                </div>
              ) : consultations.length > 0 ? (
                <ConsultationGrid>
                  {consultations.map((consultation) => {
                    // 상담 날짜 포맷팅
                    const consultDate = new Date(consultation.createdAt);
                    const formattedDate = consultDate.toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );
                    const formattedTime = consultDate.toLocaleTimeString(
                      "ko-KR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    // 현재 태그 정보에서 해당 태그 찾기
                    const findTagInfo = (tagId) =>
                      TAG_INFO.find((t) => t.id === tagId) || {
                        color: "#999",
                        bgColor: "#f5f5f5",
                        label: tagId,
                        iconEmoji: "",
                      };

                    return (
                      <div
                        key={consultation.id}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          overflow: "hidden",
                          border: "1px solid #eaeaea",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "1rem",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: colors.primary.main,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                marginRight: "1rem",
                                fontSize: "1.2rem",
                              }}
                            >
                              {consultation.teacherName
                                ? consultation.teacherName[0]
                                : "?"}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {consultation.teacherName}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.9rem",
                                  color: colors.grey[600],
                                }}
                              >
                                {formattedDate} {formattedTime}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {consultation.tags.map((tagId) => {
                              const tagInfo = findTagInfo(tagId);
                              return (
                                <div
                                  key={tagId}
                                  style={{
                                    backgroundColor: tagInfo.bgColor,
                                    color: tagInfo.color,
                                    padding: "0.4rem 0.75rem",
                                    borderRadius: "20px",
                                    fontSize: "0.8rem",
                                    fontWeight: "500",
                                    border: `1px solid ${tagInfo.color}`,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                >
                                  {tagInfo.iconEmoji && (
                                    <span style={{ fontSize: "0.9rem" }}>
                                      {tagInfo.iconEmoji}
                                    </span>
                                  )}
                                  {tagInfo.label}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "1.5rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <div
                            style={{
                              marginBottom: "0.5rem",
                              fontWeight: "600",
                              color: colors.grey[700],
                            }}
                          >
                            상담 내용
                          </div>
                          <div
                            style={{
                              whiteSpace: "pre-line",
                              lineHeight: "1.6",
                              color: colors.grey[900],
                              backgroundColor: "#fafafa",
                              padding: "1rem",
                              borderRadius: "8px",
                              border: "1px solid #f0f0f0",
                            }}
                          >
                            {consultation.content}
                          </div>
                        </div>

                        <div style={{ padding: "1.5rem" }}>
                          <div
                            style={{
                              marginBottom: "0.5rem",
                              fontWeight: "600",
                              color: colors.primary.main,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <span style={{ fontSize: "1rem" }}>📋</span>
                            다음 단계 / 후속 조치
                          </div>
                          <div
                            style={{
                              whiteSpace: "pre-line",
                              lineHeight: "1.6",
                              color: colors.grey[900],
                              backgroundColor: "#f5f9ff",
                              padding: "1rem",
                              borderRadius: "8px",
                              border: `1px solid ${colors.primary.light}`,
                            }}
                          >
                            {consultation.nextPlan ||
                              "특별한 후속 조치가 필요하지 않습니다."}
                          </div>
                        </div>

                        {consultation.isSharedWithOtherTeachers && (
                          <div
                            style={{
                              padding: "0.75rem",
                              backgroundColor: "#f5f5f5",
                              borderTop: "1px solid #eaeaea",
                              fontSize: "0.9rem",
                              color: colors.grey[600],
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span style={{ fontSize: "1rem" }}>👥</span>이 상담
                            기록은 다른 교사와 공유되고 있습니다
                          </div>
                        )}
                      </div>
                    );
                  })}
                </ConsultationGrid>
              ) : (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    border: "1px solid #e9ecef",
                    margin: "1rem 0",
                  }}
                >
                  {selectedStudent ? (
                    <>
                      <div
                        style={{
                          fontSize: "3.5rem",
                          marginBottom: "1.5rem",
                          color: colors.grey[400],
                        }}
                      >
                        📋
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          marginBottom: "0.75rem",
                          color: colors.grey[700],
                        }}
                      >
                        해당 학생의 상담 기록이 없습니다
                      </div>
                      <div
                        style={{
                          color: colors.grey[600],
                          marginBottom: "2rem",
                        }}
                      >
                        첫 상담 기록을 등록하여 학생의 상담 히스토리를 관리해
                        보세요
                      </div>
                      <button
                        onClick={() => setActiveTab("new")}
                        style={{
                          backgroundColor: colors.primary.main,
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        상담 기록 등록하기
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "3.5rem",
                          marginBottom: "1.5rem",
                          color: colors.grey[400],
                        }}
                      >
                        🔍
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          marginBottom: "0.75rem",
                          color: colors.grey[700],
                        }}
                      >
                        학생을 선택하세요
                      </div>
                      <div
                        style={{
                          color: colors.grey[600],
                          maxWidth: "500px",
                          margin: "0 auto",
                          marginBottom: "1.5rem",
                        }}
                      >
                        왼쪽 학생 목록에서 학생을 선택하거나 검색하여 해당
                        학생의 상담 기록을 조회할 수 있습니다.
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "1.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {TAG_INFO.map((tag) => (
                          <div
                            key={tag.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0.75rem 1rem",
                              backgroundColor: tag.bgColor,
                              borderRadius: "8px",
                              color: tag.color,
                              border: `1px solid ${tag.color}30`,
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: tag.color,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "0.75rem",
                                fontSize: "1rem",
                              }}
                            >
                              {tag.iconEmoji}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {tag.label}
                              </div>
                              <div style={{ fontSize: "0.85rem" }}>
                                {tag.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          )}
        </ContentArea>
      </PageContainer>
    </DashboardLayout>
  );
};

export default TeacherConsultationPage;
