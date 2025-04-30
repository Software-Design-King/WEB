// 이 파일은 UserInfoModal과 SignupModal을 통합하기 위한 구조 준비를 위해 생성되었습니다.
// 코드 내용을 수정하지 않고 구조만 개선하는 작업이므로, 실제 통합 코드는 구현하지 않았습니다.
// 추후 리팩토링 시 참고하세요.

import React from 'react';
import UserInfoModal from './UserInfoModal';
import SignupModal from './SignupModal';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'student' | 'teacher' | 'parent';
  onSubmit: (data: any) => void;
  kakaoToken?: string;
  modalType: 'signup' | 'userInfo';
}

/**
 * 통합된 사용자 인증 모달
 * 
 * 추후 UserInfoModal과 SignupModal을 통합하여 사용하기 위한 컴포넌트입니다.
 * 현재는 코드 수정 없이 구조만 개선하는 단계에서 생성된 파일입니다.
 * 
 * @param props 모달 속성
 * @returns 모달 컴포넌트
 */
const UserAuthModal: React.FC<UserAuthModalProps> = (props) => {
  // 모달 타입에 따라 적절한 컴포넌트 렌더링
  if (props.modalType === 'userInfo') {
    return (
      <UserInfoModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={props.onSubmit}
        kakaoToken={props.kakaoToken}
      />
    );
  } else {
    return (
      <SignupModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={props.onSubmit}
      />
    );
  }
};

export default UserAuthModal;
