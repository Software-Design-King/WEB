import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import SignupModal from "./components/auth/SignupModal";

const TestModal: React.FC = () => {
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
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          회원가입 모달 테스트 페이지
        </Typography>
        <Typography variant="body1" paragraph>
          이 페이지는 회원가입 모달을 독립적으로 테스트하기 위한 페이지입니다.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ mt: 2 }}
        >
          회원가입 모달 열기
        </Button>
      </Box>

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

export default TestModal;
