import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";

// 헤더 영역
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// 페이지 제목
const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
`;

// 학생 추가 버튼
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${colors.primary.main};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary.dark};
  }
`;

// 테이블 컨테이너
const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

// 테이블
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// 테이블 헤더
const TableHeader = styled.th<{ width?: string }>`
  text-align: left;
  padding: 1rem;
  background-color: ${colors.grey[100]};
  color: ${colors.text.secondary};
  font-weight: 600;
  font-size: 0.9rem;
  width: ${(props) => props.width || "auto"};
  white-space: nowrap;
`;

// 테이블 셀
const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
  color: ${colors.text.primary};
  font-size: 0.95rem;
`;

// 액션 버튼 (삭제 등)
const ActionButton = styled.button<{ color?: string }>`
  background-color: transparent;
  color: ${(props) => props.color || colors.primary.main};
  border: 1px solid ${(props) => props.color || colors.primary.main};
  border-radius: 4px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.color || colors.primary.main};
    color: white;
  }
`;

// 데이터 없을 때 표시
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  p {
    margin-top: 1rem;
    color: ${colors.text.secondary};
    font-size: 1rem;
  }
`;

// 모달 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// 모달
const Modal = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

// 모달 헤더
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.grey[200]};

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.text.primary};
  }
`;

// 닫기 버튼
const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.grey[100]};
  }
`;

// 모달 내용
const ModalContent = styled.div`
  padding: 1.5rem;
`;

// 폼 그룹
const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${colors.text.secondary};
    font-size: 0.9rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.95rem;
    border: 1px solid ${colors.grey[300]};
    border-radius: 8px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: ${colors.primary.main};
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

// 모달 푸터
const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${colors.grey[200]};
`;

// 취소 버튼
const CancelButton = styled.button`
  background-color: white;
  color: ${colors.text.secondary};
  border: 1px solid ${colors.grey[300]};
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${colors.grey[100]};
  }
`;

// 저장 버튼
const SaveButton = styled.button`
  background-color: ${colors.primary.main};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary.dark};
  }
`;

// 스타일 컴포넌트 내보내기
export const ClassroomStudentsStyles = {
  Header,
  Title,
  AddButton,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  ActionButton,
  EmptyState,
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  ModalContent,
  FormGroup,
  ModalFooter,
  CancelButton,
  SaveButton,
};
