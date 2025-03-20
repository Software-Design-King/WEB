import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
// 페이지 컴포넌트 (지연 로딩)
const MainPage = lazy(() => import("./pages/main"));
const LoginPage = lazy(() => import("./pages/login"));
const StudentPage = lazy(() => import("./pages/student"));
const GradePage = lazy(() => import("./pages/grade"));
const CounselingPage = lazy(() => import("./pages/counseling"));

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
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/grade" element={<GradePage />} />
          <Route path="/counseling" element={<CounselingPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
