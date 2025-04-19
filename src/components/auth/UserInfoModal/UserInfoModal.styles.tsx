import styled from "@emotion/styled";

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalHeader = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #e4e9f2;
  padding-bottom: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
`;

export const ModalDescription = styled.p`
  font-size: 15px;
  color: #4a5568;
  line-height: 1.5;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
`;

export const FormInput = styled.input`
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1a202c;
  background-color: white;
  transition: all 0.2s;

  &:focus {
    border-color: #4A5AF8;
    box-shadow: 0 0 0 3px rgba(74, 90, 248, 0.15);
    outline: none;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

export const FormSelect = styled.select`
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1a202c;
  background-color: white;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232d3748' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    border-color: #4A5AF8;
    box-shadow: 0 0 0 3px rgba(74, 90, 248, 0.15);
    outline: none;
  }
`;

export const FormErrorText = styled.span`
  font-size: 12px;
  color: #e53e3e;
  margin-top: 6px;
  font-weight: 500;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  border-top: 1px solid #e4e9f2;
  padding-top: 24px;
`;

export const ModalButton = styled.button`
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(ModalButton)`
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
  }
`;

export const SubmitButton = styled(ModalButton)`
  background-color: #4A5AF8;
  border: none;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #3b4acf;
    box-shadow: 0 4px 6px rgba(74, 90, 248, 0.2);
  }
`;
