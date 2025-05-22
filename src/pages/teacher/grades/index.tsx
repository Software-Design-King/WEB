import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Select,
  Table,
  Input,
  Button,
  Space,
  Divider,
  Card,
  Avatar,
  Spin,
  Empty,
  message,
  Modal,
  Form,
  InputNumber,
  Descriptions,
  Tabs,
  List,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, FileSearchOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
// 로컬 스타일 컴포넌트 사용
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";

// Subject 타입은 student API에서 import되어 있음

import {
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import { colors } from "../../../components/common/Common.styles";
import { useUserStore } from "../../../stores/userStore";
import { getStudentList, getStudentScore, editStudentScore, registerStudentScore, Student, StudentScoreResponse, RegisterScoreRequest, Subject } from "../../../apis/student";

// 스타일 컴포넌트
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledSelect = styled(Select)`
  min-width: 150px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledSubSectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 1.5rem 0 1rem;
`;

const GradeStatContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  height: 350px;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatItem = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

// 학생 성적 데이터 형식으로 변환하는 함수
const transformScoreData = (scoreData: any) => {
  const processedData: any = {};
  const allSubjects: string[] = [];
  const allExamTypes: string[] = [];
  
  // 성적 데이터가 없거나 형식이 다른 경우 처리
  if (!scoreData || !scoreData.scoresByGradeAndSemester) {
    console.error('성적 데이터 형식이 올바르지 않습니다:', scoreData);
    return { processedData: {}, allSubjects: [], allExamTypes: [] };
  }
  
  // 과목 및 시험 유형 수집
  Object.entries(scoreData.scoresByGradeAndSemester).forEach(([grade, semesters]) => {
    Object.entries(semesters).forEach(([semester, data]: [string, any]) => {
      if (data.subjects && Array.isArray(data.subjects)) {
        data.subjects.forEach((subject: any) => {
          if (!allSubjects.includes(subject.name)) {
            allSubjects.push(subject.name);
          }
          if (!allExamTypes.includes(subject.examType)) {
            allExamTypes.push(subject.examType);
          }
        });
      }
    });
  });
  
  // 학년/학기별 데이터 가공
  Object.entries(scoreData.scoresByGradeAndSemester).forEach(([grade, semesters]) => {
    processedData[grade] = {};
    
    Object.entries(semesters).forEach(([semester, data]: [string, any]) => {
      processedData[grade][semester] = {
        totalScore: data.total || data.totalScore || 0,
        averageScore: data.average || data.averageScore || 0,
        wholeRank: data.wholeRank || '-',
        classRank: data.classRank || '-',
        subjects: data.subjects
      };
    });
  });
  
  return {
    processedData,
    allSubjects,
    allExamTypes
  };
};

const TeacherGradesPage: React.FC = () => {
  // 학생 데이터 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 성적 데이터 관리
  const [scoreData, setScoreData] = useState<StudentScoreResponse | null>(null);
  const [processedScoreData, setProcessedScoreData] = useState<Record<string, any> | null>(null);
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [examTypeList, setExamTypeList] = useState<string[]>([]);
  
  // 편집 상태
  const [editingSubject, setEditingSubject] = useState<string>("");
  const [editingGrade, setEditingGrade] = useState<string>("");
  const [editingSemester, setEditingSemester] = useState<string>("");
  const [editingExamType, setEditingExamType] = useState<string>("");
  
  // 모달 상태
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  
  // 전체 과목 편집을 위한 상태
  const [allSubjectsData, setAllSubjectsData] = useState<Array<{name: string, score: number}>>([]);
  
  // 상세 모달 상태
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  
  // 성적 등록 상태
  const [semester, setSemester] = useState<number>(1);
  const [newSubjects, setNewSubjects] = useState<{name: string; score: number; examType: string}[]>([
    { name: '', score: 0, examType: '중간고사' }
  ]);
  
  const userInfo = useUserStore((state) => state.userInfo);
  
  // 학생 목록 가져오기
  useEffect(() => {
    const fetchStudentList = async () => {
      setIsLoading(true);
      try {
        const response = await getStudentList();
        if (response.code === 20000) {
          console.log('학생 목록 가져오기 성공:', response.data);
          setStudents(response.data.students);
        } else {
          setError('학생 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('학생 목록 조회 오류:', err);
        setError('학생 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentList();
  }, []);
  
  // 학생 변경 시 성적 데이터 가져오기
  useEffect(() => {
    if (selectedStudent) {
      const fetchStudentScore = async () => {
        setIsLoading(true);
        try {
          const response = await getStudentScore(selectedStudent);
          if (response.code === 20000) {
            console.log('학생 성적 조회 성공:', response);
            console.log('성적 데이터 구조:', response.data);
            
            // 디버깅 - 자세한 데이터 구조 확인
            if (response.data && response.data.scoresByGradeAndSemester) {
              console.log('개선된 데이터 구조 확인 - scoresByGradeAndSemester 존재:', !!response.data.scoresByGradeAndSemester);
              console.log('전체 데이터 구조:', JSON.stringify(response.data, null, 2));
              
              Object.entries(response.data.scoresByGradeAndSemester).forEach(([grade, semesters]) => {
                console.log(`학년: ${grade}, 학기 데이터:`, semesters);
                
                Object.entries(semesters).forEach(([semester, data]) => {
                  console.log(`${grade}학년 ${semester}학기 과목 정보:`, data);
                  
                  if (data.subjects && Array.isArray(data.subjects)) {
                    console.log(`${grade}학년 ${semester}학기 과목 개수:`, data.subjects.length);
                    
                    // examType 값 확인
                    data.subjects.forEach(subject => {
                      console.log(`과목: ${subject.name}, 점수: ${subject.score}, 시험유형: ${subject.examType}`);
                    });
                  } else {
                    console.log(`${grade}학년 ${semester}학기 과목 데이터 없음`);
                  }
                });
              });
            } else {
              console.log('성적 데이터 구조가 아예 없음');
            }
            
            // scoreData 상태 업데이트 - response.data를 저장
            setScoreData(response.data);
            
            // 성적 데이터 가공
            try {
              const { processedData, allSubjects, allExamTypes } = transformScoreData(response.data);
              setProcessedScoreData(processedData);
              setSubjectList(allSubjects);
              setExamTypeList(allExamTypes);
              console.log("변환된 성적 데이터:", processedData);
            } catch (transformError) {
              console.error("성적 데이터 변환 중 오류:", transformError);
              setError("성적 데이터 변환 중 오류가 발생했습니다.");
            }
          } else {
            console.error('학생 성적 조회 실패:', response);
            setError('학생 성적을 불러오는데 실패했습니다.');
          }
        } catch (err) {
          console.error('학생 성적 조회 오류:', err);
          setError('학생 성적을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchStudentScore();
    }
  }, [selectedStudent]);
  
  // 상담 기록 조회
  const handleViewConsultation = (studentId: number) => {
    // 상담 기록 조회 처리
    setSelectedRowData(studentId);
    setIsDetailModalVisible(true);
  };
  
  // 전체 과목 편집 핸들러 (시험 유형별 편집)
  const handleEditAllScores = (grade: string, semester: string, examType: string) => {
    if (!scoreData?.scoresByGradeAndSemester) {
      message.error('성적 데이터가 없습니다');
      return;
    }
    
    // 선택한 학년/학기/시험유형에 해당하는 과목 데이터 추출
    const subjects: Array<{name: string, score: number}> = [];
    
    const semesterData = scoreData.scoresByGradeAndSemester[grade]?.[semester];
    if (semesterData?.subjects && Array.isArray(semesterData.subjects)) {
      // 학기 데이터에서 모든 과목 추출
      const subjectMap = new Map<string, number>();
      
      // 선택한 시험 유형의 데이터만 추출
      semesterData.subjects.forEach((subjectData: any) => {
        if (subjectData.examType === examType) {
          subjectMap.set(subjectData.name, parseFloat(subjectData.score.toString()));
        }
      });
      
      // 추출한 과목 데이터 준비
      for (const [name, score] of subjectMap.entries()) {
        subjects.push({ name, score });
      }
      
      // 과목이 없는 경우, 기본 과목 리스트 추가
      if (subjects.length === 0) {
        const defaultSubjects = ['국어', '영어', '수학', '과학', '사회'];
        defaultSubjects.forEach(subject => {
          subjects.push({ name: subject, score: 0 });
        });
      }
    }
    
    // 편집 상태 설정
    setEditingGrade(grade);
    setEditingSemester(semester);
    setEditingExamType(examType);
    setAllSubjectsData(subjects);
    
    // 모달 표시
    setIsEditModalVisible(true);
  };
  
  // 성적 편집 핸들러 (개별 과목 편집 - 이전 버전)
  const handleEditScore = (subject: string, grade: string, semester: string) => {
    // 현재 성적 데이터 찾기
    let currentMidtermScore = null;
    let currentFinalScore = null;
    
    if (scoreData?.scoresByGradeAndSemester) {
      const semesterData = scoreData.scoresByGradeAndSemester[grade]?.[semester];
      if (semesterData?.subjects && Array.isArray(semesterData.subjects)) {
        semesterData.subjects.forEach((subjectData: any) => {
          if (subjectData.name === subject) {
            if (subjectData.examType === '중간고사') {
              currentMidtermScore = parseFloat(subjectData.score.toString());
            } else if (subjectData.examType === '기말고사') {
              currentFinalScore = parseFloat(subjectData.score.toString());
            }
          }
        });
      }
    }
    
    // 편집할 과목정보 설정
    setEditingSubject(subject);
    setEditingGrade(grade);
    setEditingSemester(semester);
    
    // 폼 초기화
    editForm.setFieldsValue({
      midtermScore: currentMidtermScore,
      finalScore: currentFinalScore
    });
    
    // 모달 표시
    setIsEditModalVisible(true);
  };
  
  // 전체 과목 성적 저장 핸들러
  const handleSaveAllScores = async () => {
    try {
      if (!selectedStudent) {
        message.error('학생을 선택해주세요');
        return;
      }

      // 학기 번호 추출 (1학기, 2학기 형태에서 숫자만 추출)
      const semesterNumber = parseInt(editingSemester.replace(/[^0-9]/g, ''));
      
      // 모든 과목의 점수를 수집하여 Subject 배열로 변환
      const subjectsToUpdate: Subject[] = [];
      
      // 폼에서 수집한 데이터를 사용하여 업데이트할 과목 데이터 준비
      allSubjectsData.forEach((subject) => {
        if (subject.score !== undefined) {
          subjectsToUpdate.push({
            name: subject.name,
            score: subject.score,
            examType: editingExamType
          });
        }
      });
      
      if (subjectsToUpdate.length > 0) {
        // API 호출
        const response = await editStudentScore(selectedStudent, semesterNumber, subjectsToUpdate);
        
        if (response) {
          message.success('성적이 성공적으로 업데이트되었습니다');
          
          // 성적 데이터 다시 불러오기
          getStudentScore(selectedStudent).then((data) => {
            if (data.code === 20000) {
              console.log('새 성적 데이터 받음:', data);
              setScoreData(data.data);
              
              // 가공된 성적 데이터도 다시 처리
              const { processedData, allSubjects, allExamTypes } = transformScoreData(data.data);
              setProcessedScoreData(processedData);
              setSubjectList(allSubjects);
              setExamTypeList(allExamTypes);
            }
          });
          
          // 모달 닫기
          setIsEditModalVisible(false);
        }
      } else {
        message.warning('업데이트할 과목 데이터가 없습니다');
      }
    } catch (error) {
      console.error('성적 저장 중 오류 발생:', error);
      message.error('성적 저장 중 오류가 발생했습니다');
    }
  };
  
  // 과목별 성적 수정 핸들러
  const handleSubjectScoreChange = (index: number, value: number) => {
    const updatedSubjects = [...allSubjectsData];
    updatedSubjects[index].score = value;
    setAllSubjectsData(updatedSubjects);
  };
  
  // 개별 과목 성적 저장 핸들러 (이전 버전)
  const handleSaveScore = async () => {
    try {
      const values = await editForm.validateFields();
      const { midtermScore, finalScore } = values;
      
      // 편집할 과목 데이터 준비
      const subjectsToUpdate: Subject[] = [];
      
      // 중간고사 점수가 변경되었다면 추가
      if (midtermScore !== null) {
        subjectsToUpdate.push({
          name: editingSubject,
          score: midtermScore,
          examType: '중간고사'
        });
      }
      
      // 기말고사 점수가 변경되었다면 추가
      if (finalScore !== null) {
        subjectsToUpdate.push({
          name: editingSubject,
          score: finalScore,
          examType: '기말고사'
        });
      }
      
      if (subjectsToUpdate.length > 0 && selectedStudent) {
        // 학기 번호 추출 (1학기, 2학기 형태에서 숫자만 추출)
        const semesterNumber = parseInt(editingSemester.replace(/[^0-9]/g, ''));
        
        // API 호출
        const response = await editStudentScore(selectedStudent, semesterNumber, subjectsToUpdate);
        
        if (response) {
          message.success('성적이 성공적으로 업데이트되었습니다');
          
          // 성적 데이터 다시 불러오기
          if (selectedStudent) {
            getStudentScore(selectedStudent).then((data) => {
              if (data.code === 20000) {
                console.log('새 성적 데이터 받음:', data);
                setScoreData(data.data);
                
                // 가공된 성적 데이터도 다시 처리
                const { processedData, allSubjects, allExamTypes } = transformScoreData(data.data);
                setProcessedScoreData(processedData);
                setSubjectList(allSubjects);
                setExamTypeList(allExamTypes);
              }
            });
          }
          
          // 모달 닫기
          setIsEditModalVisible(false);
        }
      }
    } catch (error) {
      console.error('성적 저장 중 오류 발생:', error);
      message.error('성적 저장 중 오류가 발생했습니다');
    }
  };
  
  // 모달 취소 핸들러
  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };
  
  // 학생 선택 핸들러
  const handleStudentChange = (value: unknown) => {
    const studentId = value as number;
    setSelectedStudent(studentId);
  };
  
  // 성적 등록 모달 열기
  const showRegisterModal = () => {
    if (!selectedStudent) {
      message.warning('먼저 학생을 선택해주세요');
      return;
    }
    setIsRegisterModalVisible(true);
  };
  
  // 새 과목 추가
  const addNewSubject = () => {
    setNewSubjects([...newSubjects, { name: '', score: 0, examType: '중간고사' }]);
  };
  
  // 과목 정보 변경
  const handleSubjectChange = (index: number, field: string, value: string | number) => {
    const updatedSubjects = [...newSubjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setNewSubjects(updatedSubjects);
  };
  
  // 과목 삭제
  const removeSubject = (index: number) => {
    if (newSubjects.length <= 1) {
      message.warning('최소 한 개의 과목이 필요합니다');
      return;
    }
    const updatedSubjects = newSubjects.filter((_, i) => i !== index);
    setNewSubjects(updatedSubjects);
  };
  
  // 성적 등록 제출
  const handleRegisterScore = async () => {
    if (!selectedStudent) {
      message.error('학생을 선택해주세요');
      return;
    }
    
    // 유효성 검사
    if (newSubjects.some(subject => !subject.name.trim())) {
      message.error('모든 과목명을 입력해주세요');
      return;
    }
    
    if (newSubjects.some(subject => subject.score < 0 || subject.score > 100)) {
      message.error('점수는 0에서 100 사이여야 합니다');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 올바른 형식으로 데이터 구성
      const formattedSubjects = newSubjects.map(subject => ({
        name: subject.name,
        score: subject.score,
        examType: subject.examType
      }));
      
      const scoreData: RegisterScoreRequest = {
        semester,
        subjects: formattedSubjects
      };
      
      console.log('성적 등록 요청 데이터:', JSON.stringify(scoreData));
      
      const response = await registerStudentScore(selectedStudent, scoreData);
      
      if (response.code === 20000) {
        message.success('성적이 성공적으로 등록되었습니다');
        
        // 성적 데이터 새로고침
        const updatedScoreData = await getStudentScore(selectedStudent);
        if (updatedScoreData.code === 20000) {
          console.log('성적 등록 후 새 데이터 받음:', updatedScoreData);
          setScoreData(updatedScoreData.data);
          
          // 가공된 성적 데이터도 다시 처리
          const { processedData, allSubjects, allExamTypes } = transformScoreData(updatedScoreData.data);
          setProcessedScoreData(processedData);
          setSubjectList(allSubjects);
          setExamTypeList(allExamTypes);
        }
        
        // 모달 닫고 입력 필드 초기화
        setIsRegisterModalVisible(false);
        setSemester(1);
        setNewSubjects([{ name: '', score: 0, examType: '중간고사' }]);
      } else {
        message.error(`성적 등록 실패: ${response.message}`);
      }
    } catch (err) {
      console.error('성적 등록 오류:', err);
      message.error('성적 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 점수에 따른 색상 반환 함수
  const getScoreColor = (score: string | number) => {
    if (score === '-') return '#999';
    
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    if (isNaN(numScore)) return '#999';
    
    if (numScore >= 90) return colors.success.main;
    if (numScore >= 80) return colors.primary.main;
    if (numScore >= 70) return colors.warning.main;
    return colors.error.main;
  };

  return (
    <DashboardLayout
      userName={userInfo?.name || '교사'}
      userRole={'TEACHER' === userInfo?.userType ? '교사' : '관리자'}
      userInfo={userInfo?.roleInfo || ''}
      notificationCount={0}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        <PageContainer>
          <DashboardCard>
            <CardTitle>학생 성적 관리</CardTitle>

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spin size="large" tip="데이터를 불러오는 중..." />
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                {error}
              </div>
            ) : (
              <>
                <ControlsContainer>
                  <StyledSelect
                    placeholder="학생 선택"
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    style={{ width: 200 }}
                  >
                    {students.map((student) => (
                      <Select.Option key={student.id} value={student.id}>
                        {student.name}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                  
                  <Button 
                    type="primary" 
                    icon={<FileSearchOutlined />} 
                    onClick={showRegisterModal}
                  >
                    성적 등록
                  </Button>
                </ControlsContainer>

                {!selectedStudent ? (
                  <div style={{ padding: "2rem 0", textAlign: "center" }}>
                    학생을 선택해주세요.
                  </div>
                ) : !processedScoreData ? (
                  <div style={{ padding: "2rem 0", textAlign: "center" }}>
                    성적 데이터를 불러오는 중입니다...
                  </div>
                ) : (
                  <div>
                    {/* 성적 요약 섹션 */}
                    <StyledSubSectionTitle>성적 요약</StyledSubSectionTitle>

                    {/* 학년/학기별 요약 정보 */}
                    <div style={{ marginBottom: '2rem' }}>
                      {Object.entries(processedScoreData).map(([grade, semesters]) => {
                        return Object.entries(semesters as any).map(([semester, data]) => {
                          return (
                            <div 
                              key={`${grade}-${semester}`} 
                              style={{ 
                                background: 'white', 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                marginBottom: '1rem',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                              }}
                            >
                              <h3 style={{ margin: '0 0 1rem 0' }}>{`${grade}학년 ${semester}학기 성적`}</h3>
                              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <StatItem>
                                  <StatLabel>평균 점수</StatLabel>
                                  <StatValue>{(data as any).averageScore?.toFixed(1) || '0'}</StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>반 석차</StatLabel>
                                  <StatValue>{(data as any).classRank || '-'}등</StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>전체 석차</StatLabel>
                                  <StatValue>{(data as any).wholeRank || '-'}등</StatValue>
                                </StatItem>
                                <StatItem>
                                  <StatLabel>총점</StatLabel>
                                  <StatValue>{(data as any).totalScore || '-'}점</StatValue>
                                </StatItem>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>

                    {/* 학기별/시험유형별 성적 테이블 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <StyledSubSectionTitle style={{ margin: 0 }}>학기별 시험 성적</StyledSubSectionTitle>
                      
                      {/* 점수 색상 범례 */}
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', padding: '6px 10px', borderRadius: '5px', fontSize: '0.9em' }}>
                        <span style={{ color: colors.success.main, fontWeight: 'bold', marginRight: '8px' }}>● 90점 이상</span>
                        <span style={{ color: colors.primary.main, fontWeight: 'bold', marginRight: '8px' }}>● 80-89점</span>
                        <span style={{ color: colors.warning.main, fontWeight: 'bold', marginRight: '8px' }}>● 70-79점</span>
                        <span style={{ color: colors.error.main, fontWeight: 'bold' }}>● 70점 미만</span>
                      </div>
                    </div>
                    
                    {/* 학년/학기별로 구분하여 테이블 표시 */}
                    {(() => {
                      // 데이터가 없는 경우 처리
                      if (!processedScoreData) return null;
                                           // gradeSemesterGroups 정의
                      const gradeSemesterGroups: Record<string, {
                        grade: string,
                        semester: string,
                        title: string,
                        subjects: Record<string, Record<string, string | number>>
                      }> = {};

                      // 학년/학기별 데이터 분류
                      Object.entries(processedScoreData).forEach(([grade, semesters]) => {
                        Object.entries(semesters as Record<string, any>).forEach(([semester, data]) => {
                          const key = `${grade}_${semester}`;
                          if (!gradeSemesterGroups[key]) {
                            gradeSemesterGroups[key] = {
                              grade,
                              semester,
                              title: `${grade}학년 ${semester}학기`,
                              subjects: {}
                            };
                          }
                          
                          // 과목별로 중간/기말고사 점수 분류
                          if (data.subjects && Array.isArray(data.subjects)) {
                            data.subjects.forEach((subject: any) => {
                              if (!gradeSemesterGroups[key].subjects[subject.name]) {
                                gradeSemesterGroups[key].subjects[subject.name] = {
                                  '중간고사': '-',
                                  '기말고사': '-'
                                };
                              }
                              
                              // 시험 유형에 따라 점수 저장
                              if (subject.examType === '중간고사' || subject.examType === '기말고사') {
                                gradeSemesterGroups[key].subjects[subject.name][subject.examType] = subject.score;
                              }
                            });
                          }
                        });
                      });
                      
                      // 학기별로 테이블 반환
                      return Object.values(gradeSemesterGroups).map((gradeData, gradeIndex) => {
                        // 테이블용 데이터 변환
                        const tableData = Object.entries(gradeData.subjects).map(([subjectName, scores], index) => {
                          // 성적 변화율 계산
                          let changeRate = '-';
                          if (scores['중간고사'] !== '-' && scores['기말고사'] !== '-') {
                            const midtermScore = parseFloat(scores['중간고사'].toString());
                            const finalScore = parseFloat(scores['기말고사'].toString());
                            if (midtermScore > 0) {
                              const rate = ((finalScore - midtermScore) / midtermScore) * 100;
                              changeRate = rate.toFixed(1) + '%';
                            }
                          }
                          
                          // 상승/하락 여부에 따라 표시할 색상 결정
                          let changeRateColor = 'inherit';
                          if (changeRate !== '-') {
                            const rateValue = parseFloat(changeRate);
                            if (rateValue > 0) changeRateColor = 'green';
                            else if (rateValue < 0) changeRateColor = 'red';
                          }
                          
                          // 평균 계산
                          const average = scores['중간고사'] !== '-' && scores['기말고사'] !== '-' ? 
                            ((parseFloat(scores['중간고사'].toString()) + parseFloat(scores['기말고사'].toString())) / 2).toFixed(1) : '-';
                            
                          return {
                            key: `${gradeData.grade}_${gradeData.semester}_${subjectName}_${index}`,
                            subject: subjectName,
                            midterm: scores['중간고사'],
                            final: scores['기말고사'],
                            changeRate,
                            changeRateColor,
                            average
                          };
                        });
                        
                        return (
                          <div key={`grade_semester_${gradeIndex}`} style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                                {gradeData.title}
                              </h3>
                              <div>
                                <Button 
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditAllScores(gradeData.grade, gradeData.semester, '중간고사')}
                                  size="small"
                                  style={{ marginRight: '8px' }}
                                >
                                  중간고사 편집
                                </Button>
                                <Button 
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditAllScores(gradeData.grade, gradeData.semester, '기말고사')}
                                  size="small"
                                >
                                  기말고사 편집
                                </Button>
                              </div>
                            </div>
                            <Table
                              dataSource={tableData}
                              columns={[
                                { title: '과목명', dataIndex: 'subject', key: 'subject', width: '20%' },
                                { title: '중간고사', dataIndex: 'midterm', key: 'midterm', width: '20%',
                                  render: (score) => <span style={{ color: getScoreColor(score) }}>{score}</span> },
                                { title: '기말고사', dataIndex: 'final', key: 'final', width: '25%',
                                  render: (score, record) => {
                                    // 점수 변화 계산
                                    let scoreChange = null;
                                    if (record.midterm !== '-' && record.final !== '-') {
                                      const midtermScore = parseFloat(record.midterm.toString());
                                      const finalScore = parseFloat(record.final.toString());
                                      scoreChange = finalScore - midtermScore;
                                    }
                                    
                                    return (
                                      <div>
                                        <span style={{ color: getScoreColor(score) }}>{score}</span>
                                        {scoreChange !== null && (
                                          <span style={{
                                            marginLeft: '8px',
                                            color: scoreChange > 0 ? 'green' : scoreChange < 0 ? 'red' : 'gray',
                                            fontWeight: 'bold',
                                            fontSize: '0.9em'
                                          }}>
                                            ({scoreChange > 0 ? '↑' : scoreChange < 0 ? '↓' : ''} {Math.abs(scoreChange)})
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }
                                },
                                { title: '평균', dataIndex: 'average', key: 'average', width: '15%',
                                  render: (score) => <span style={{ color: getScoreColor(score), fontWeight: 'bold' }}>{score}</span> }
                              ]}
                              pagination={false}
                              locale={{
                                emptyText: <div>성적 데이터가 없습니다.</div>
                              }}
                              bordered
                              size="small"
                            />
                          </div>
                        );
                      });
                    })()}

                    {/* 그래프 보여주기 */}
                    <StyledSubSectionTitle style={{ marginTop: "2rem" }}>
                      과목별 점수 분석
                    </StyledSubSectionTitle>
                    <GradeStatContainer>
                      <ChartContainer>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart
                            outerRadius={90}
                            data={subjectList.map((subject) => {
                                      // 각 과목의 중간고사와 기말고사 점수 추출
                              let midtermScore = 0;
                              let finalScore = 0;
                              let hasMidterm = false;
                              let hasFinal = false;

                              // 실제 점수 데이터를 테이블에서 추출
                              if (scoreData?.scoresByGradeAndSemester) {
                                Object.entries(scoreData.scoresByGradeAndSemester).forEach(([_, semesters]) => {
                                  Object.entries(semesters as Record<string, any>).forEach(([_, data]) => {
                                    // 데이터가 있는지 확인
                                    if (data.subjects) {
                                      if (Array.isArray(data.subjects)) {
                                        // 배열 형태의 데이터 처리
                                        data.subjects.forEach((subjectData: any) => {
                                          if (subjectData.name === subject) {
                                            // 시험 유형에 따라 점수 분류
                                            if (subjectData.examType === '중간고사') {
                                              midtermScore = parseFloat(subjectData.score.toString());
                                              hasMidterm = true;
                                            } else if (subjectData.examType === '기말고사') {
                                              finalScore = parseFloat(subjectData.score.toString());
                                              hasFinal = true;
                                            }
                                          }
                                        });
                                      } else {
                                        // 객체 형태의 데이터 처리
                                        Object.entries(data.subjects).forEach(([subjectName, subjectData]) => {
                                          if (subjectName === subject) {
                                            const examType = (subjectData as any).examType;
                                            // 시험 유형에 따라 점수 분류
                                            if (examType === '중간고사') {
                                              midtermScore = parseFloat((subjectData as any).score.toString());
                                              hasMidterm = true;
                                            } else if (examType === '기말고사') {
                                              finalScore = parseFloat((subjectData as any).score.toString());
                                              hasFinal = true;
                                            }
                                          }
                                        });
                                      }
                                    }
                                  });
                                });
                              }
                              
                              // 평균 계산
                              const avgScore = (hasMidterm && hasFinal) ? (midtermScore + finalScore) / 2 : 
                                               hasMidterm ? midtermScore : 
                                               hasFinal ? finalScore : 0;
                              
                              return {
                                subject,
                                midterm: hasMidterm ? midtermScore : 0,
                                final: hasFinal ? finalScore : 0,
                                average: avgScore,
                                fullMark: 100,
                              };
                            })}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name="중간고사"
                              dataKey="midterm"
                              stroke="#8884d8"
                              fill="#8884d8"
                              fillOpacity={0.6}
                            />
                            <Radar
                              name="기말고사"
                              dataKey="final"
                              stroke="#82ca9d"
                              fill="#82ca9d"
                              fillOpacity={0.6}
                            />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                          </RadarChart>
                        </ResponsiveContainer>
                      </ChartContainer>

                      <StatsContainer>
                        {examTypeList.map((examType) => {
                          // 시험 유형별 평균 계산
                          let totalScore = 0;
                          let count = 0;
                          
                          // 원본 데이터(scoreData)에서 직접 추출
                          if (scoreData?.scoresByGradeAndSemester) {
                            Object.entries(scoreData.scoresByGradeAndSemester).forEach(([_, semesters]) => {
                              Object.entries(semesters as Record<string, any>).forEach(([_, data]) => {
                                // 데이터가 있는지 확인
                                if (data.subjects) {
                                  if (Array.isArray(data.subjects)) {
                                    // 배열 형태의 데이터 처리
                                    data.subjects.forEach((subjectData: any) => {
                                      if (subjectData.examType === examType) {
                                        const score = parseFloat(subjectData.score.toString());
                                        if (!isNaN(score)) {
                                          totalScore += score;
                                          count++;
                                        }
                                      }
                                    });
                                  } else {
                                    // 객체 형태의 데이터 처리
                                    Object.entries(data.subjects).forEach(([subjectName, subjectData]) => {
                                      if (subjectData.examType === examType) {
                                        const score = parseFloat(subjectData.score.toString());
                                        if (!isNaN(score)) {
                                          totalScore += score;
                                          count++;
                                        }
                                      }
                                    });
                                  }
                                }
                              });
                            });
                          }
                          
                          return (
                            <StatItem key={examType}>
                              <StatLabel>{examType} 평균</StatLabel>
                              <StatValue>
                                {count > 0 ? (totalScore / count).toFixed(1) : '-'}
                              </StatValue>
                            </StatItem>
                          );
                        })}
                      </StatsContainer>
                    </GradeStatContainer>
                  </div>
                )}
              </>
            )}
          </DashboardCard>
      
      {/* 성적 편집 모달 */}
      <Modal
        title={`${editingExamType} 성적 편집 (${editingGrade} ${editingSemester})`}
        open={isEditModalVisible}
        onOk={handleSaveAllScores}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {allSubjectsData.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={allSubjectsData}
            renderItem={(subject, index) => (
              <List.Item>
                <Row style={{ width: '100%' }}>
                  <Col span={12}>
                    <Typography.Text strong>{subject.name}</Typography.Text>
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      min={0}
                      max={100}
                      value={subject.score}
                      onChange={(value) => handleSubjectScoreChange(index, value as number)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        ) : (
          <Typography.Text>업데이트할 과목이 없습니다.</Typography.Text>
        )}
      </Modal>
      
      {/* 상세 성적 모달 */}
      <Modal
        title="학생 상세"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {processedScoreData && (
          <div>
            <h3>학년/학기별 성적 상세 정보</h3>
            <p>선택한 학생의 모든 학년/학기별 상세 성적 정보를 확인할 수 있습니다.</p>
            
            {Object.entries(processedScoreData).map(([grade, semesters]) => (
              <div key={grade} style={{ marginBottom: '30px' }}>
                <h4>{grade}학년</h4>
                
                {Object.entries(semesters as any).map(([semester, data]) => (
                  <div key={`${grade}-${semester}`} style={{ marginBottom: '20px' }}>
                    <h5>{semester}학기</h5>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <span><strong>총점:</strong> {(data as any).totalScore}</span>
                      <span style={{ marginLeft: '20px' }}><strong>평균:</strong> {Number((data as any).averageScore).toFixed(1)}</span>
                      <span style={{ marginLeft: '20px' }}><strong>전체순위:</strong> {(data as any).wholeRank}등</span>
                      <span style={{ marginLeft: '20px' }}><strong>반내순위:</strong> {(data as any).classRank}등</span>
                    </div>
                    
                    <Table
                      dataSource={Object.entries((data as any).subjects).map(([name, subject], index) => ({
                        key: index,
                        name,
                        score: (subject as any).score,
                        examType: (subject as any).examType
                      }))}
                      columns={[
                        { title: '과목명', dataIndex: 'name', key: 'name' },
                        { title: '시험유형', dataIndex: 'examType', key: 'examType' },
                        { title: '점수', dataIndex: 'score', key: 'score' },
                      ]}
                      pagination={false}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Modal>
      
      {/* 성적 등록 모달 */}
      <Modal
        title="학생 성적 등록"
        open={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsRegisterModalVisible(false)}>
            취소
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleRegisterScore}
            loading={isLoading}
          >
            등록
          </Button>,
        ]}
        width={700}
      >
        <div style={{ marginBottom: '20px' }}>
          <span style={{ marginRight: '10px' }}>학기:</span>
          <Select 
            value={semester} 
            onChange={value => setSemester(value)}
            style={{ width: '120px' }}
          >
            <Select.Option value={1}>1학기</Select.Option>
            <Select.Option value={2}>2학기</Select.Option>
          </Select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>과목 성적</h4>
            <Button type="dashed" onClick={addNewSubject} style={{ marginBottom: '10px' }}>
              과목 추가
            </Button>
          </div>

          {newSubjects.map((subject, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <Select
                placeholder="시험 유형"
                value={subject.examType}
                onChange={value => handleSubjectChange(index, 'examType', value)}
                style={{ width: '120px' }}
              >
                <Select.Option value="중간고사">중간고사</Select.Option>
                <Select.Option value="기말고사">기말고사</Select.Option>
              </Select>

              <Select
                placeholder="과목 선택"
                value={subject.name || undefined}
                onChange={value => handleSubjectChange(index, 'name', value)}
                style={{ width: '120px' }}
              >
                <Select.Option value="국어">국어</Select.Option>
                <Select.Option value="영어">영어</Select.Option>
                <Select.Option value="수학">수학</Select.Option>
                <Select.Option value="과학">과학</Select.Option>
                <Select.Option value="사회">사회</Select.Option>
                <Select.Option value="체육">체육</Select.Option>
              </Select>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '5px' }}>점수:</span>
                <input
                  type="number"
                  value={subject.score}
                  onChange={e => handleSubjectChange(index, 'score', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  style={{ width: '60px', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '2px' }}
                />
              </div>

              <Button 
                danger 
                type="link" 
                onClick={() => removeSubject(index)} 
                style={{ padding: 0, marginLeft: 'auto' }}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      </Modal>
        </PageContainer>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default TeacherGradesPage;
