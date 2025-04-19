import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 16px;
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    line-height: 1.5;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.medium};
    font-weight: 600;
  }

  h1 {
    font-size: ${theme.fontSizes.xxlarge};
  }

  h2 {
    font-size: ${theme.fontSizes.xlarge};
  }

  h3 {
    font-size: ${theme.fontSizes.large};
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;
