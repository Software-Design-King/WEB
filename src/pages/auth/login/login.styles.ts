import styled from "@emotion/styled";
import { colors, typography } from "../../../components/common/Common.styles";

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
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  margin: 0 1rem;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const AuthHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const AuthTitle = styled.h1`
  width: 100%;
  font-size: ${typography.h4.fontSize};
  font-weight: ${typography.h4.fontWeight};
  margin-bottom: 0.5rem;
  color: ${colors.primary.main};
`;

export const AuthSubtitle = styled.h2`
  font-size: ${typography.h6.fontSize};
  font-weight: ${typography.h6.fontWeight};
  margin-bottom: 1.5rem;
  color: ${colors.text.secondary};
`;

export const AuthForm = styled.form`
  margin-top: 1rem;
  width: 100%;
`;

export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${typography.body2.fontSize};
  color: ${colors.text.secondary};
`;

export const FormInput = styled.input<{ isError?: boolean }>`
  width: 100%;
  background-color: white;
  padding: 0.75rem 1rem;
  color: black;
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.isError ? colors.error.main : colors.grey[300])};
  font-family: ${typography.fontFamily};
  font-size: ${typography.body1.fontSize};
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &:focus {
    border-color: ${(props) =>
      props.isError ? colors.error.main : colors.primary.main};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.isError
          ? `rgba(${hexToRgb(colors.error.main)}, 0.2)`
          : `rgba(${hexToRgb(colors.primary.main)}, 0.2)`};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  color: black;
  font-size: ${typography.body1.fontSize};
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.grey[300]};
  border-radius: 4px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.body1.fontSize};
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &:focus {
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px rgba(${hexToRgb(colors.primary.main)}, 0.2);
  }
`;

export const FormErrorText = styled.div`
  color: ${colors.error.main};
  font-size: ${typography.caption.fontSize};
  margin-top: 0.25rem;
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

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background-color: ${colors.primary.main};
  color: white;
  border: none;
  border-radius: 4px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.button.fontSize};
  font-weight: ${typography.button.fontWeight};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary.dark};
  }

  &:disabled {
    background-color: ${colors.grey[300]};
    cursor: not-allowed;
  }
`;

export const SocialLoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background-color: #fee500;
  color: #000000;
  border: none;
  border-radius: 4px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.button.fontSize};
  font-weight: ${typography.button.fontWeight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6cf00;
  }

  svg {
    margin-right: 8px;
  }
`;

export const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
`;

export const DividerLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: ${colors.grey[300]};
`;

export const DividerText = styled.span`
  padding: 0 1rem;
  color: ${colors.text.secondary};
  font-size: ${typography.body2.fontSize};
`;

export const AuthFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

export const FooterText = styled.p`
  color: ${colors.text.secondary};
  font-size: ${typography.body2.fontSize};
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: ${typography.h5.fontSize};
  font-weight: ${typography.h5.fontWeight};
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`;

export const ModalDescription = styled.p`
  font-size: ${typography.body2.fontSize};
  color: ${colors.text.secondary};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
`;

export const ModalButton = styled.button<{ secondary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.button.fontSize};
  font-weight: ${typography.button.fontWeight};
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  ${(props) =>
    props.secondary
      ? `
      background-color: transparent;
      color: ${colors.text.primary};
      border: 1px solid ${colors.grey[300]};
      
      &:hover {
        background-color: ${colors.grey[100]};
      }
    `
      : `
      background-color: ${colors.primary.main};
      color: white;
      border: none;
      
      &:hover {
        background-color: ${colors.primary.dark};
      }
    `}
`;

// Helper function for rgba conversion
function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "0, 0, 0";
}
