import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { signup, SignupData } from '../../../apis/auth';
import { useAuth } from '../../../hooks/useAuth';

// 색상 변수
const colors = {
  primary: '#4285f4',
  primaryDark: '#3367d6',
  secondary: '#f8f9fa',
  text: '#202124',
  textLight: '#5f6368',
  textInput: '#333333',  // 입력 필드 글씨색
  border: '#dadce0',
  error: '#d93025',
  success: '#0f9d58',
  warning: '#f4b400',
  background: '#ffffff',
  inputBackground: '#ffffff',  // 입력 필드 배경색
  overlayBackground: 'rgba(32, 33, 36, 0.6)',
  sectionBackground: '#f8f9fa',
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
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
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
    content: '';
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
  background-color: ${props => 
    props.completed 
      ? colors.primary
      : props.active 
        ? colors.primary 
        : colors.border};
  opacity: ${props => props.active || props.completed ? 1 : 0.5};
  transition: all 0.3s;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 14px;
    width: 20px;
    height: 2px;
    background-color: ${props => props.completed ? colors.primary : colors.border};
    opacity: ${props => props.completed ? 1 : 0.5};
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
  color: ${props => props.active ? colors.primary : colors.textLight};
  font-weight: ${props => props.active ? 500 : 400};
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
  userType: 'STUDENT' | 'TEACHER' | 'PARENT';
  grade: string;
  classNum: string;
  number: string;
  age: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  address: string;
  contact: string;
  parentContact: string;
}

enum Step {
  UserType = 0,
  BasicInfo = 1,
  AdditionalInfo = 2,
  StudentDetails = 3,
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, kakaoToken }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(Step.UserType);
  const [formData, setFormData] = useState<FormState>({
    userName: '',
    childName: '',
    userType: 'STUDENT',
    grade: '1',
    classNum: '1',
    number: '',
    age: '',
    gender: 'MALE',
    birthDate: '',
    address: '',
    contact: '',
    parentContact: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kakaoToken) {
      setError('카카오 토큰이 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 사용자 타입에 따라 필요한 데이터만 추출
      const signupData: SignupData = {
        userType: formData.userType,
        grade: parseInt(formData.grade),
        classNum: parseInt(formData.classNum),
      };
      
      if (formData.userType === 'PARENT') {
        // 학부모인 경우 childName 필수
        signupData.userName = formData.userName;
        signupData.childName = formData.childName;
        signupData.number = parseInt(formData.number);
      } else {
        // 학생/교사인 경우
        signupData.userName = formData.userName;
        if (formData.number) {
          signupData.number = parseInt(formData.number);
        }
        
        // 추가 필드 (학생/교사만)
        if (formData.birthDate) {
          signupData.birthDate = formData.birthDate;
        }
        if (formData.gender) {
          signupData.gender = formData.gender;
        }
        if (formData.contact) {
          signupData.contact = formData.contact;
        }
        
        // 학생만 필요한 필드
        if (formData.userType === 'STUDENT') {
          if (formData.age) {
            signupData.age = parseInt(formData.age);
          }
          if (formData.address) {
            signupData.address = formData.address;
          }
          if (formData.parentContact) {
            signupData.parentContact = formData.parentContact;
          }
        }
      }

      // 회원가입 API 호출
      const response = await signup(signupData, kakaoToken);
      
      if (response.success && response.token && response.userInfo) {
        // 성공적인 회원가입 후 로그인 처리
        login(response.token, response.userInfo);

        // 사용자 유형에 따른 리다이렉트
        if (formData.userType === 'STUDENT' || formData.userType === 'PARENT') {
          navigate('/student/dashboard');
        } else {
          navigate('/teacher/dashboard');
        }
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError('회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1 as Step);
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    setCurrentStep(prevStep => prevStep - 1 as Step);
  };

  // 단계별 검증
  const validateStep = (step: Step): boolean => {
    setError(null);

    switch (step) {
      case Step.UserType:
        return !!formData.userType;
      
      case Step.BasicInfo:
        if (formData.userType === 'PARENT') {
          if (!formData.userName || !formData.childName) {
            setError('모든 필수 항목을 입력해주세요.');
            return false;
          }
        } else {
          if (!formData.userName) {
            setError('이름을 입력해주세요.');
            return false;
          }
        }
        if (!formData.grade || !formData.classNum) {
          setError('학년과 반을 선택해주세요.');
          return false;
        }
        if ((formData.userType === 'STUDENT' || formData.userType === 'PARENT') && !formData.number) {
          setError('번호를 입력해주세요.');
          return false;
        }
        return true;
      
      case Step.AdditionalInfo:
        if (formData.userType !== 'PARENT') {
          if (!formData.gender || !formData.birthDate || !formData.contact) {
            setError('모든 필수 항목을 입력해주세요.');
            return false;
          }
        }
        return true;
      
      case Step.StudentDetails:
        if (formData.userType === 'STUDENT') {
          if (!formData.age || !formData.address || !formData.parentContact) {
            setError('모든 필수 항목을 입력해주세요.');
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
    if (formData.userType === 'PARENT') return 2; // 유형 선택 + 기본 정보
    if (formData.userType === 'TEACHER') return 3; // 유형 선택 + 기본 정보 + 추가 정보
    return 4; // 학생: 모든 단계
  };

  // 현재 단계가 해당 유형의 마지막 단계인지 확인
  const isLastStep = (): boolean => {
    const totalSteps = getTotalSteps();
    return currentStep === totalSteps - 1;
  };

  // 단계 이름 가져오기
  const getStepName = (step: number): string => {
    switch (step) {
      case Step.UserType: return '계정 유형';
      case Step.BasicInfo: return '기본 정보';
      case Step.AdditionalInfo: return '추가 정보';
      case Step.StudentDetails: return '학생 정보';
      default: return '';
    }
  };

  // 사용자 타입에 따른 섹션 타이틀
  const getSectionTitle = () => {
    switch(formData.userType) {
      case 'STUDENT': return '학생 정보 입력';
      case 'TEACHER': return '교사 정보 입력';
      case 'PARENT': return '학부모 정보 입력';
      default: return '사용자 정보 입력';
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>회원가입</ModalTitle>
          <ModalDescription>서비스 이용을 위한 추가 정보를 입력해주세요.</ModalDescription>
        </ModalHeader>

        <StepLabel>
          <StepCounter>단계 {currentStep + 1}/{getTotalSteps()}</StepCounter>
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
              <Label htmlFor="userType">사용자 유형<RequiredMark>*</RequiredMark></Label>
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
                {formData.userType === 'STUDENT' ? '학생 계정으로 성적 확인 및 상담 신청이 가능합니다.' :
                  formData.userType === 'TEACHER' ? '교사 계정으로 학생 관리 및 성적 입력이 가능합니다.' :
                  '학부모 계정으로 자녀의 성적 및 상담 정보를 확인할 수 있습니다.'}
              </InputNote>
            </FormGroup>
          </FormSection>
        )}

        {currentStep === Step.BasicInfo && (
          <FormSection>
            <SectionTitle>{getSectionTitle()}</SectionTitle>
            
            {formData.userType === 'PARENT' ? (
              // 학부모 전용 필드
              <>
                <FormGroup>
                  <Label htmlFor="userName">학부모 이름<RequiredMark>*</RequiredMark></Label>
                  <Input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="학부모 이름을 입력하세요"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="childName">자녀 이름<RequiredMark>*</RequiredMark></Label>
                  <Input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    placeholder="자녀 이름을 입력하세요"
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </>
            ) : (
              // 학생/교사 공통 필드
              <FormGroup>
                <Label htmlFor="userName">이름<RequiredMark>*</RequiredMark></Label>
                <Input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  placeholder={formData.userType === 'STUDENT' ? "학생 이름을 입력하세요" : "교사 이름을 입력하세요"}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            )}

            <FieldWrapper>
              <FormGroup>
                <Label htmlFor="grade">학년<RequiredMark>*</RequiredMark></Label>
                <Select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}학년</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="classNum">반<RequiredMark>*</RequiredMark></Label>
                <Select
                  id="classNum"
                  name="classNum"
                  value={formData.classNum}
                  onChange={handleChange}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}반</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="number">
                  번호
                  {formData.userType === 'STUDENT' || formData.userType === 'PARENT' ? <RequiredMark>*</RequiredMark> : null}
                  {formData.userType === 'TEACHER' && ' (선택)'}
                </Label>
                <Input
                  type="number"
                  id="number"
                  name="number"
                  value={formData.number}
                  placeholder="번호 입력"
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required={formData.userType === 'STUDENT' || formData.userType === 'PARENT'}
                />
              </FormGroup>
            </FieldWrapper>
          </FormSection>
        )}

        {currentStep === Step.AdditionalInfo && formData.userType !== 'PARENT' && (
          <FormSection>
            <SectionTitle>
              {formData.userType === 'STUDENT' ? '학생 개인 정보' : '교사 개인 정보'}
            </SectionTitle>
            
            <FieldWrapper>
              <FormGroup>
                <Label htmlFor="gender">성별<RequiredMark>*</RequiredMark></Label>
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
                <Label htmlFor="birthDate">생년월일<RequiredMark>*</RequiredMark></Label>
                <DateInput
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FieldWrapper>

            <FormGroup>
              <Label htmlFor="contact">연락처<RequiredMark>*</RequiredMark></Label>
              <Input
                type="tel"
                id="contact"
                name="contact"
                placeholder="000-0000-0000"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <InputNote>하이픈(-) 포함하여 입력해주세요</InputNote>
            </FormGroup>
          </FormSection>
        )}

        {currentStep === Step.StudentDetails && formData.userType === 'STUDENT' && (
          <FormSection>
            <SectionTitle>학생 추가 정보</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="age">나이<RequiredMark>*</RequiredMark></Label>
              <Input
                type="number"
                id="age"
                name="age"
                min="6"
                max="20"
                placeholder="나이 입력"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">주소<RequiredMark>*</RequiredMark></Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="주소를 입력하세요"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="parentContact">학부모 연락처<RequiredMark>*</RequiredMark></Label>
              <Input
                type="tel"
                id="parentContact"
                name="parentContact"
                placeholder="000-0000-0000"
                value={formData.parentContact}
                onChange={handleChange}
                required
              />
              <InputNote>비상 연락처로 사용됩니다</InputNote>
            </FormGroup>
          </FormSection>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonGroup>
          {currentStep === Step.UserType ? (
            <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          ) : (
            <PrevButton type="button" onClick={handlePrev}>이전</PrevButton>
          )}
          {isLastStep() ? (
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? '처리 중...' : '가입하기'}
            </SubmitButton>
          ) : (
            <NextButton type="button" onClick={handleNextClick}>다음</NextButton>
          )}
        </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupModal;
