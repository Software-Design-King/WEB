// 이 파일은 UserInfoModal과 SignupModal의 스타일을 통합하기 위한 구조 준비를 위해 생성되었습니다.
// 코드 내용을 수정하지 않고 구조만 개선하는 작업이므로, 실제 통합 코드는 구현하지 않았습니다.
// 추후 리팩토링 시 참고하세요.

import styled from "@emotion/styled";
import { colors } from "../../../../components/common/Common.styles";

// 공통 스타일 정의를 위한 파일입니다.
// 추후 리팩토링 시 두 모달의 중복 스타일을 여기로 통합할 수 있습니다.

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: ${colors.primary};
  margin: 0;
`;

// 추가 공통 스타일은 추후 통합 시 정의할 수 있습니다.
