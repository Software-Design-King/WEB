import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { colors } from "../common/Common.styles";
import { getStudentList, Student } from "../../apis/student";
import { Avatar, Spin, Empty, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

interface StudentSidebarProps {
  onSelectStudent: (studentId: string) => void;
  selectedStudentId: string;
}

const SidebarContainer = styled.div`
  width: 280px;
  height: 100%;
  background-color: ${colors.background.paper};
  border-right: 1px solid ${colors.grey[200]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0;
`;

const SearchContainer = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const StudentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  max-height: calc(
    100vh - 200px
  ); /* 적절한 높이 제한 - 헤더와 검색창 등 고려 */
`;

const StudentItem = styled.div<{ active: boolean }>`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.active ? colors.primary.light + "30" : "transparent"};
  border-left: 3px solid
    ${(props) => (props.active ? colors.primary.main : "transparent")};

  &:hover {
    background-color: ${(props) =>
      props.active ? colors.primary.light + "30" : colors.grey[100]};
  }
`;

const StudentInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudentName = styled.span`
  font-weight: 600;
  color: ${colors.text.primary};
`;

const StudentClass = styled.span`
  font-size: 0.8rem;
  color: ${colors.text.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
`;

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  onSelectStudent,
  selectedStudentId,
}) => {
  // 학생 목록 상태 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 학생 목록 가져오기
  const fetchStudents = async () => {
    setIsApiLoading(true);
    setError(null);
    try {
      const response = await getStudentList();

      if (response.code === 20000) {
        console.log("학생 목록 조회 성공:", response.data);
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } else {
        setError(`데이터를 불러오는데 실패했습니다: ${response.message}`);
      }
    } catch (err) {
      console.error("학생 목록을 불러오는데 실패했습니다:", err);
      setError(
        "학생 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsApiLoading(false);
    }
  };

  // 컴포넌트 마운트 시 학생 목록 가져오기
  useEffect(() => {
    fetchStudents();
  }, []);

  // 검색어 필터링
  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SectionTitle>학생 목록</SectionTitle>
      </SidebarHeader>
      <SearchContainer>
        <Input
          placeholder="학생 이름 검색"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </SearchContainer>
      <StudentList>
        {isApiLoading ? (
          <LoadingContainer>
            <Spin tip="학생 목록을 불러오는 중..." />
          </LoadingContainer>
        ) : error ? (
          <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : filteredStudents.length === 0 ? (
          <Empty
            description="학생 목록이 없습니다."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          filteredStudents.map((student) => (
            <StudentItem
              key={student.studentId.toString()}
              active={selectedStudentId === student.studentId.toString()}
              onClick={() => onSelectStudent(student.studentId.toString())}
            >
              <Avatar icon={<UserOutlined />} />
              <StudentInfoContainer>
                <StudentName>{student.name}</StudentName>
              </StudentInfoContainer>
            </StudentItem>
          ))
        )}
      </StudentList>
    </SidebarContainer>
  );
};

export default StudentSidebar;
