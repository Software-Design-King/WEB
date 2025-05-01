import styled from "@emotion/styled";
import { colors } from "../../../components/common/Common.styles";

export const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

export const WaveBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.3' d='M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,144C672,171,768,213,864,208C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  background-position: bottom;
  z-index: 0;
`;

export const CardContainer = styled.div`
  display: flex;
  max-width: 1000px;
  width: 90%;
  height: 600px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    max-height: 90vh;
    width: 100%;
    max-width: 450px;
  }
`;

export const SchoolIllustration = styled.div`
  flex: 1;
  background-image: url("https://source.unsplash.com/PXjQaGxi4JA/900x1600");
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(63, 81, 181, 0.6) 0%,
      rgba(0, 188, 212, 0.6) 100%
    );
  }

  @media (max-width: 768px) {
    height: 200px;
    flex: none;
  }
`;

export const AuthContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background.default};
  background-image: url(https://source.unsplash.com/random?classroom);
  background-size: cover;
  background-position: center;
`;

export const AuthCard = styled.div`
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 0 20px 20px 0;
  max-width: 500px;

  @media (max-width: 768px) {
    border-radius: 0 0 20px 20px;
    padding: 2rem 1.5rem;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

export const UniversityLogo = styled.div`
  width: 180px;
  height: 80px;
  background-image: url("/images/inu_logo.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 12px;
`;

export const SystemTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  color: #003c8f;
  text-align: center;
`;

export const AuthHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

export const AuthTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const AuthSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light};
  }
`;

export const FormErrorText = styled.p`
  color: ${colors.error.main};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const LoginButtonContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

export const SocialLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.9rem;
  background-color: #fee500;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ffd700;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const KakaoIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 3C7.03125 3 3 6.06079 3 9.82953C3 12.2635 4.55625 14.4118 6.86875 15.5969L5.89688 19.2059C5.8125 19.4912 6.12188 19.7294 6.37813 19.5676L10.6594 16.7471C11.0938 16.7941 11.5406 16.8235 12 16.8235C16.9688 16.8235 21 13.5985 21 9.82953C21 6.06079 16.9688 3 12 3Z' fill='black'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
`;

export const FooterText = styled.p`
  text-align: center;
  color: #888;
  font-size: 0.8rem;
  margin-top: auto;
`;

export const ErrorMessage = styled.div`
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  color: #d32f2f;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: #333;
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ModalButton = styled.button<{ secondary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${(props) =>
    props.secondary ? "#f5f5f5" : colors.primary.main};
  color: ${(props) => (props.secondary ? "#333" : "white")};
  border: ${(props) => (props.secondary ? "1px solid #ddd" : "none")};

  &:hover {
    background-color: ${(props) =>
      props.secondary ? "#e0e0e0" : colors.primary.dark};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
