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
      // 사용자 타입에 따라 대시보드로 리다이렉트
      if (userInfo.userType === "STUDENT" || userInfo.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (userInfo.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      }
    }
  }, [userInfo, isLoading, loadUserInfo, navigate, requiredRole]);

  if (isLoading) return <Loading />;

  return children;
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
      <Route path="/login" element={<LoginPage />} />
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
