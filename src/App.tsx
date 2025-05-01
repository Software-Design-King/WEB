import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./hooks/useAuth";
import { UserInfo } from "./types/user";

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
  const { userInfo, isLoading, isAuthenticated, loadUserInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 사용자 역할에 따른 리다이렉트 함수
  const redirectBasedOnUserRole = useCallback((user: UserInfo) => {
    if (user.userType === "STUDENT" || user.userType === "PARENT") {
      navigate("/student/dashboard", { replace: true });
    } else if (user.userType === "TEACHER") {
      navigate("/teacher/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // 인증 상태 확인
      if (!isAuthenticated) {
        try {
          const user = await loadUserInfo();
          if (!user) {
            // 로그인 페이지로 리다이렉트하고 현재 경로 저장
            navigate('/', { 
              replace: true,
              state: { 
                from: location.pathname,
                error: "세션이 만료되었거나 로그인이 필요합니다."
              } 
            });
          } else if (requiredRole && user.userType !== requiredRole) {
            // 권한이 불일치할 경우 적절한 대시보드로 리다이렉트
            redirectBasedOnUserRole(user);
          }
        } catch (error) {
          console.error("인증 확인 중 오류:", error);
          navigate('/', { 
            replace: true,
            state: { 
              from: location.pathname,
              error: "인증 처리 중 오류가 발생했습니다."
            } 
          });
        }
        return;
      }

      // 권한 확인 (인증된 상태이며 사용자 정보가 있는 경우)
      if (requiredRole && userInfo && userInfo.userType !== requiredRole) {
        redirectBasedOnUserRole(userInfo);
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, userInfo, loadUserInfo, navigate, requiredRole, location.pathname, redirectBasedOnUserRole]);

  if (isLoading) {
    return <Loading />;
  }

  // 인증 및 권한 확인 통과
  return <>{children}</>;
};

// Home 리다이렉트 컴포넌트
const HomeRedirect = () => {
  const { userInfo, isAuthenticated, loadUserInfo } = useAuth();
  const navigate = useNavigate();

  // 사용자 역할에 따른 리다이렉트 함수
  const redirectBasedOnUserRole = useCallback((user: UserInfo) => {
    if (user.userType === "STUDENT" || user.userType === "PARENT") {
      navigate("/student/dashboard", { replace: true });
    } else if (user.userType === "TEACHER") {
      navigate("/teacher/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // 이미 로그인된 상태라면
      if (isAuthenticated && userInfo) {
        redirectBasedOnUserRole(userInfo);
        return;
      }

      // 인증 상태가 아니라면 서버에서 정보 확인 시도
      try {
        const user = await loadUserInfo();
        if (user) {
          redirectBasedOnUserRole(user);
        }
      } catch (error) {
        console.error("사용자 정보 로드 중 오류:", error);
        // 오류 발생 시 로그인 페이지 유지
      }
    };
    
    checkAuthAndRedirect();
  }, [userInfo, isAuthenticated, loadUserInfo, navigate, redirectBasedOnUserRole]);

  return <Loading />;
};

// 로그인 페이지 래퍼 - 오류 메시지 처리 추가
const LoginPageWrapper = () => {
  const location = useLocation();
  const { isAuthenticated, userInfo } = useAuth();
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const errorParam = searchParams.get('error');
  
  // 이미 인증된 사용자 리디렉션
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      if (userInfo.userType === "STUDENT" || userInfo.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (userInfo.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, userInfo, navigate]);
  
  // location.state에서 리디렉션 전 경로 가져오기
  const from = location.state?.from || "/";
  
  // 에러 메시지 설정
  let errorMessage = null;
  if (errorParam === 'auth_required') {
    errorMessage = "로그인이 만료되었습니다. 다시 로그인해주세요.";
  } else if (errorParam) {
    errorMessage = errorParam;
  }
  
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage errorMessage={errorMessage} redirectPath={from} />
    </Suspense>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* 인증이 필요하지 않은 경로 */}
      <Route path="/" element={<LoginPageWrapper />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

      {/* 홈 리다이렉트 */}
      <Route path="/home" element={<HomeRedirect />} />

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
