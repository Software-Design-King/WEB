import styled from 'styled-components';
import { theme } from '../theme';

export const GradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${theme.spacing.medium};
  
  th, td {
    padding: ${theme.spacing.small};
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    background-color: ${theme.colors.background};
  }
  
  tr:hover {
    background-color: ${theme.colors.background};
  }
`;

export const SemesterSelector = styled.div`
  margin: ${theme.spacing.medium} 0;
  
  label {
    margin-right: ${theme.spacing.small};
    font-weight: 500;
  }
  
  select {
    padding: ${theme.spacing.small};
    border-radius: ${theme.borderRadius.small};
    border: 1px solid #ddd;
    background-color: white;
  }
`;

export const GradeBox = styled.div`
  display: inline-block;
  padding: ${theme.spacing.small};
  border-radius: ${theme.borderRadius.small};
  background-color: ${theme.colors.primary};
  color: white;
  width: 40px;
  text-align: center;
`;

export const GradeLabel = styled.span`
  font-weight: 600;
  font-size: ${theme.fontSizes.small};
`;

export const GradeSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.large};
`;

export const SummaryItem = styled.div`
  flex: 1;
  min-width: 120px;
  background-color: white;
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.medium};
  box-shadow: ${theme.shadows.small};
  text-align: center;
`;

export const SummaryLabel = styled.div`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small};
`;

export const SummaryValue = styled.div`
  font-size: ${theme.fontSizes.xlarge};
  font-weight: 600;
  color: ${theme.colors.primary};
`;
