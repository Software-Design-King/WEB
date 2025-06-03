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
import { useUserStore } from "./stores/userStore";

// 페이지 컴포넌트 (지연 로딩)
const LoginPage = lazy(() => import("./pages/auth/login"));
const StudentDashboard = lazy(() => import("./pages/student/dashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/dashboard"));
const KakaoCallbackPage = lazy(() => import("./pages/auth/kakao-callback"));
const ClassroomStudents = lazy(() => import("./pages/teacher/students"));
// 테스트 모달 페이지
const TestModalPage = lazy(() => import("./test-modal"));
const TestSignupModalPage = lazy(() => import("./pages/test-signup-modal"));

// 새로 추가된 페이지 컴포넌트
const StudentGradesPage = lazy(() => import("./pages/student/grades"));
const StudentRecordsPage = lazy(() => import("./pages/student/records"));
const TeacherGradesPage = lazy(() => import("./pages/teacher/grades"));
const TeacherFeedbackPage = lazy(() => import("./pages/teacher/feedback"));
const TeacherConsultationPage = lazy(
  () => import("./pages/teacher/consultation")
);
const StudentFeedbackPage = lazy(() => import("./pages/student/feedback"));
const StudentConsultationPage = lazy(
  () => import("./pages/student/consultation")
);
const TeacherStudentRecordsPage = lazy(() => import("./pages/teacher/studentRecords"));


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
  const { userInfo, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 카카오 콜백 경로인지 확인
  const isKakaoCallbackPath = location.pathname.includes("/auth/kakao/callback");

  // 사용자 역할에 따른 리다이렉트 함수
  const redirectBasedOnUserRole = useCallback(
    (user: UserInfo) => {
      if (user.userType === "STUDENT" || user.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  useEffect(() => {
    // 카카오 콜백 경로일 경우 인증 체크를 수행하지 않음
    if (isKakaoCallbackPath) {
      return;
    }

    // 인증되지 않은 경우 로그인 페이지로 리다이렉션
    if (!isAuthenticated && !isLoading) {
      // 현재 경로를 returnUrl로 저장
      const currentPath = location.pathname + location.search;
      navigate(`/?returnUrl=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
      return;
    }

    // 사용자 정보가 있고 역할이 필요한 경우 체크
    if (userInfo && requiredRole && userInfo.userType !== requiredRole) {
      // 역할이 맞지 않으면 대시보드로 리다이렉션
      redirectBasedOnUserRole(userInfo);
    }
  }, [
    userInfo,
    isAuthenticated,
    isLoading,
    navigate,
    location.pathname,
    location.search,
    requiredRole,
    redirectBasedOnUserRole,
    isKakaoCallbackPath,
  ]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (isLoading) {
    return <Loading />;
  }

  // 인증이 완료되었거나 카카오 콜백 경로인 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

// 홈 경로에서 사용자 타입에 따라 적절한 대시보드로 리다이렉트
const HomeRedirect = () => {
  const { userInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 사용자 역할에 따른 리다이렉트 함수
  const redirectBasedOnUserRole = useCallback(
    (user: UserInfo) => {
      if (user.userType === "STUDENT" || user.userType === "PARENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (user.userType === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  useEffect(() => {
    // 인증이 완료된 사용자 정보가 있는 경우
    if (isAuthenticated && userInfo) {
      redirectBasedOnUserRole(userInfo);
      return;
    }

    // 인증되지 않은 경우 로그인 페이지로 이동
    navigate("/", { replace: true });
  }, [
    userInfo,
    isAuthenticated,
    navigate,
    redirectBasedOnUserRole,
  ]);

  return <Loading />;
};

// 로그인 페이지 래퍼 - 오류 메시지 처리 추가
const LoginPageWrapper = () => {
  const location = useLocation();
  const { isAuthenticated, userInfo } = useAuth();
  const navigate = useNavigate();

  // URL 쿼리 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const errorParam = searchParams.get("error");

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
  if (errorParam === "auth_required") {
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

// App 전체에서 사용자 데이터를 로드하는 컴포넌트
const AppUserDataLoader = ({ children }: { children: ReactNode }) => {
  const loadUserInfo = useUserStore((state) => state.loadUserInfo);
  const userInfo = useUserStore((state) => state.userInfo);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !userInfo) {
      // 토큰이 있고 사용자 정보가 없는 경우에만 로드
      loadUserInfo(token).catch(error => {
        console.error('앱 초기화 중 사용자 정보 로드 오류:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 인증이 필요하지 않은 경로 */}
      <Route path="/" element={<LoginPageWrapper />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
      <Route path="/test-modal" element={<TestModalPage />} />
      <Route path="/test-signup" element={<TestSignupModalPage />} />

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
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <ClassroomStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/studentRecords"
        element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherStudentRecordsPage />
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
        <AppUserDataLoader>
          <AppRoutes />
        </AppUserDataLoader>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
