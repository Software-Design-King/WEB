import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";

// 헤더 영역
export const Header = styled.div`
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
export const Title = styled.h1`
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
export const AddButton = styled.button`
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
export const TableContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  padding: 0;
  
  &:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06);
  }
`;

// 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
`;

// 테이블 헤더
export const TableHeader = styled.th<{ width?: string }>`
  text-align: left;
  padding: 1.4rem 1.5rem;
  background-color: ${colors.grey[50]};
  color: ${colors.text.secondary};
  font-weight: 600;
  font-size: 0.85rem;
  width: ${(props) => props.width || "auto"};
  white-space: nowrap;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  position: relative;
  border-bottom: 1px solid ${colors.grey[200]};
`;

// 테이블 셀
export const TableCell = styled.td`
  padding: 1.4rem 1.5rem;
  border-bottom: 1px solid ${colors.grey[100]};
  color: ${colors.text.primary};
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
`;

// 테이블 행
export const TableRow = styled.tr`
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.primary.light}15;
    td {
      color: ${colors.primary.dark};
    }
  }
  
  &:active {
    background-color: ${colors.primary.light}20;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

// 순번 셀
const RowNumberCell = styled.td`
  padding: 1.2rem 1rem 1.2rem 1.5rem;
  border-bottom: 1px solid ${colors.grey[100]};
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 600;
  width: 50px;
  text-align: center;
`;

// 학생 ID 셀
export const StudentIdCell = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid ${colors.grey[100]};
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 500;
  width: 80px;
`;

// 학생 이름 셀
export const StudentNameCell = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid ${colors.grey[100]};
  color: ${colors.text.primary};
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 학생 이름 아바타
const NameAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${colors.primary.light};
  color: ${colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

// 액션 버튼 (삭제 등)
export const ActionButton = styled.button<{ color?: string }>`
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
export const EmptyState = styled.div`
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
export const ModalOverlay = styled.div`
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
export const Modal = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

// 모달 헤더
export const ModalHeader = styled.div`
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
export const CloseButton = styled.button`
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
export const ModalContent = styled.div`
  padding: 1.5rem;
`;

// 폼 그룹
export const FormGroup = styled.div`
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
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${colors.grey[200]};
`;

// 취소 버튼
export const CancelButton = styled.button`
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
export const SaveButton = styled.button`
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

// 학생 카드 헤더
export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

// 학생 이름
export const CardName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
  line-height: 1.3;
`;

// 학생 아바타
export const CardAvatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${colors.primary.light};
  color: ${colors.primary.main};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// 학생 ID
export const CardId = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  span {
    font-weight: 600;
    background-color: ${colors.grey[100]};
    border-radius: 12px;
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }
`;

// 학생 카드
export const StudentCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
  border: 1px solid ${colors.grey[100]};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
    border-color: ${colors.grey[200]};
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

// 학생 카드 그리드
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// 페이지네이션
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

export const PageButton = styled.button<{ active?: boolean }>`
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

// 학생 상세 정보 모달의 항목 스타일
export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${colors.grey[200]};
  
  &:last-of-type {
    border-bottom: none;
  }
  
  span {
    color: ${colors.text.secondary};
    font-weight: 500;
  }
  
  strong {
    color: ${colors.text.primary};
    font-weight: 600;
  }
`;

// 검색 박스
export const SearchBox = styled.div`
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

// 툴바 섹션
export const Toolbar = styled.div`
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

// 버튼 그룹
export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

// 모드 전환 탭
export const ViewTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

export const ViewTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? colors.primary.main : colors.text.secondary)};
  border-bottom: 2px solid ${(props) => (props.active ? colors.primary.main : 'transparent')};
  background-color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

// 드롭다운 메뉴
export const DropdownButton = styled.button`
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

// 모드 전환 탭
export const TabbedContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.grey[200]};
  margin-bottom: 1rem;
`;

const TabContent = styled.div`
  padding: 1rem 0;
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

// 기본 버튼
const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 콘텐트 래퍼
const ContentWrapper = styled.div`
  padding: 1.5rem;
`;

// 모드 전환 버튼
const ViewToggle = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.grey[200]};
`;

const ViewModeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? colors.primary.main : 'white'};
  color: ${props => props.active ? 'white' : colors.text.secondary};
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? colors.primary.dark : colors.grey[50]};
  }
`;

// 검색 바
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.grey[200]};
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 3px ${colors.primary.light}30;
  }
`;

// 카드 콘텐트 관련 스타일
const CardContent = styled.div`
  padding: 0.75rem 0;
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
  padding: 0.75rem 0;
  margin-top: auto;
  justify-content: flex-end;
`;

export const ClassroomStudentsStyles = {
  Header,
  Title,
  SearchBox,
  ViewTabs,
  ViewTab,
  TabbedContent,
  TabHeader,
  TabContent,
  ModalTab,
  ButtonGroup,
  AddButton,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  RowNumberCell,
  StudentIdCell,
  StudentNameCell,
  NameAvatar,
  ActionButton,
  Button,
  CancelButton,
  SaveButton,
  EmptyState,
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  ModalContent,
  ModalFooter,
  FormGroup,
  ContentWrapper,
  Toolbar,
  SearchBar,
  SearchInput,
  ViewToggle,
  ViewModeButton,
  CardGrid,
  StudentCard,
  CardHeader,
  CardAvatar,
  CardName,
  CardId,
  CardContent,
  CardDetail,
  CardIcon,
  CardText,
  CardFooter,
  Pagination,
  PageButton,
  DropdownButton,
  DetailItem
};
