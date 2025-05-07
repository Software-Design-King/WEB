import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";

// 헤더 영역
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0.5rem 0;

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
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background-color: ${colors.primary.main};
    border-radius: 1.5px;
  }
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
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

// 테이블 컨테이너
const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
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
    background-color: white;
    color: ${colors.text.primary};

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
// 툴바 섹션
const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// 검색 영역
const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.grey[400]};
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    border: 1px solid ${colors.grey[200]};
    font-size: 0.9rem;
    transition: all 0.2s;
    background-color: white;
    color: ${colors.text.primary};
    
    &:focus {
      outline: none;
      border-color: ${colors.primary.main};
      box-shadow: 0 0 0 3px ${colors.primary.light}40;
    }
  }
`;

// 버튼 그룹
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// 모드 전환 탭
const ViewTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const ViewTab = styled.div<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? colors.primary.main : colors.text.secondary)};
  border-bottom: 2px solid ${(props) => (props.active ? colors.primary.main : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

// 학생 카드 그리드
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// 학생 카드
const StudentCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${colors.grey[100]};
`;

const CardName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

const CardId = styled.div`
  font-size: 0.85rem;
  color: ${colors.text.secondary};
  margin-top: 0.25rem;
`;

const CardContent = styled.div`
  padding: 0.75rem 1.25rem 1.25rem;
`;

const CardDetail = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardIcon = styled.div`
  margin-right: 0.75rem;
  color: ${colors.primary.main};
`;

const CardText = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.primary};
  line-height: 1.4;
`;

const CardFooter = styled.div`
  display: flex;
  padding: 0.75rem 1.25rem;
  background-color: ${colors.grey[50]};
  border-top: 1px solid ${colors.grey[100]};
  justify-content: flex-end;
`;

// 모달 개선
const ModalTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const ModalTab = styled.div<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? colors.primary.main : colors.text.secondary)};
  border-bottom: 2px solid ${(props) => (props.active ? colors.primary.main : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

// 페이지네이션
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => (props.active ? colors.primary.main : 'white')};
  color: ${(props) => (props.active ? 'white' : colors.text.primary)};
  border: 1px solid ${(props) => (props.active ? colors.primary.main : colors.grey[200])};
  
  &:hover {
    background-color: ${(props) => (props.active ? colors.primary.dark : colors.grey[100])};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 드롭다운 메뉴
const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  color: ${colors.text.primary};
  border: 1px solid ${colors.grey[200]};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${colors.grey[50]};
  }
`;

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
  Toolbar,
  SearchBox,
  ButtonGroup,
  ViewTabs,
  ViewTab,
  CardGrid,
  StudentCard,
  CardHeader,
  CardName,
  CardId,
  CardContent,
  CardDetail,
  CardIcon,
  CardText,
  CardFooter,
  ModalTabs,
  ModalTab,
  Pagination,
  PageButton,
  DropdownButton,
};
