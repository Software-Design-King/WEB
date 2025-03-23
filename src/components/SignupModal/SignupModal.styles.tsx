import styled from "@emotion/styled";

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalHeader = styled.div`
  margin-bottom: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

export const ModalDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

export const FormInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3F51B5;
    outline: none;
  }
`;

export const FormSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3F51B5;
    outline: none;
  }
`;

export const FormErrorText = styled.span`
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

export const ModalButton = styled.button<{ isPrimary?: boolean }>`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.isPrimary ? '#3F51B5' : '#f5f5f5'};
  color: ${props => props.isPrimary ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.isPrimary ? '#303F9F' : '#e0e0e0'};
  }
`;
