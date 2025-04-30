import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthTitle,
  AuthSubtitle,
  FormField,
  FormLabel,
  FormInput,
  FormErrorText,
  SocialLoginButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  FormSelect,
  ModalFooter,
  ModalButton,
} from "./login.styles";
import { redirectToKakaoLogin } from "../../../apis/auth";

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path
      fill="#000000"
      d="M9 1.5C4.5 1.5 0.9 4.2 0.9 7.5C0.9 9.9 2.7 12 5.1 13.2C4.8 14.1 4.2 16.2 4.2 16.5C4.2 16.8 4.5 16.8 4.8 16.5C5.1 16.2 7.2 14.7 8.1 14.1C8.4 14.1 8.7 14.1 9 14.1C13.5 14.1 17.1 11.4 17.1 8.1C17.1 4.8 13.5 1.5 9 1.5Z"
    />
  </svg>
);

const USER_ROLES = [
  { value: "student", label: "학생" },
  { value: "parent", label: "학부모" },
  { value: "teacher", label: "교사" },
];

// 폼 데이터 인터페이스 정의
interface FormData {
  name: string;
  grade?: string;
  class?: string;
  number?: string;
  subject?: string;
  isHomeroom?: boolean;
  homeroomGrade?: string;
  homeroomClass?: string;
  role?: string;
  birthDate?: string;
  address?: string;
  contact?: string;
  parentName?: string;
  parentContact?: string;
}

// 자녀 정보 인터페이스 정의
interface ChildInfo {
  name: string;
  grade: string;
  class: string;
  number: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    grade: "",
    class: "",
    number: "",
    subject: "",
    isHomeroom: false,
    homeroomGrade: "",
    homeroomClass: "",
  });

  const [children, setChildren] = useState<ChildInfo[]>([
    { name: "", grade: "", class: "", number: "" },
  ]);
  const [relationship, setRelationship] = useState("");

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    redirectToKakaoLogin();
  };

  const handleHomeroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupFormData({
      ...signupFormData,
      isHomeroom: e.target.checked,
    });
  };

  const handleAddChild = () => {
    setChildren([...children, { name: "", grade: "", class: "", number: "" }]);
  };

  const handleChildChange = (
    index: number,
    field: keyof ChildInfo,
    value: string
  ) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };
    setChildren(updatedChildren);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Signup form submitted:", {
      role: selectedRole,
      ...data,
      children,
      relationship,
    });
    setIsSignupModalOpen(false);

    // 사용자 유형에 따라 다른 대시보드로 리다이렉트
    if (selectedRole === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      // 학생과 학부모는 동일한 대시보드 사용
      navigate("/student/dashboard");
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>학생 성적 및 상담 관리 시스템</AuthTitle>
          <AuthSubtitle>로그인</AuthSubtitle>
        </AuthHeader>

        <SocialLoginButton type="button" onClick={handleKakaoLogin}>
          <KakaoIcon />
          카카오톡으로 시작하기
        </SocialLoginButton>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#757575",
          }}
        >
          곽성준, 권도훈, 이제용
        </div>
        {isSignupModalOpen && (
          <ModalContainer>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>추가 정보 입력</ModalTitle>
                <ModalDescription>
                  서비스 이용을 위해 필요한 추가 정보를 입력해주세요.
                </ModalDescription>
              </ModalHeader>

              <div style={{ padding: "1.5rem" }}>
                <FormField>
                  <FormLabel htmlFor="role-select">사용자 유형</FormLabel>
                  <FormSelect
                    id="role-select"
                    {...register("role")}
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
                  {errors.name && (
                    <FormErrorText>이름을 입력해주세요.</FormErrorText>
                  )}
                </FormField>

                {selectedRole === "student" && (
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
                    <FormField>
                      <FormLabel htmlFor="birthDate">생년월일</FormLabel>
                      <FormInput
                        id="birthDate"
                        type="date"
                        {...register("birthDate", { required: true })}
                      />
                      {errors.birthDate && (
                        <FormErrorText>생년월일을 입력해주세요.</FormErrorText>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="address">주소</FormLabel>
                      <FormInput
                        id="address"
                        {...register("address", { required: true })}
                        placeholder="주소를 입력하세요"
                      />
                      {errors.address && (
                        <FormErrorText>주소를 입력해주세요.</FormErrorText>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="contact">연락처</FormLabel>
                      <FormInput
                        id="contact"
                        {...register("contact", { required: true })}
                        placeholder="연락처를 입력하세요"
                      />
                      {errors.contact && (
                        <FormErrorText>연락처를 입력해주세요.</FormErrorText>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="parentName">보호자 이름</FormLabel>
                      <FormInput
                        id="parentName"
                        {...register("parentName", { required: true })}
                        placeholder="보호자 이름을 입력하세요"
                      />
                      {errors.parentName && (
                        <FormErrorText>
                          보호자 이름을 입력해주세요.
                        </FormErrorText>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="parentContact">
                        보호자 연락처
                      </FormLabel>
                      <FormInput
                        id="parentContact"
                        {...register("parentContact", { required: true })}
                        placeholder="보호자 연락처를 입력하세요"
                      />
                      {errors.parentContact && (
                        <FormErrorText>
                          보호자 연락처를 입력해주세요.
                        </FormErrorText>
                      )}
                    </FormField>
                  </div>
                )}

                {selectedRole === "parent" && (
                  <div>
                    <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
                      자녀 정보
                    </div>
                    {children.map((child, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "1rem",
                          marginBottom: "1rem",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                        }}
                      >
                        <FormField>
                          <FormLabel htmlFor={`child-name-${index}`}>
                            자녀 이름
                          </FormLabel>
                          <FormInput
                            id={`child-name-${index}`}
                            value={child.name}
                            onChange={(e) =>
                              handleChildChange(index, "name", e.target.value)
                            }
                            placeholder="자녀 이름을 입력하세요"
                          />
                        </FormField>
                        <FormField>
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
                        <FormField>
                          <FormLabel htmlFor={`child-class-${index}`}>
                            반
                          </FormLabel>
                          <FormSelect
                            id={`child-class-${index}`}
                            value={child.class}
                            onChange={(e) =>
                              handleChildChange(index, "class", e.target.value)
                            }
                          >
                            <option value="">반</option>
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}반
                              </option>
                            ))}
                          </FormSelect>
                        </FormField>
                        <FormField>
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
                            {[...Array(30)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}번
                              </option>
                            ))}
                          </FormSelect>
                        </FormField>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddChild}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "1rem",
                        backgroundColor: "#f5f5f5",
                        border: "1px dashed #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      + 자녀 추가
                    </button>
                    <FormField>
                      <FormLabel htmlFor="relationship">
                        자녀와의 관계
                      </FormLabel>
                      <FormSelect
                        id="relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                      >
                        <option value="">관계</option>
                        <option value="father">부</option>
                        <option value="mother">모</option>
                        <option value="grandparent">조부모</option>
                        <option value="other">기타</option>
                      </FormSelect>
                    </FormField>
                  </div>
                )}

                {selectedRole === "teacher" && (
                  <div>
                    <FormField>
                      <FormLabel htmlFor="subject">담당 과목</FormLabel>
                      <FormSelect
                        id="subject"
                        {...register("subject", { required: true })}
                      >
                        <option value="">과목</option>
                        <option value="korean">국어</option>
                        <option value="math">수학</option>
                        <option value="english">영어</option>
                        <option value="science">과학</option>
                        <option value="social">사회</option>
                        <option value="pe">체육</option>
                        <option value="music">음악</option>
                        <option value="art">미술</option>
                      </FormSelect>
                      {errors.subject && (
                        <FormErrorText>담당 과목을 선택해주세요.</FormErrorText>
                      )}
                    </FormField>
                    <FormField>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          id="is-homeroom"
                          checked={signupFormData.isHomeroom}
                          onChange={handleHomeroomChange}
                          style={{ marginRight: "8px" }}
                        />
                        <label htmlFor="is-homeroom">담임 여부</label>
                      </div>
                    </FormField>
                    {signupFormData.isHomeroom && (
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <FormField style={{ flex: 1 }}>
                          <FormLabel htmlFor="homeroom-grade">
                            담임 학년
                          </FormLabel>
                          <FormSelect
                            id="homeroom-grade"
                            {...register("homeroomGrade")}
                          >
                            <option value="">학년</option>
                            <option value="1">1학년</option>
                            <option value="2">2학년</option>
                            <option value="3">3학년</option>
                          </FormSelect>
                        </FormField>
                        <FormField style={{ flex: 1 }}>
                          <FormLabel htmlFor="homeroom-class">
                            담임 반
                          </FormLabel>
                          <FormSelect
                            id="homeroom-class"
                            {...register("homeroomClass")}
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
                    )}
                  </div>
                )}
              </div>

              <ModalFooter>
                <ModalButton
                  type="button"
                  onClick={() => setIsSignupModalOpen(false)}
                  secondary
                >
                  취소
                </ModalButton>
                <ModalButton type="button" onClick={handleSubmit(onSubmit)}>
                  등록
                </ModalButton>
              </ModalFooter>
            </ModalContent>
          </ModalContainer>
        )}
      </AuthCard>
    </AuthContainer>
  );
};

export default LoginPage;
