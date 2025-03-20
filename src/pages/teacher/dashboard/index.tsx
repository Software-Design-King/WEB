import styled from "@emotion/styled";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TeacherSidebar from "../../../components/layout/TeacherSidebar";
import { colors } from "../../../components/common/Common.styles";

// 컴포넌트 임포트
import StudentStatsCard from "../../../components/dashboard/StudentStatsCard";
import TeacherFeedbackItem from "../../../components/dashboard/TeacherFeedbackItem";
import TeacherCounselingItem from "../../../components/dashboard/TeacherCounselingItem";
import TaskItem from "../../../components/dashboard/TaskItem";
import GradeDistributionChart from "../../../components/dashboard/GradeDistributionChart";
import ClassPerformanceChart from "../../../components/dashboard/ClassPerformanceChart";
import TeacherAttendanceChart from "../../../components/dashboard/TeacherAttendanceChart";
import StudentTable from "../../../components/dashboard/StudentTable";

// 데이터 임포트
import {
  userData,
  studentStats,
  recentCounseling,
  recentFeedback,
  upcomingTasks,
  classPerformanceData,
  attendanceData,
  CHART_COLORS,
  gradeDistributionData,
  homeroomStudents,
} from "../../../constants/dashboard/teacherDashboardData";

// 스타일 임포트
import {
  FeedbackContainer,
  CounselingContainer,
} from "./styles/TeacherDashboard.styles";

// 대시보드 그리드
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
`;

// 대시보드 카드
const DashboardCard = styled.div<{ gridColumn?: string }>`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  grid-column: ${({ gridColumn }) => gridColumn || "span 6"};
`;

// 카드 제목
const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 카드 액션
const CardAction = styled.a`
  font-size: 0.875rem;
  color: ${colors.primary.main};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// 콘텐츠 컨테이너
const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TeacherDashboard = () => {
  return (
    <DashboardLayout
      userName={userData.name}
      userRole={userData.role}
      userInfo={`${userData.subject} ${
        userData.isHomeroom
          ? `/ ${userData.homeroomGrade}학년 ${userData.homeroomClass}반 담임`
          : ""
      }`}
      notificationCount={3}
    >
      <TeacherSidebar isCollapsed={false} />

      <ContentContainer>
        <DashboardGrid>
          {/* 학생 통계 카드 */}
          <DashboardCard gridColumn="span 4">
            <CardTitle>
              학생 현황
              <CardAction
                onClick={() => (window.location.href = "/teacher/students")}
              >
                모든 학생 보기
              </CardAction>
            </CardTitle>
            <StudentStatsCard
              total={studentStats.total}
              homeroom={studentStats.homeroom}
              counselingNeeded={studentStats.counselingNeeded}
              absentToday={studentStats.absentToday}
            />
          </DashboardCard>

          {/* 학급 출석 현황 카드 */}
          <DashboardCard gridColumn="span 4">
            <CardTitle>
              학급 출석 현황
              <CardAction
                onClick={() => (window.location.href = "/teacher/attendance")}
              >
                출석부 보기
              </CardAction>
            </CardTitle>
            <TeacherAttendanceChart
              data={attendanceData}
              colors={CHART_COLORS}
            />
          </DashboardCard>

          {/* 학급 성적 분포 카드 */}
          <DashboardCard gridColumn="span 4">
            <CardTitle>
              학급 성적 분포
              <CardAction
                onClick={() => (window.location.href = "/teacher/grades")}
              >
                성적표 보기
              </CardAction>
            </CardTitle>
            <GradeDistributionChart data={gradeDistributionData} />
          </DashboardCard>

          {/* 학급 성적 추이 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>
              학급 성적 추이
              <CardAction
                onClick={() => (window.location.href = "/teacher/performance")}
              >
                성적 분석
              </CardAction>
            </CardTitle>
            <ClassPerformanceChart data={classPerformanceData} />
          </DashboardCard>

          {/* 최근 피드백 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>
              최근 학생 피드백
              <CardAction
                onClick={() => (window.location.href = "/teacher/feedback")}
              >
                모든 피드백 보기
              </CardAction>
            </CardTitle>
            <FeedbackContainer>
              {recentFeedback.map((feedback) => (
                <TeacherFeedbackItem
                  key={feedback.id}
                  studentName={feedback.studentName}
                  date={feedback.date}
                  category={feedback.category}
                  content={feedback.content}
                />
              ))}
            </FeedbackContainer>
          </DashboardCard>

          {/* 최근 상담 내역 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>
              최근 상담 내역
              <CardAction
                onClick={() => (window.location.href = "/teacher/counseling")}
              >
                모든 상담 보기
              </CardAction>
            </CardTitle>
            <CounselingContainer>
              {recentCounseling.map((counseling) => (
                <TeacherCounselingItem
                  key={counseling.id}
                  studentName={counseling.studentName}
                  date={counseling.date}
                  title={counseling.title}
                  content={counseling.content}
                />
              ))}
            </CounselingContainer>
          </DashboardCard>

          {/* 예정된 업무 카드 */}
          <DashboardCard gridColumn="span 6">
            <CardTitle>
              예정된 업무
              <CardAction
                onClick={() => (window.location.href = "/teacher/tasks")}
              >
                모든 업무 보기
              </CardAction>
            </CardTitle>
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                deadline={task.deadline}
              />
            ))}
          </DashboardCard>

          {/* 담임 학급 학생 목록 카드 */}
          {userData.isHomeroom && (
            <DashboardCard gridColumn="span 12" style={{ marginTop: "1.5rem" }}>
              <CardTitle>
                담임 학급 학생 목록
                <CardAction href="/teacher/students" target="_blank">
                  모든 학생 보기
                </CardAction>
              </CardTitle>
              <StudentTable students={homeroomStudents} />
            </DashboardCard>
          )}
        </DashboardGrid>
      </ContentContainer>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
