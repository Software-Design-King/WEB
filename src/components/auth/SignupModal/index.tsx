import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signup, SignupData } from "../../../apis/auth";
import { useAuth } from "../../../hooks/useAuth";
import { useUserStore } from "../../../stores/userStore";

// 색상 변수
const colors = {
  primary: "#4285f4",
  primaryDark: "#3367d6",
  secondary: "#f8f9fa",
  text: "#202124",
  textLight: "#5f6368",
  textInput: "#333333", // 입력 필드 글씨색
  border: "#dadce0",
  error: "#d93025",
  success: "#0f9d58",
  warning: "#f4b400",
  background: "#ffffff",
  inputBackground: "#ffffff", // 입력 필드 배경색
  overlayBackground: "rgba(32, 33, 36, 0.6)",
  sectionBackground: "#f8f9fa",
};

// 스타일 컴포넌트
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.overlayBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background-color: ${colors.background};
  border-radius: 12px;
  width: 90%;
  max-width: 550px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(32, 33, 36, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.secondary};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #bdc1c6;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9aa0a6;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  color: ${colors.primary};
  font-weight: 600;
`;

const ModalDescription = styled.p`
  margin-top: 8px;
  font-size: 16px;
  color: ${colors.textLight};
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background-color: ${colors.sectionBackground};
  border-radius: 8px;
  border-left: 4px solid ${colors.primary};
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: ${colors.primary};
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${colors.text};
  font-size: 15px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  background-color: ${colors.inputBackground};
  color: ${colors.textInput};
  transition: border 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: #bdc1c6;
  }

  &::placeholder {
    color: #9aa0a6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  padding-right: 35px; /* 화살표를 위한 충분한 공간 확보 */
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  background-color: ${colors.inputBackground};
  color: ${colors.textInput};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235f6368' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  transition: border 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: #bdc1c6;
  }

  & option {
    color: ${colors.textInput};
    background-color: ${colors.inputBackground};
  }
`;

const DateInput = styled(Input)`
  /* 날짜 선택 아이콘의 색상 조정 */
  &::-webkit-calendar-picker-indicator {
    filter: invert(0.5); /* 날짜 선택 아이콘을 어둡게 해서 가시성 향상 */
    cursor: pointer;
    opacity: 0.8;
  }

  &::-webkit-inner-spin-button {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${colors.secondary};
  color: ${colors.text};
  border: 1px solid ${colors.border};

  &:hover:not(:disabled) {
    background-color: #ebedef;
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${colors.primaryDark};
  }
`;

const ErrorText = styled.p`
  color: ${colors.error};
  margin-top: 16px;
  font-size: 15px;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 18px;
    height: 18px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23d93025' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E");
    background-size: contain;
    margin-right: 8px;
  }
`;

const RequiredMark = styled.span`
  color: ${colors.error};
  margin-left: 4px;
`;

const InputNote = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: ${colors.textLight};
`;

const FieldWrapper = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 24px 0;
`;

const StepDot = styled.div<{ active: boolean; completed: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 6px;
  background-color: ${(props) =>
    props.completed
      ? colors.primary
      : props.active
      ? colors.primary
      : colors.border};
  opacity: ${(props) => (props.active || props.completed ? 1 : 0.5)};
  transition: all 0.3s;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 14px;
    width: 20px;
    height: 2px;
    background-color: ${(props) =>
      props.completed ? colors.primary : colors.border};
    opacity: ${(props) => (props.completed ? 1 : 0.5)};
  }

  &:last-child::after {
    display: none;
  }
`;

const StepLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
`;

const StepName = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.primary : colors.textLight)};
  font-weight: ${(props) => (props.active ? 500 : 400)};
  transition: all 0.3s;
`;

const StepCounter = styled.span`
  color: ${colors.textLight};
`;

const PrevButton = styled(Button)`
  background-color: ${colors.secondary};
  color: ${colors.text};
  border: 1px solid ${colors.border};

  &:hover:not(:disabled) {
    background-color: #ebedef;
  }
`;

const NextButton = styled(Button)`
  background-color: ${colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${colors.primaryDark};
  }
`;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  kakaoToken?: string;
}

interface FormState {
  userName: string;
  childName: string;
  userType: "STUDENT" | "TEACHER" | "PARENT";
  grade: string;
  classNum: string;
  number: string;
  age: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  address: string;
  contact: string;
  parentContact: string;
  enrollCode: string; // Added for student enrollment code
}

enum Step {
  UserType = 0,
  BasicInfo = 1,
  AdditionalInfo = 2,
  StudentDetails = 3,
}

// 학생은 2단계(유형선택, 기본정보)만 진행, 교사/학부모는 기존 단계 유지

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  kakaoToken,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(Step.UserType);
  const [formData, setFormData] = useState<FormState>({
    userName: "",
    childName: "",
    userType: "STUDENT",
    grade: "1", // Default, will be nulled for student submission
    classNum: "1", // Default, will be nulled for student submission
    number: "", // Default, will be nulled for student submission
    age: "", // Default, will be nulled for student submission
    gender: "MALE", // Default, will be nulled for student submission
    birthDate: "", // Default, will be nulled for student submission
    address: "", // Default, will be nulled for student submission
    contact: "", // Default, will be nulled for student submission
    parentContact: "", // Default, will be nulled for student submission
    enrollCode: "", // Added for student enrollment code
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kakaoToken) {
      setError("카카오 토큰이 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let apiPayload: SignupData;

      if (formData.userType === "STUDENT") {
        apiPayload = {
          userType: "STUDENT",
          userName: formData.userName,
          enrollCode: formData.enrollCode,
          grade: null as any, // Send null for student
          classNum: null as any, // Send null for student
          number: null as any, // Send null for student
          age: null as any, // Send null for student
          gender: null as any, // Send null for student
          birthDate: null as any, // Send null for student
          address: null as any, // Send null for student
          contact: null as any, // Send null for student
          parentContact: null as any, // Send null for student
        };
      } else if (formData.userType === "TEACHER") {
        apiPayload = {
          userType: "TEACHER",
          userName: formData.userName,
          grade: parseInt(formData.grade), // Teachers might have these
          classNum: parseInt(formData.classNum),
          number: formData.number ? parseInt(formData.number) : undefined,
          gender: formData.gender as "MALE" | "FEMALE",
          birthDate: formData.birthDate || undefined,
          contact: formData.contact || undefined,
          // subject: formData.subject || undefined, // Example if teacher has subject
        };
      } else {
        // PARENT (학부모는 이름, 자녀 가입코드만)
        apiPayload = {
          userName: formData.userName, // Parent's name
          studentRegisterCode: formData.enrollCode, // 자녀 가입코드
          childName: formData.childName || null, // 자녀 이름 전달
          grade: null,
          classNum: null,
          number: null,
          kakaoToken: kakaoToken,
        } as any;
      }

      // 회원가입 API 호출
      const response = await signup(apiPayload, kakaoToken);

      if (response.success && response.token) {
        console.log("회원가입 성공:", response);

        // 회원가입 후 받은 토큰 및 응답으로 로그인 상태 저장
        login(response.token, response.userInfo);

        // 응답에서 직접 사용자 정보를 Zustand에 저장
        if (response.userInfo) {
          const setUserInfo = useUserStore.getState().setUserInfo;
          // studentId가 있으면 별도 저장
          const storeUserInfo = {
            name: response.userInfo.name || "",
            roleInfo:
              response.userInfo.roleInfo ||
              `${
                response.userInfo.userType === "STUDENT"
                  ? "학생"
                  : response.userInfo.userType === "TEACHER"
                  ? "교사"
                  : "학부모"
              }`,
            number: response.userInfo.number || null,
            userType: response.userInfo.userType,
            userId: response.userInfo.userId,
            studentId: response.userInfo.studentId || undefined,
          };
          setUserInfo(storeUserInfo);
          if (response.userInfo.studentId) {
            if (useUserStore.getState().setStudentId) {
              useUserStore.getState().setStudentId(response.userInfo.studentId);
            }
          }
          console.log(
            "사용자 정보가 성공적으로 저장되었습니다:",
            storeUserInfo
          );
        }

        // response.userInfo에서 직접 사용자 유형을 확인하여 리다이렉트
        if (
          response.userInfo?.userType === "STUDENT" ||
          response.userInfo?.userType === "PARENT"
        ) {
          navigate("/student/dashboard");
        } else if (response.userInfo?.userType === "TEACHER") {
          navigate("/teacher/dashboard");
        } else {
          // userInfo가 없거나 userType이 명확하지 않은 경우 formData로 백업
          if (
            formData.userType === "STUDENT" ||
            formData.userType === "PARENT"
          ) {
            navigate("/student/dashboard");
          } else {
            navigate("/teacher/dashboard");
          }
        }
      } else {
        setError(response.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    setCurrentStep((prevStep) => (prevStep + 1) as Step);
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    setCurrentStep((prevStep) => (prevStep - 1) as Step);
  };

  // 단계별 검증
  const validateStep = (step: Step): boolean => {
    setError(null);

    switch (step) {
      case Step.UserType:
        return !!formData.userType;
      case Step.BasicInfo:
        if (formData.userType === "STUDENT") {
          if (!formData.userName) {
            setError("이름을 입력해주세요.");
            return false;
          }
          if (!formData.enrollCode) {
            setError("가입 코드를 입력해주세요.");
            return false;
          }
          // 학생은 기타 필드 검증 없이 바로 통과
          return true;
        }
        if (formData.userType === "PARENT") {
          if (!formData.userName) {
            setError("이름을 입력해주세요.");
            return false;
          }
          if (!formData.enrollCode) {
            setError("자녀 가입코드를 입력해주세요.");
            return false;
          }
          return true;
        }
        // 교사
        if (!formData.userName) {
          setError("이름을 입력해주세요.");
          return false;
        }
        if (!formData.grade || !formData.classNum) {
          setError("학년과 반을 선택해주세요.");
          return false;
        }
        return true;
      case Step.AdditionalInfo:
        if (formData.userType === "TEACHER") {
          if (!formData.gender || !formData.birthDate || !formData.contact) {
            setError("모든 필수 항목을 입력해주세요.");
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  // 다음 버튼 클릭
  const handleNextClick = () => {
    if (validateStep(currentStep)) {
      handleNext();
    }
  };

  // 사용자 유형에 따른 총 단계 수 계산
  const getTotalSteps = (): number => {
    if (formData.userType === "STUDENT") return 2; // 학생: 유형 선택 + 기본 정보
    if (formData.userType === "PARENT") return 2; // 유형 선택 + 기본 정보
    if (formData.userType === "TEACHER") return 3; // 유형 선택 + 기본 정보 + 추가 정보
    return 2;
  };

  // 현재 단계가 해당 유형의 마지막 단계인지 확인
  const isLastStep = (): boolean => {
    const totalSteps = getTotalSteps();
    return currentStep === totalSteps - 1;
  };

  // 단계 이름 가져오기
  const getStepName = (step: number): string => {
    switch (step) {
      case Step.UserType:
        return "계정 유형";
      case Step.BasicInfo:
        return "기본 정보";
      case Step.AdditionalInfo:
        return "추가 정보";
      case Step.StudentDetails:
        return "학생 정보";
      default:
        return "";
    }
  };

  // 사용자 타입에 따른 섹션 타이틀
  const getSectionTitle = () => {
    switch (formData.userType) {
      case "STUDENT":
        return "학생 정보 입력";
      case "TEACHER":
        return "교사 정보 입력";
      case "PARENT":
        return "학부모 정보 입력";
      default:
        return "사용자 정보 입력";
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>회원가입</ModalTitle>
          <ModalDescription>
            서비스 이용을 위한 추가 정보를 입력해주세요.
          </ModalDescription>
        </ModalHeader>

        <StepLabel>
          <StepCounter>
            단계 {currentStep + 1}/{getTotalSteps()}
          </StepCounter>
          <StepName active={true}>{getStepName(currentStep)}</StepName>
        </StepLabel>
        <StepIndicator>
          {Array.from({ length: getTotalSteps() }).map((_, index) => (
            <StepDot
              key={index}
              active={currentStep === index}
              completed={currentStep > index}
            />
          ))}
        </StepIndicator>

        <Form onSubmit={handleSubmit}>
          {currentStep === Step.UserType && (
            <FormSection>
              <SectionTitle>계정 유형 선택</SectionTitle>
              <FormGroup>
                <Label htmlFor="userType">
                  사용자 유형<RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="STUDENT">학생</option>
                  <option value="TEACHER">교사</option>
                  <option value="PARENT">학부모</option>
                </Select>
                <InputNote>
                  {formData.userType === "STUDENT"
                    ? "학생 계정으로 성적 확인 및 상담 신청이 가능합니다."
                    : formData.userType === "TEACHER"
                    ? "교사 계정으로 학생 관리 및 성적 입력이 가능합니다."
                    : "학부모 계정으로 자녀의 성적 및 상담 정보를 확인할 수 있습니다."}
                </InputNote>
              </FormGroup>
            </FormSection>
          )}

          {currentStep === Step.BasicInfo && (
            <FormSection>
              <SectionTitle>{getSectionTitle()}</SectionTitle>
              {/* 학생: 이름+가입코드만 입력 */}
              {formData.userType === "STUDENT" && (
                <>
                  <FormGroup>
                    <Label htmlFor="userName">
                      이름<RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="enrollCode">
                      가입 코드<RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="text"
                      id="enrollCode"
                      name="enrollCode"
                      value={formData.enrollCode}
                      onChange={handleChange}
                      placeholder="선생님께 받은 가입 코드를 입력하세요"
                      required
                    />
                  </FormGroup>
                  <InputNote>
                    학년, 반, 번호 등은 입력하지 않아도 됩니다.
                  </InputNote>
                </>
              )}
              {/* 교사: 기존 필드 유지 */}
              {formData.userType === "TEACHER" && (
                <>
                  <FormGroup>
                    <Label htmlFor="userName">
                      이름<RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="교사 이름을 입력하세요"
                      required
                    />
                  </FormGroup>
                  <FieldWrapper>
                    <FormGroup>
                      <Label htmlFor="grade">
                        담당 학년<RequiredMark>*</RequiredMark>
                      </Label>
                      <Select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          학년 선택
                        </option>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}학년
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="classNum">
                        담당 반<RequiredMark>*</RequiredMark>
                      </Label>
                      <Select
                        id="classNum"
                        name="classNum"
                        value={formData.classNum}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          반 선택
                        </option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}반
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                  </FieldWrapper>
                  <FormGroup>
                    <Label htmlFor="number">교번 (선택)</Label>
                    <Input
                      type="number"
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="교번을 입력하세요 (선택 사항)"
                      min="1"
                    />
                  </FormGroup>
                </>
              )}
              {/* 학부모: 기존 필드 유지 */}
              {formData.userType === "PARENT" && (
                <>
                  <FormGroup>
                    <Label htmlFor="userName">
                      학부모 이름<RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="학부모님의 이름을 입력하세요"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="enrollCode">
                      자녀 가입코드<RequiredMark>*</RequiredMark>
                    </Label>
                    <Input
                      type="text"
                      id="enrollCode"
                      name="enrollCode"
                      value={formData.enrollCode}
                      onChange={handleChange}
                      placeholder="자녀의 가입코드를 입력하세요"
                      required
                    />
                  </FormGroup>
                  <InputNote>
                    자녀의 가입코드는 학생이 받은 가입코드를 입력해주세요.
                  </InputNote>
                </>
              )}
            </FormSection>
          )}

          {/* 학생은 추가정보 단계 자체를 렌더링하지 않음 */}
          {currentStep === Step.AdditionalInfo &&
            formData.userType !== "STUDENT" && (
              <FormSection>
                {/* 교사 기존 필드 유지 */}
                {formData.userType === "TEACHER" && (
                  <>
                    <SectionTitle>교사 개인 정보</SectionTitle>
                    <FieldWrapper>
                      <FormGroup>
                        <Label htmlFor="gender">
                          성별<RequiredMark>*</RequiredMark>
                        </Label>
                        <Select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="MALE">남성</option>
                          <option value="FEMALE">여성</option>
                        </Select>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="birthDate">
                          생년월일<RequiredMark>*</RequiredMark>
                        </Label>
                        <DateInput
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="contact">
                          연락처<RequiredMark>*</RequiredMark>
                        </Label>
                        <Input
                          type="tel"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          placeholder="010-1234-5678"
                          required
                        />
                      </FormGroup>
                    </FieldWrapper>
                  </>
                )}
                {/* 학부모는 추가 정보 없음 안내 */}
                {formData.userType === "PARENT" && (
                  <>
                    <SectionTitle>추가 정보</SectionTitle>
                    <InputNote>
                      학부모는 추가로 입력할 정보가 없습니다. '다음' 또는
                      '제출'을 눌러주세요.
                    </InputNote>
                  </>
                )}
              </FormSection>
            )}

          {currentStep === Step.StudentDetails &&
            formData.userType === "STUDENT" && (
              <FormSection>
                <SectionTitle>학생 세부 정보</SectionTitle>
                <p>
                  학생 세부 정보 입력 단계입니다. 현재 학생의 경우 이 단계에서
                  입력할 내용이 없습니다. '제출'을 눌러 가입을 완료해주세요.
                </p>
              </FormSection>
            )}

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            {currentStep === Step.UserType ? (
              <CancelButton type="button" onClick={onClose}>
                취소
              </CancelButton>
            ) : (
              <PrevButton type="button" onClick={handlePrev}>
                이전
              </PrevButton>
            )}
            {isLastStep() ? (
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? "처리 중..." : "가입하기"}
              </SubmitButton>
            ) : (
              <NextButton type="button" onClick={handleNextClick}>
                다음
              </NextButton>
            )}
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupModal;
