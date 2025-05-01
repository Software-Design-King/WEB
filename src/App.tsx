import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect, ReactNode } from "react";
import { useUserStore } from "./stores/userStore";

// 페이지 컴포넌트 (지연 로딩)
const LoginPage = lazy(() => import("./pages/auth/login"));
const StudentDashboard = lazy(() => import("./pages/student/dashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/dashboard"));
const KakaoCallbackPage = lazy(() => import("./pages/auth/kakao-callback"));

// 새로 추가된 페이지 컴포넌트
const StudentGradesPage = lazy(() => import("./pages/student/grades"));
const StudentRecordsPage = lazy(() => import("./pages/student/records"));
const TeacherGradesPage = lazy(() => import("./pages/teacher/grades"));
const TeacherRecordsPage = lazy(() => import("./pages/teacher/records"));
const TeacherFeedbackPage = lazy(() => import("./pages/teacher/feedback"));
const TeacherConsultationPage = lazy(
  () => import("./pages/teacher/consultation")
);
const StudentFeedbackPage = lazy(() => import("./pages/student/feedback"));
const StudentConsultationPage = lazy(
  () => import("./pages/student/consultation")
);

// 로딩 컴포넌트
const Loading = () => <div>로딩 중...</div>;

// Protected Route 컴포넌트
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: "STUDENT" | "TEACHER" | "PARENT";
}) => {
  // 임시로 인증 로직 우회하여 테스트 진행
  return <>{children}</>;

  /* 원래 인증 코드 (필요할 때 주석 해제)
  const { userInfo, isLoading, loadUserInfo } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // 사용자 정보가 없으면 로드
    if (!userInfo && !isLoading) {
      loadUserInfo(token);
    }

    // 역할 체크
    if (userInfo && requiredRole && userInfo.userType !== requiredRole) {
      // 학생 계정으로 교사 페이지 접근 시도 등
      if (userInfo.userType === "STUDENT" || userInfo.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (userInfo.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      }
    }
  }, [userInfo, isLoading, navigate, loadUserInfo, requiredRole]);

  // 로딩 중이거나 사용자 정보가 없으면 로딩 컴포넌트 표시
  if (isLoading || !userInfo) {
    return <Loading />;
  }
  */

  // 인증 & 권한 확인 완료 시 children 렌더링
  // return children;
};

// Home 리다이렉트 컴포넌트
const HomeRedirect = () => {
  const { userInfo, isLoading, loadUserInfo } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // 사용자 정보가 없으면 로드
    if (!userInfo && !isLoading) {
      loadUserInfo(token);
    }

    // 사용자 타입에 따라 대시보드로 리다이렉트
    if (userInfo) {
      if (userInfo.userType === "STUDENT" || userInfo.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (userInfo.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      }
    }
  }, [userInfo, isLoading, loadUserInfo, navigate]);

  return <Loading />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 인증이 필요하지 않은 경로 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

      {/* 홈 리다이렉트 */}
      <Route path="/" element={<HomeRedirect />} />

      {/* 학생 경로 (STUDENT 역할 필요) */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentGradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/records"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentRecordsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/consultation"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentConsultationPage />
          </ProtectedRoute>
        }
      />

      {/* 교사 경로 (TEACHER 역할 필요) */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/grades"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherGradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/records"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherRecordsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/feedback"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/consultation"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherConsultationPage />
          </ProtectedRoute>
        }
      />

      {/* 기타 경로는 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
