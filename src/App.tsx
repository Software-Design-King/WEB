import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
// 페이지 컴포넌트 (지연 로딩)
const LoginPage = lazy(() => import("./pages/login"));
const StudentDashboard = lazy(() => import("./pages/student/dashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/dashboard"));
const GradePage = lazy(() => import("./pages/grade"));
const CounselingPage = lazy(() => import("./pages/counseling"));

// 새로 추가된 페이지 컴포넌트
const StudentGradesPage = lazy(() => import("./pages/student/grades"));
const StudentRecordsPage = lazy(() => import("./pages/student/records"));
const TeacherGradesPage = lazy(() => import("./pages/teacher/grades"));
const TeacherRecordsPage = lazy(() => import("./pages/teacher/records"));

// 로딩 컴포넌트
const Loading = () => <div>로딩 중...</div>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 인증이 필요하지 않은 경로 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 레이아웃이 있는 인증된 경로 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/grade" element={<GradePage />} />
          <Route path="/counseling" element={<CounselingPage />} />
          
          {/* 새로 추가된 경로 */}
          <Route path="/student/grades" element={<StudentGradesPage />} />
          <Route path="/student/records" element={<StudentRecordsPage />} />
          <Route path="/teacher/grades" element={<TeacherGradesPage />} />
          <Route path="/teacher/records" element={<TeacherRecordsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
