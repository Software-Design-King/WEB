import React, { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import { getFeedbackList, createFeedback, Feedback } from "../../../../apis/feedback";
import { FeedbackPresenter } from "./FeedbackPresenter";
import { FeedbackFormData, FeedbackType, FeedbackTypeOption } from "../types";
import { BookOutlined, UserOutlined, FieldTimeOutlined, EditOutlined, ScheduleOutlined } from "@ant-design/icons";

interface FeedbackContainerProps {
  selectedStudentId: string;
}

export const FeedbackContainer: React.FC<FeedbackContainerProps> = ({ selectedStudentId }) => {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<"write" | "history">("write");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [visibleFeedbacks, setVisibleFeedbacks] = useState<number>(6);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState<FeedbackType>("scoreFeed");
  const [showNewNoteForm, setShowNewNoteForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    scoreFeed: "",
    behaviorFeed: "",
    attendanceFeed: "",
    attitudeFeed: "",
    OthersFeed: "",
    isSharedWithStudent: false,
    isSharedWithParent: false,
  });
  
  // 피드백 유형 옵션
  const feedbackTypeOptions = useMemo<FeedbackTypeOption[]>(() => [
    { value: "scoreFeed", label: "학업 성취", icon: <BookOutlined />, color: "#FFECB3" },
    { value: "behaviorFeed", label: "행동 발달", icon: <UserOutlined />, color: "#E1F5FE" },
    { value: "attendanceFeed", label: "출석 상황", icon: <FieldTimeOutlined />, color: "#E8F5E9" },
    { value: "attitudeFeed", label: "학습 태도", icon: <EditOutlined />, color: "#F3E5F5" },
    { value: "OthersFeed", label: "기타 사항", icon: <ScheduleOutlined />, color: "#FFEBEE" },
  ], []);
  
  // 현재 선택된 피드백 유형 정보 가져오기
  const getCurrentFeedbackTypeOption = useCallback(() => {
    return feedbackTypeOptions.find(option => option.value === selectedFeedbackType) || feedbackTypeOptions[0];
  }, [selectedFeedbackType, feedbackTypeOptions]);

  // 피드백 목록 조회
  const fetchFeedbacks = useCallback(async () => {
    if (!selectedStudentId) return;
    
    setIsLoading(true);
    try {
      const response = await getFeedbackList(selectedStudentId, 0);
      if (response.code === 20000) {
        // 최신순 정렬
        const sortedFeedbacks = [...response.data.feedbacks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(sortedFeedbacks);
      } else {
        message.error("피드백 이력을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("피드백 이력 조회 중 오류 발생:", error);
      message.error("피드백 이력을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudentId]);

  // 학생 선택 시 피드백 이력 조회
  useEffect(() => {
    if (selectedStudentId && activeTab === "history") {
      fetchFeedbacks();
    }
  }, [selectedStudentId, activeTab, fetchFeedbacks]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: "write" | "history") => {
    setActiveTab(tab);
    if (tab === "history" && selectedStudentId) {
      fetchFeedbacks();
    }
  };

  // 피드백 유형 선택 핸들러
  const handleSelectFeedbackType = (type: FeedbackType) => {
    setSelectedFeedbackType(type);
  };

  // 폼 입력 핸들러
  const handleInputChange = (field: keyof FeedbackFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 더보기 버튼 핸들러
  const handleShowMoreFeedbacks = () => {
    setVisibleFeedbacks(prev => prev + 2);
  };

  // 피드백 제출 핸들러
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      message.warning("학생을 먼저 선택해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createFeedback(selectedStudentId, formData);
      if (response.code === 20000) {
        message.success("피드백이 성공적으로 등록되었습니다.");
        // 폼 초기화
        setFormData({
          scoreFeed: "",
          behaviorFeed: "",
          attendanceFeed: "",
          attitudeFeed: "",
          OthersFeed: "",
          isSharedWithStudent: false,
          isSharedWithParent: false,
        });
        // 이력 탭으로 전환하고 이력 조회
        setActiveTab("history");
        fetchFeedbacks();
        setShowNewNoteForm(false);
      } else {
        message.error("피드백 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("피드백 등록 중 오류 발생:", error);
      message.error("피드백 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 피드백 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <FeedbackPresenter
      activeTab={activeTab}
      selectedStudentId={selectedStudentId}
      isLoading={isLoading}
      feedbacks={feedbacks}
      visibleFeedbacks={visibleFeedbacks}
      selectedFeedbackType={selectedFeedbackType}
      showNewNoteForm={showNewNoteForm}
      formData={formData}
      feedbackTypeOptions={feedbackTypeOptions}
      handleTabChange={handleTabChange}
      handleSelectFeedbackType={handleSelectFeedbackType}
      handleInputChange={handleInputChange}
      handleSubmitFeedback={handleSubmitFeedback}
      handleShowMoreFeedbacks={handleShowMoreFeedbacks}
      setShowNewNoteForm={setShowNewNoteForm}
      formatDate={formatDate}
      getCurrentFeedbackTypeOption={getCurrentFeedbackTypeOption}
    />
  );
};
