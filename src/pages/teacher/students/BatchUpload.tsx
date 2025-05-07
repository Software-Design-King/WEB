import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { colors } from '../../../components/common/Common.styles';
import * as XLSX from 'xlsx';

// 학생 데이터 인터페이스
interface StudentData {
  studentNumber: string; // 번호
  name: string;
  contact: string;
  note: string;
}

interface BatchUploadProps {
  onUpload: (students: StudentData[]) => void;
  onCancel: () => void;
}

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const UploadArea = styled.div`
  border: 2px dashed ${colors.grey[300]};
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  background-color: ${colors.grey[50]};
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${colors.primary.main};
    background-color: ${colors.primary.light + '10'};
  }
`;

const FileInputLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
  color: ${colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

const UploadText = styled.div`
  color: ${colors.text.secondary};
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${(props) => props.primary ? colors.primary.main : 'white'};
  color: ${(props) => props.primary ? 'white' : colors.text.secondary};
  border: 1px solid ${(props) => props.primary ? 'transparent' : colors.grey[300]};
  
  &:hover {
    background-color: ${(props) => props.primary ? colors.primary.dark : colors.grey[100]};
  }
`;

const PreviewContainer = styled.div`
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PreviewTitle = styled.div`
  padding: 1rem;
  background-color: ${colors.grey[100]};
  font-weight: 600;
  color: ${colors.text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewCount = styled.span`
  font-size: 0.85rem;
  color: ${colors.text.secondary};
  font-weight: 500;
`;

const PreviewTable = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ width?: string }>`
  padding: 0.75rem;
  text-align: left;
  background-color: ${colors.grey[50]};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.text.secondary};
  position: sticky;
  top: 0;
  width: ${props => props.width || 'auto'};
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${colors.grey[100]};
  font-size: 0.9rem;
  color: ${colors.text.primary};
`;

const TemplateLink = styled.a`
  color: ${colors.primary.main};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const HelpText = styled.div`
  font-size: 0.85rem;
  color: ${colors.text.secondary};
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: ${colors.info.light};
  border-radius: 8px;
  border-left: 3px solid ${colors.info.main};
`;

const BatchUpload: React.FC<BatchUploadProps> = ({ onUpload, onCancel }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert the sheet to JSON
        interface ExcelRowData {
          [key: string]: string | number;
        }
        
        const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(worksheet);
        
        // Map the data to our student interface
        const mappedData: StudentData[] = jsonData.map((row) => ({
          studentNumber: row['번호'] || row['studentNumber'] || '',
          name: row['이름'] || row['name'] || '',
          contact: row['연락처'] || row['contact'] || '',
          note: row['특이사항'] || row['note'] || '',
        }));
        
        setStudents(mappedData);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('파일을 읽는 중 오류가 발생했습니다. 올바른 형식인지 확인해주세요.');
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (students.length === 0) {
      alert('업로드할 학생 데이터가 없습니다.');
      return;
    }
    
    onUpload(students);
  };

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        '번호': '1',
        '이름': '권도훈',
        '연락처': '010-1234-5678',
        '특이사항': ''
      }
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '학생목록');
    
    XLSX.writeFile(workbook, '학생목록_템플릿.xlsx');
  };

  return (
    <Container>
      <UploadArea 
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM8 13H10.55V16H13.45V13H16L12 9L8 13Z" 
              fill={colors.primary.main} />
          </svg>
        </UploadIcon>
        <FileInputLabel>
          {fileName ? fileName : '파일을 선택하거나 이곳에 드래그하세요'}
        </FileInputLabel>
        <UploadText>Excel 또는 CSV 파일만 지원합니다</UploadText>
        
        <FileInput 
          type="file" 
          ref={fileInputRef}
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
        />
        
        <TemplateLink onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill={colors.primary.main} />
          </svg>
          템플릿 다운로드
        </TemplateLink>
      </UploadArea>
      
      <HelpText>
        학생 정보를 대량으로 추가하려면 템플릿을 다운로드하여 정보를 입력한 후 업로드하세요.
        '번호'와 '이름'은 필수 항목입니다.
      </HelpText>
      
      {students.length > 0 && (
        <PreviewContainer>
          <PreviewTitle>
            학생 정보 미리보기
            <PreviewCount>{students.length}명의 학생 데이터</PreviewCount>
          </PreviewTitle>
          <PreviewTable>
            <Table>
              <thead>
                <tr>
                  <Th width="10%">번호</Th>
                  <Th width="25%">이름</Th>
                  <Th width="20%">연락처</Th>
                  <Th width="45%">특이사항</Th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <Td>{student.studentNumber}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.contact}</Td>
                    <Td>{student.note || '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </PreviewTable>
        </PreviewContainer>
      )}
      
      <ButtonContainer>
        <Button onClick={onCancel}>취소</Button>
        <Button primary onClick={handleSubmit}>학생 추가하기</Button>
      </ButtonContainer>
    </Container>
  );
};

export default BatchUpload;
