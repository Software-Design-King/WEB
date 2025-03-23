import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
} from "./SignupModal.styles";

const USER_ROLES = [
  { value: "student", label: "학생" },
  { value: "parent", label: "학부모" },
  { value: "teacher", label: "교사" },
];

interface FormValues {
  name: string;
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
  onSubmit: (data: any) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

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

  const [children, setChildren] = useState([
    { name: "", grade: "", class: "", number: "" },
  ]);
  const [parentContact, setParentContact] = useState("");
  const [relationship, setRelationship] = useState("부모");

  const handleHomeroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupFormData({
      ...signupFormData,
      isHomeroom: e.target.checked,
    });
  };

  const handleAddChild = () => {
    setChildren([...children, { name: "", grade: "", class: "", number: "" }]);
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    };
    setChildren(updatedChildren);
  };

  const submitHandler: SubmitHandler<FormValues> = (data) => {
    onSubmit({
      role: selectedRole,
      ...data,
      children,
      parentContact,
      relationship,
    });
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>추가 정보 입력</ModalTitle>
          <ModalDescription>
            서비스 이용을 위해 필요한 추가 정보를 입력해주세요.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <FormField>
            <FormLabel htmlFor="role-select">사용자 유형</FormLabel>
            <FormSelect
              id="role-select"
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
            </div>
          )}

          {selectedRole === "parent" && (
            <div>
              {children.map((child, index) => (
                <div key={index}>
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
                      placeholder="이름"
                    />
                  </FormField>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <FormField style={{ flex: 1 }}>
                      <FormLabel htmlFor={`child-grade-${index}`}>
                        학년
                      </FormLabel>
                      <FormSelect
                        id={`child-grade-${index}`}
                        value={child.grade}
                        onChange={(e) =>
                          handleChildChange(
                            index,
                            "grade",
                            e.target.value
                          )
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
                        value={child.class}
                        onChange={(e) =>
                          handleChildChange(
                            index,
                            "class",
                            e.target.value
                          )
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
                          handleChildChange(
                            index,
                            "number",
                            e.target.value
                          )
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
              ))}
              <ModalButton onClick={handleAddChild}>
                자녀 추가
              </ModalButton>
              <FormField>
                <FormLabel htmlFor="relationship">
                  자녀와의 관계
                </FormLabel>
                <FormSelect
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="부모">부모</option>
                  <option value="보호자">보호자</option>
                  <option value="기타">기타</option>
                </FormSelect>
              </FormField>
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

          {selectedRole === "teacher" && (
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

              <FormField>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="is-homeroom"
                    checked={signupFormData.isHomeroom}
                    onChange={handleHomeroomChange}
                    style={{ marginRight: "8px" }}
                  />
                  <FormLabel htmlFor="is-homeroom" style={{ margin: 0 }}>
                    담임 여부
                  </FormLabel>
                </div>

                {signupFormData.isHomeroom && (
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
              </FormField>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalButton onClick={onClose}>
            취소
          </ModalButton>
          <ModalButton isPrimary onClick={handleSubmit(submitHandler)}>
            등록하기
          </ModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  );
};

export default SignupModal;
