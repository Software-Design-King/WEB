import React from "react";
import { useForm } from "react-hook-form";
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
  SubmitButton,
  CancelButton,
} from "./UserInfoModal.styles";

// 학생 정보 인터페이스
interface StudentData {
  userName: string;
  grade: number;
  classNum: number;
  number: number;
  userType: "STUDENT";
  age: number;
  address: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  contact: string;
  parentContact: string;
}

// 교사 정보 인터페이스
interface TeacherData {
  userName: string;
  grade: number;
  classNum: number;
  userType: "TEACHER";
}

// 폼 데이터 인터페이스 (모든 가능한 필드 포함)
interface FormData {
  userName: string;
  grade: number;
  classNum: number;
  number?: number;
  userType: "STUDENT" | "TEACHER";
  age?: number;
  address?: string;
  gender?: "MALE" | "FEMALE";
  birthDate?: string;
  contact?: string;
  parentContact?: string;
}

type SubmitData = (StudentData | TeacherData) & { kakaoToken: string };

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
  kakaoToken: string;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  kakaoToken,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      userType: "STUDENT",
      grade: 1,
      classNum: 1,
      gender: "MALE",
    },
  });

  const selectedUserType = watch("userType");

  const submitHandler = (data: FormData) => {
    if (data.userType === "STUDENT") {
      // 학생 데이터 구성
      const studentData: StudentData & { kakaoToken: string } = {
        userName: data.userName,
        grade: Number(data.grade),
        classNum: Number(data.classNum),
        number: Number(data.number),
        userType: "STUDENT",
        age: Number(data.age),
        address: data.address || "",
        gender: data.gender as "MALE" | "FEMALE",
        birthDate: data.birthDate || "",
        contact: data.contact || "",
        parentContact: data.parentContact || "",
        kakaoToken,
      };
      onSubmit(studentData);
    } else {
      // 교사 데이터 구성
      const teacherData: TeacherData & { kakaoToken: string } = {
        userName: data.userName,
        grade: Number(data.grade),
        classNum: Number(data.classNum),
        userType: "TEACHER",
        kakaoToken,
      };
      onSubmit(teacherData);
    }
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
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormField>
              <FormLabel htmlFor="userType">사용자 유형</FormLabel>
              <FormSelect
                id="userType"
                {...register("userType", { required: true })}
              >
                <option value="STUDENT">학생</option>
                <option value="TEACHER">교사</option>
              </FormSelect>
              {errors.userType && (
                <FormErrorText>사용자 유형을 선택해주세요.</FormErrorText>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="userName">이름</FormLabel>
              <FormInput
                id="userName"
                {...register("userName", { required: true })}
                placeholder="이름을 입력하세요"
              />
              {errors.userName && (
                <FormErrorText>이름을 입력해주세요.</FormErrorText>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="grade">학년</FormLabel>
              <FormSelect
                id="grade"
                {...register("grade", { required: true, valueAsNumber: true })}
              >
                <option value={1}>1학년</option>
                <option value={2}>2학년</option>
                <option value={3}>3학년</option>
              </FormSelect>
              {errors.grade && (
                <FormErrorText>학년을 선택해주세요.</FormErrorText>
              )}
            </FormField>

            <FormField>
              <FormLabel htmlFor="classNum">반</FormLabel>
              <FormSelect
                id="classNum"
                {...register("classNum", { required: true, valueAsNumber: true })}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}반
                  </option>
                ))}
              </FormSelect>
              {errors.classNum && (
                <FormErrorText>반을 선택해주세요.</FormErrorText>
              )}
            </FormField>

            {selectedUserType === "STUDENT" && (
              <>
                <FormField>
                  <FormLabel htmlFor="number">번호</FormLabel>
                  <FormInput
                    id="number"
                    type="number"
                    {...register("number", { 
                      required: true,
                      min: 1, 
                      max: 50,
                      valueAsNumber: true 
                    })}
                    placeholder="번호를 입력하세요"
                  />
                  {errors.number && (
                    <FormErrorText>유효한 번호를 입력해주세요 (1-50).</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="age">나이</FormLabel>
                  <FormInput
                    id="age"
                    type="number"
                    {...register("age", { 
                      required: true,
                      min: 1, 
                      max: 100,
                      valueAsNumber: true
                    })}
                    placeholder="나이를 입력하세요"
                  />
                  {errors.age && (
                    <FormErrorText>유효한 나이를 입력해주세요.</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="birthDate">생년월일</FormLabel>
                  <FormInput
                    id="birthDate"
                    type="date"
                    {...register("birthDate", { required: true })}
                    max="2020-12-31"
                    min="2000-01-01"
                  />
                  {errors.birthDate && (
                    <FormErrorText>생년월일을 입력해주세요.</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="contact">연락처</FormLabel>
                  <FormInput
                    id="contact"
                    {...register("contact", { 
                      required: true,
                      pattern: {
                        value: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
                        message: "000-0000-0000 형식으로 입력해주세요."
                      }
                    })}
                    placeholder="010-0000-0000"
                  />
                  {errors.contact && (
                    <FormErrorText>
                      {errors.contact.message as string || "연락처를 입력해주세요."}
                    </FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="parentContact">보호자 연락처</FormLabel>
                  <FormInput
                    id="parentContact"
                    {...register("parentContact", { 
                      required: true,
                      pattern: {
                        value: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
                        message: "000-0000-0000 형식으로 입력해주세요."
                      }
                    })}
                    placeholder="010-0000-0000"
                  />
                  {errors.parentContact && (
                    <FormErrorText>
                      {errors.parentContact.message as string || "보호자 연락처를 입력해주세요."}
                    </FormErrorText>
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
                  <FormLabel htmlFor="gender">성별</FormLabel>
                  <FormSelect 
                    id="gender" 
                    {...register("gender", { required: true })}
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </FormSelect>
                  {errors.gender && (
                    <FormErrorText>성별을 선택해주세요.</FormErrorText>
                  )}
                </FormField>
              </>
            )}

            <ModalFooter>
              <CancelButton type="button" onClick={onClose}>
                취소
              </CancelButton>
              <SubmitButton type="submit">제출</SubmitButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalContainer>
  );
};

export default UserInfoModal;
