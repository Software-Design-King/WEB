import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/userStore";
import {
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  FormErrorText,
  ModalFooter,
  ModalButton,
} from "./styles/SignupModal.styles";

const USER_ROLES = [
  { value: "STUDENT", label: "학생" },
  { value: "PARENT", label: "학부모" },
  { value: "TEACHER", label: "교사" },
];

interface FormValues {
  name: string;
  age?: string;
  address?: string;
  gender?: string;
  grade?: string;
  class?: string;
  number?: string;
  subject?: string;
  homeroomGrade?: string;
  homeroomClass?: string;
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  kakaoToken?: string; // 카카오 토큰 추가
}

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  kakaoToken,
}) => {
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [selectedRole, setSelectedRole] = useState<string>("STUDENT");
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [parentContact, setParentContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 자녀 정보를 위한 상태
  const [children, setChildren] = useState<
    Array<{
      name: string;
      grade: string;
      classNum: string;
      number: string;
    }>
  >([{ name: "", grade: "", classNum: "", number: "" }]);

  const handleChildChange = (
    index: number,
    field: keyof (typeof children)[0],
    value: string
  ) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setChildren(updatedChildren);
  };

  const handleAddChild = () => {
    setChildren([
      ...children,
      { name: "", grade: "", classNum: "", number: "" },
    ]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length > 1) {
      const updatedChildren = [...children];
      updatedChildren.splice(index, 1);
      setChildren(updatedChildren);
    }
  };

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    if (!kakaoToken) {
      setError("카카오 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://www.software-design-king.p-e.kr";

      // 학생/교사와 학부모에 따라 엔드포인트와 요청 데이터 구성이 다름
      let endpoint = "";
      let requestData = {};

      if (selectedRole === "PARENT") {
        endpoint = `${apiBaseUrl}/user/enroll/parent`;

        // 자녀 정보 형식 변환
        const childrenData = children
          .filter(
            (child) =>
              child.name && child.grade && child.classNum && child.number
          )
          .map((child) => ({
            childName: child.name,
            grade: parseInt(child.grade),
            classNum: parseInt(child.classNum),
            number: parseInt(child.number),
          }));

        requestData = {
          userName: data.name,
          kakaoToken: kakaoToken,
          children: childrenData,
        };

        // 연락처가 있으면 추가
        if (parentContact) {
          (requestData as any).contack = parentContact; // API 명세에 맞춤 (오타 유지)
        }
      } else {
        // 학생 또는 교사
        endpoint = `${apiBaseUrl}/user/enroll/student-teacher`;

        requestData = {
          userName: data.name,
          userType: selectedRole,
          kakaoToken: kakaoToken,
          grade: data.grade ? parseInt(data.grade) : null,
          classNum: data.class ? parseInt(data.class) : null,
          number: data.number ? parseInt(data.number) : null,
        };

        // 선택적 필드 추가
        if (data.age) {
          (requestData as any).age = parseInt(data.age);
        }

        if (data.address) {
          (requestData as any).address = data.address;
        }

        if (data.gender) {
          (requestData as any).gender = data.gender.toUpperCase();
        }

        // 교사 관련 필드
        if (selectedRole === "TEACHER" && data.subject) {
          (requestData as any).subject = data.subject;
        }

        if (
          selectedRole === "TEACHER" &&
          isHomeroom &&
          data.homeroomGrade &&
          data.homeroomClass
        ) {
          (requestData as any).homeroomGrade = parseInt(data.homeroomGrade);
          (requestData as any).homeroomClass = parseInt(data.homeroomClass);
        }
      }

      console.log("회원가입 요청:", endpoint, requestData);

      const response = await axios.post(endpoint, requestData);
      console.log("회원가입 응답:", response.data);

      // 회원가입 성공
      if (response.data.code === 20000) {
        // 토큰 저장
        if (response.data.data.accessToken) {
          localStorage.setItem("token", response.data.data.accessToken);
        }
        if (response.data.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }

        // Zustand에 사용자 정보 저장
        const userInfoData = response.data.data;
        try {
          const userInfo = {
            name: userInfoData.userName || data.name,
            roleInfo: `${userInfoData.grade || 0}학년 ${
              userInfoData.classNum || 0
            }반`,
            number: userInfoData.number || 0,
            userType: userInfoData.userType || selectedRole,
          };

          setUserInfo(userInfo);
          console.log("사용자 정보 저장:", userInfo);

          // 모달 닫기 및 폼 초기화
          reset();
          onClose();

          // 역할에 따라 리다이렉트
          if (
            userInfo.userType === "STUDENT" ||
            userInfo.userType === "PARENT"
          ) {
            navigate("/student/dashboard");
          } else if (userInfo.userType === "TEACHER") {
            navigate("/teacher/dashboard");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.error("사용자 정보 저장 오류:", err);
        }
      } else {
        // 응답은 왔지만 성공 코드가 아닌 경우
        setError(response.data.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("회원가입 요청 오류:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`서버 오류: ${err.response.data?.message || err.message}`);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }

    // 콜백 함수가 있으면 호출
    if (onSubmit) {
      onSubmit(data);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>회원 정보 등록</ModalTitle>
          <ModalDescription>
            서비스 이용을 위해 기본 정보를 입력해 주세요.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {error && (
            <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
          )}

          <FormField>
            <FormLabel htmlFor="role">사용자 유형</FormLabel>
            <FormSelect
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {USER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="name">이름</FormLabel>
            <FormInput
              id="name"
              {...register("name", { required: true })}
              placeholder="이름을 입력하세요"
            />
            {errors.name && <FormErrorText>이름을 입력해주세요.</FormErrorText>}
          </FormField>

          <FormField>
            <FormLabel htmlFor="age">나이</FormLabel>
            <FormInput
              id="age"
              type="number"
              {...register("age")}
              placeholder="나이를 입력하세요"
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="address">주소</FormLabel>
            <FormInput
              id="address"
              {...register("address")}
              placeholder="주소를 입력하세요"
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="gender">성별</FormLabel>
            <FormSelect id="gender" {...register("gender")}>
              <option value="">선택</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </FormSelect>
          </FormField>

          {selectedRole === "STUDENT" && (
            <div>
              <FormField>
                <FormLabel htmlFor="grade">학년</FormLabel>
                <FormSelect
                  id="grade"
                  {...register("grade", { required: true })}
                  defaultValue="1"
                >
                  <option value="">학년</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </FormSelect>
                {errors.grade && (
                  <FormErrorText>학년을 선택해주세요.</FormErrorText>
                )}
              </FormField>
              <FormField>
                <FormLabel htmlFor="class">반</FormLabel>
                <FormSelect
                  id="class"
                  {...register("class", { required: true })}
                  defaultValue="1"
                >
                  <option value="">반</option>
                  {[...Array(10)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}반
                    </option>
                  ))}
                </FormSelect>
                {errors.class && (
                  <FormErrorText>반을 선택해주세요.</FormErrorText>
                )}
              </FormField>
              <FormField>
                <FormLabel htmlFor="number">번호</FormLabel>
                <FormSelect
                  id="number"
                  {...register("number", { required: true })}
                  defaultValue="1"
                >
                  <option value="">번호</option>
                  {[...Array(30)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}번
                    </option>
                  ))}
                </FormSelect>
                {errors.number && (
                  <FormErrorText>번호를 선택해주세요.</FormErrorText>
                )}
              </FormField>
            </div>
          )}

          {selectedRole === "PARENT" && (
            <div>
              <h3>자녀 정보</h3>
              {children.map((child, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>자녀 {index + 1}</h4>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(index)}
                        style={{
                          color: "red",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div>
                    <FormField>
                      <FormLabel htmlFor={`child-name-${index}`}>
                        이름
                      </FormLabel>
                      <FormInput
                        id={`child-name-${index}`}
                        value={child.name}
                        onChange={(e) =>
                          handleChildChange(index, "name", e.target.value)
                        }
                        placeholder="자녀 이름"
                      />
                    </FormField>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <FormField style={{ flex: 1 }}>
                        <FormLabel htmlFor={`child-grade-${index}`}>
                          학년
                        </FormLabel>
                        <FormSelect
                          id={`child-grade-${index}`}
                          value={child.grade}
                          onChange={(e) =>
                            handleChildChange(index, "grade", e.target.value)
                          }
                        >
                          <option value="">학년</option>
                          <option value="1">1학년</option>
                          <option value="2">2학년</option>
                          <option value="3">3학년</option>
                        </FormSelect>
                      </FormField>
                      <FormField style={{ flex: 1 }}>
                        <FormLabel htmlFor={`child-class-${index}`}>
                          반
                        </FormLabel>
                        <FormSelect
                          id={`child-class-${index}`}
                          value={child.classNum}
                          onChange={(e) =>
                            handleChildChange(index, "classNum", e.target.value)
                          }
                        >
                          <option value="">반</option>
                          {[...Array(10)].map((_, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                              {idx + 1}반
                            </option>
                          ))}
                        </FormSelect>
                      </FormField>
                      <FormField style={{ flex: 1 }}>
                        <FormLabel htmlFor={`child-number-${index}`}>
                          번호
                        </FormLabel>
                        <FormSelect
                          id={`child-number-${index}`}
                          value={child.number}
                          onChange={(e) =>
                            handleChildChange(index, "number", e.target.value)
                          }
                        >
                          <option value="">번호</option>
                          {[...Array(30)].map((_, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                              {idx + 1}번
                            </option>
                          ))}
                        </FormSelect>
                      </FormField>
                    </div>
                  </div>
                </div>
              ))}
              <ModalButton
                type="button"
                onClick={handleAddChild}
                style={{ marginBottom: "20px" }}
              >
                자녀 추가
              </ModalButton>
              <FormField>
                <FormLabel htmlFor="parentContact">연락처</FormLabel>
                <FormInput
                  id="parentContact"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="연락처를 입력하세요"
                />
              </FormField>
            </div>
          )}

          {selectedRole === "TEACHER" && (
            <>
              <FormField>
                <FormLabel htmlFor="subject">담당 과목</FormLabel>
                <FormInput
                  id="subject"
                  {...register("subject", { required: true })}
                  placeholder="담당 과목을 입력하세요"
                />
                {errors.subject && (
                  <FormErrorText>담당 과목을 입력해주세요.</FormErrorText>
                )}
              </FormField>

              <div>
                <FormField>
                  <FormLabel htmlFor="teacher-grade">학년</FormLabel>
                  <FormSelect
                    id="teacher-grade"
                    {...register("grade")}
                    defaultValue=""
                  >
                    <option value="">학년</option>
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </FormSelect>
                </FormField>
                <FormField>
                  <FormLabel htmlFor="teacher-class">반</FormLabel>
                  <FormSelect
                    id="teacher-class"
                    {...register("class")}
                    defaultValue=""
                  >
                    <option value="">반</option>
                    {[...Array(10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}반
                      </option>
                    ))}
                  </FormSelect>
                </FormField>
              </div>

              <FormField>
                <label>
                  <input
                    type="checkbox"
                    checked={isHomeroom}
                    onChange={(e) => setIsHomeroom(e.target.checked)}
                  />{" "}
                  담임 교사입니까?
                </label>
              </FormField>

              {isHomeroom && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <FormInput
                      {...register("homeroomGrade")}
                      placeholder="담임 학년"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <FormInput
                      {...register("homeroomClass")}
                      placeholder="담임 반"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalButton type="button" onClick={onClose}>
            취소
          </ModalButton>
          <ModalButton
            type="button"
            isPrimary
            onClick={handleSubmit(submitHandler)}
            disabled={loading}
          >
            {loading ? "처리 중..." : "등록하기"}
          </ModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  );
};

export default SignupModal;
