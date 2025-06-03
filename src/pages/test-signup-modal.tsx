import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import SignupModal from "../components/auth/SignupModal";

// 순수하게 모달만 테스트하기 위한 페이지
const TestSignupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 더미 카카오 토큰 (테스트용)
  const dummyKakaoToken = "test_kakao_token_for_testing";

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (data: any) => {
    console.log("회원가입 데이터:", data);
    alert("회원가입 테스트 - 콘솔에서 제출된 데이터를 확인하세요");
    handleClose();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          회원가입 모달 테스트
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          아래 버튼을 클릭하면 회원가입 모달이 표시됩니다.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          size="large"
        >
          회원가입 모달 열기
        </Button>
      </Box>

      {/* 모달 컴포넌트 */}
      {isOpen && (
        <SignupModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          kakaoToken={dummyKakaoToken}
        />
      )}
    </Container>
  );
};

export default TestSignupModal;
