import DashboardLayout from "../../../components/layout/DashboardLayout";
import StudentSidebar from "../../../components/layout/StudentSidebar";
import {
  DashboardGrid,
  DashboardCard,
  CardTitle,
  ContentContainer,
} from "../../../components/dashboard/DashboardComponents.styles";
import {
  GradeSummaryContainer,
  GradeChartContainer,
  SubjectGradesContainer,
  AttendanceChartContainer,
  FeedbackContainer,
  CounselingContainer,
  NotificationContainer,
} from "./styles/StudentDashboard.styles";

// 컴포넌트 임포트
import GradeChart from "../../../components/dashboard/GradeChart";
import SubjectGradeCard from "../../../components/dashboard/SubjectGradeCard";
import AttendanceStats from "../../../components/dashboard/AttendanceStats";
import AttendanceChart from "../../../components/dashboard/AttendanceChart";
import FeedbackItem from "../../../components/dashboard/FeedbackItem";
import CounselingItem from "../../../components/dashboard/CounselingItem";
import NotificationItem from "../../../components/dashboard/NotificationItem";

// 데이터 임포트
import {
  userData,
  gradeData,
  classAverageData,
  feedbackData,
  counselingData,
  notificationData,
  attendanceData,
  getAttendanceChartData,
  CHART_COLORS,
} from "../../../constants/dashboard/studentDashboardData";

// 학생 대시보드 컴포넌트
const StudentDashboard = () => {
  // 성적 차트 데이터 (학생 점수와 전체 평균 비교)
  const gradeChartData = gradeData.map((item) => {
    const averageItem = classAverageData.find(
      (avg) => avg.subject === item.subject
    );
    return {
      subject: item.subject,
      점수: item.score,
      전체평균: averageItem ? averageItem.average : 0,
    };
  });

  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.grade}학년 ${userData.class}반 ${userData.number}번`}
      notificationCount={2}
    >
      <StudentSidebar isCollapsed={false} />

      <ContentContainer>
        <DashboardGrid>
          {/* 성적 요약 카드 */}
          <DashboardCard gridColumn="span 8">
            <CardTitle>성적 현황</CardTitle>
            <GradeSummaryContainer>
              <GradeChartContainer>
                <GradeChart data={gradeChartData} />
              </GradeChartContainer>
              <SubjectGradesContainer>
                {gradeData.map((subject, index) => (
                  <SubjectGradeCard
                    key={index}
                    subject={subject.subject}
                    score={subject.score}
                    grade={subject.grade}
                    performance={subject.performance}
                  />
                ))}
              </SubjectGradesContainer>
            </GradeSummaryContainer>
          </DashboardCard>

          {/* 출석 현황 카드 */}
          <DashboardCard gridColumn="span 4">
            <CardTitle>출석 현황</CardTitle>
            <AttendanceStats
              present={attendanceData.present}
              absent={attendanceData.absent}
              late={attendanceData.late}
              earlyLeave={attendanceData.earlyLeave}
            />
            <AttendanceChartContainer>
              <AttendanceChart
                data={getAttendanceChartData()}
                colors={CHART_COLORS}
              />
            </AttendanceChartContainer>
          </DashboardCard>

          {/* 피드백 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>교사 피드백</CardTitle>
            <FeedbackContainer>
              {feedbackData.map((feedback) => (
                <FeedbackItem
                  key={feedback.id}
                  category={feedback.category}
                  date={feedback.date}
                  content={feedback.content}
                  teacher={feedback.teacher}
                />
              ))}
            </FeedbackContainer>
          </DashboardCard>

          {/* 상담 기록 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>상담 기록</CardTitle>
            <CounselingContainer>
              {counselingData.map((counseling) => (
                <CounselingItem
                  key={counseling.id}
                  date={counseling.date}
                  title={counseling.title}
                  content={counseling.content}
                  teacher={counseling.teacher}
                />
              ))}
            </CounselingContainer>
          </DashboardCard>

          {/* 알림 카드 */}
          <DashboardCard gridColumn="span 12">
            <CardTitle>알림</CardTitle>
            <NotificationContainer>
              {notificationData.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  time={notification.time}
                  content={notification.content}
                  isNew={notification.isNew}
                />
              ))}
            </NotificationContainer>
          </DashboardCard>
        </DashboardGrid>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default StudentDashboard;
