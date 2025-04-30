// 이 파일은 UserInfoModal과 SignupModal의 타입을 통합하기 위한 구조 준비를 위해 생성되었습니다.
// 코드 내용을 수정하지 않고 구조만 개선하는 작업이므로, 실제 통합 코드는 구현하지 않았습니다.
// 추후 리팩토링 시 참고하세요.

// 사용자 역할 타입
export type UserRole = 'student' | 'teacher' | 'parent';

// 인증 모달 공통 속성
export interface UserAuthBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// 회원가입 모달 속성
export interface SignupModalProps extends UserAuthBaseProps {
  initialRole?: UserRole;
}

// 사용자 정보 모달 속성
export interface UserInfoModalProps extends UserAuthBaseProps {
  kakaoToken?: string;
}

// 통합 모달 속성
export interface UserAuthModalProps extends UserAuthBaseProps {
  modalType: 'signup' | 'userInfo';
  initialRole?: UserRole;
  kakaoToken?: string;
}

// 폼 데이터 인터페이스
export interface UserFormData {
  userType: UserRole;
  userName: string;
  grade?: number;
  classNum?: number;
  number?: number;
  age?: number;
  address?: string;
  gender?: string;
  birthDate?: string;
  contact?: string;
  parentContact?: string;
  childName?: string; // 학부모 전용 필드
}
