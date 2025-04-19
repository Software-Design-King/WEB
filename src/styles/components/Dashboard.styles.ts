import styled from 'styled-components';
import { theme } from '../theme';

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.large};
  margin-top: ${theme.spacing.large};
`;

export const DashboardCard = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
  padding: ${theme.spacing.large};
`;

export const CardTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.medium};
  font-weight: 600;
`;

export const ContentContainer = styled.div`
  padding: ${theme.spacing.large};
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.large};
`;

export const StatBox = styled.div`
  flex: 1;
  min-width: 120px;
  background-color: white;
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.medium};
  box-shadow: ${theme.shadows.small};
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small};
`;

export const StatValue = styled.div`
  font-size: ${theme.fontSizes.xlarge};
  font-weight: 600;
  color: ${theme.colors.primary};
`;
