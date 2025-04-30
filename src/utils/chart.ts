// 차트 관련 유틸리티 함수

/**
 * 레이더 차트용 데이터 포맷팅
 */
export const prepareRadarChartData = (gradesData: any[]) => {
  if (!gradesData || gradesData.length === 0) {
    return [];
  }
  
  const subjects = [...new Set(gradesData.map(item => item.subject))];
  
  return subjects.map(subject => {
    const subjectData = gradesData.find(item => item.subject === subject);
    return {
      subject,
      score: subjectData?.score || 0,
    };
  });
};

/**
 * 막대 차트용 데이터 포맷팅
 */
export const prepareBarChartData = (gradesData: any[]) => {
  if (!gradesData || gradesData.length === 0) {
    return [];
  }
  
  return gradesData.map(item => ({
    name: item.subject,
    score: item.score
  }));
};

/**
 * 성적 요약 정보 계산
 */
export const calculateGradeSummary = (gradesData: any[]) => {
  if (!gradesData || gradesData.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      totalSubjects: 0
    };
  }
  
  const scores = gradesData.map(item => item.score);
  
  return {
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    highest: Math.max(...scores),
    lowest: Math.min(...scores),
    totalSubjects: gradesData.length
  };
};
