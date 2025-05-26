import styled from "@emotion/styled";
import { colors } from "../../../../components/common/Common.styles";

export const PageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;

export const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const TabsWrapper = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const TabContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: none;
  width: 100%;
  max-width: 500px;
`;

export const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.active ? colors.primary.main : "white")};
  color: ${(props) => (props.active ? "white" : colors.text.secondary)};
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) =>
      props.active ? colors.primary.main : colors.grey[100]};
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) =>
      props.active ? colors.primary.light : "transparent"};
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const StickyNoteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const StickyNote = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform: rotate(${() => Math.random() * 2 - 1}deg);
  
  &:hover {
    transform: translateY(-5px) rotate(0);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 20px;
    width: 40px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 5px 5px;
  }
`;

export const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
`;

export const NoteTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: rgba(0, 0, 0, 0.75);
`;

export const NoteContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
`;

export const NewNoteCard = styled.div<{ active?: boolean }>`
  background-color: white;
  border: 2px dashed ${props => props.active ? colors.primary.main : colors.grey[300]};
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary.main};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const NewNoteIcon = styled.div`
  font-size: 2rem;
  color: ${colors.primary.main};
  margin-bottom: 1rem;
`;

export const NewNoteText = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin: 0;
  text-align: center;
`;

export const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${colors.grey[200]};
`;

export const CompactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  min-height: 100px;
  font-size: 0.95rem;
  color: ${colors.text.primary};
  background-color: white;
  resize: vertical;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary.light};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px ${colors.primary.light}40;
  }

  &::placeholder {
    color: ${colors.grey[400]};
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  cursor: pointer;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PrimaryButton = styled(StyledButton)`
  background-color: ${colors.primary.main};
  color: white;

  &:hover {
    background-color: ${colors.primary.dark};
    box-shadow: 0 4px 8px ${colors.primary.main}40;
  }

  &:disabled {
    background-color: ${colors.grey[400]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled(StyledButton)`
  background-color: ${colors.grey[200]};
  color: ${colors.text.primary};

  &:hover {
    background-color: ${colors.grey[300]};
    box-shadow: 0 4px 8px ${colors.grey[300]}40;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
