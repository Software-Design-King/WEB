import styled from "@emotion/styled";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #3F51B5;

  svg {
    width: 32px;
    height: 32px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const UserRole = styled.div`
  font-size: 14px;
  color: #666;
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

export const Sidebar = styled.nav`
  width: 240px;
  background-color: #f5f5f5;
  padding: 24px 0;
`;

export const SidebarItem = styled.div<{ active?: boolean }>`
  padding: 12px 24px;
  font-size: 16px;
  color: ${props => props.active ? '#3F51B5' : '#333'};
  background-color: ${props => props.active ? 'rgba(63, 81, 181, 0.1)' : 'transparent'};
  border-left: 4px solid ${props => props.active ? '#3F51B5' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? 'rgba(63, 81, 181, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 24px;
  background-color: #f9f9f9;
`;

export const WelcomeCard = styled.div`
  background-color: #3F51B5;
  color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const WelcomeTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const WelcomeText = styled.p`
  font-size: 16px;
  opacity: 0.9;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

export const CardContent = styled.div`
  padding: 16px;
`;

export const StudentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StudentRow = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;

export const StudentCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
`;

export const StudentHeader = styled.th`
  padding: 12px;
  background-color: #f5f5f5;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #ddd;
`;

export const ActionButton = styled.button`
  padding: 8px 12px;
  background-color: #3F51B5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #303F9F;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

export const TabButton = styled.button<{ active?: boolean }>`
  padding: 12px 16px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#3F51B5' : 'transparent'};
  color: ${props => props.active ? '#3F51B5' : '#333'};
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3F51B5;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3F51B5;
  }
`;

export const SearchButton = styled.button`
  padding: 10px 16px;
  background-color: #3F51B5;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #303F9F;
  }
`;

export const CounselingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const FormInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3F51B5;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3F51B5;
  }
`;

export const FormSubmitButton = styled.button`
  padding: 10px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #388E3C;
  }
`;

export const Footer = styled.footer`
  padding: 16px 24px;
  background-color: white;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 14px;
  color: #666;
`;
