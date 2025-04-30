import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Breakpoints
export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },
  up: (key: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => `@media (min-width: ${breakpoints.values[key]}px)`,
  down: (key: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => `@media (max-width: ${breakpoints.values[key] - 0.05}px)`,
  between: (start: 'xs' | 'sm' | 'md' | 'lg' | 'xl', end: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => 
    `@media (min-width: ${breakpoints.values[start]}px) and (max-width: ${breakpoints.values[end] - 0.05}px)`,
};

// Legacy media query (to be deprecated)
export const media = {
  xs: `@media (min-width: ${breakpoints.values.xs}px)`,
  sm: `@media (min-width: ${breakpoints.values.sm}px)`,
  md: `@media (min-width: ${breakpoints.values.md}px)`,
  lg: `@media (min-width: ${breakpoints.values.lg}px)`,
  xl: `@media (min-width: ${breakpoints.values.xl}px)`,
};

// Color palette
export const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Typography
export const typography = {
  fontFamily: "'Pretendard', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
  subtitle1: {
    fontSize: '1rem',
    lineHeight: 1.75,
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '0.875rem',
    lineHeight: 1.57,
    fontWeight: 500,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 2.66,
    textTransform: 'uppercase',
  }
};

// Common styled components
export const Container = styled.div`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
  
  ${breakpoints.up('sm')} {
    max-width: 600px;
    padding-left: 24px;
    padding-right: 24px;
  }
  
  ${breakpoints.up('md')} {
    max-width: 960px;
  }
  
  ${breakpoints.up('lg')} {
    max-width: 1280px;
  }
  
  ${breakpoints.up('xl')} {
    max-width: 1920px;
  }
`;

export const FlexBox = styled.div<{
  direction?: string;
  justify?: string;
  align?: string;
  gap?: string;
  wrap?: string;
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'stretch'};
  gap: ${({ gap }) => gap || '0'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
`;

export const Card = styled.div`
  background-color: ${colors.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const Button = styled.button<{
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}>`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.button.fontWeight};
  font-size: ${({ size }) => 
    size === 'small' 
      ? '0.75rem' 
      : size === 'large' 
        ? '1rem' 
        : typography.button.fontSize
  };
  line-height: ${typography.button.lineHeight};
  border-radius: 4px;
  padding: ${({ size }) => 
    size === 'small' 
      ? '4px 8px' 
      : size === 'large' 
        ? '10px 22px' 
        : '6px 16px'
  };
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;
  outline: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  
  ${({ variant, color = 'primary' }) => {
    const themeColor = colors[color] || colors.primary;
    
    if (variant === 'outlined') {
      return css`
        background-color: transparent;
        border: 1px solid ${themeColor.main};
        color: ${themeColor.main};
        
        &:hover {
          background-color: rgba(${hexToRgb(themeColor.main)}, 0.04);
        }
      `;
    } else if (variant === 'text') {
      return css`
        background-color: transparent;
        color: ${themeColor.main};
        
        &:hover {
          background-color: rgba(${hexToRgb(themeColor.main)}, 0.04);
        }
      `;
    } else {
      return css`
        background-color: ${themeColor.main};
        color: ${themeColor.contrastText};
        
        &:hover {
          background-color: ${themeColor.dark};
        }
      `;
    }
  }}
`;

export const Typography = styled.p<{
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
}>`
  margin: 0;
  font-family: ${typography.fontFamily};
  font-size: ${({ variant = 'body1' }) => typeof typography[variant] === 'object' ? typography[variant].fontSize : '1rem'};
  font-weight: ${({ variant = 'body1' }) => typeof typography[variant] === 'object' ? typography[variant].fontWeight || 400 : 400};
  line-height: ${({ variant = 'body1' }) => typeof typography[variant] === 'object' ? typography[variant].lineHeight : 1.5};
  color: ${({ color }) => color || colors.text.primary};
  text-align: ${({ align }) => align || 'left'};
  margin-bottom: ${({ gutterBottom }) => (gutterBottom ? '0.35em' : 0)};
  white-space: ${({ noWrap }) => (noWrap ? 'nowrap' : 'normal')};
  overflow: ${({ noWrap }) => (noWrap ? 'hidden' : 'visible')};
  text-overflow: ${({ noWrap }) => (noWrap ? 'ellipsis' : 'clip')};
  margin-bottom: ${({ paragraph }) => (paragraph ? '16px' : undefined)};
`;

export const Grid = styled.div<{
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
}>`
  ${({ container, item, spacing = 0, direction, justify, alignItems }) => 
    container 
      ? css`
          display: flex;
          flex-wrap: wrap;
          flex-direction: ${direction || 'row'};
          justify-content: ${justify || 'flex-start'};
          align-items: ${alignItems || 'stretch'};
          margin: -${spacing * 4}px;
          width: calc(100% + ${spacing * 8}px);
          
          & > * {
            padding: ${spacing * 4}px;
          }
        `
      : item
      ? css`
          box-sizing: border-box;
        `
      : ''
  }
  
  ${({ xs }) =>
    xs !== undefined &&
    css`
      flex-grow: 0;
      max-width: ${(xs / 12) * 100}%;
      flex-basis: ${(xs / 12) * 100}%;
    `}
  
  ${({ sm }) =>
    sm !== undefined &&
    css`
      ${breakpoints.up('sm')} {
        flex-grow: 0;
        max-width: ${(sm / 12) * 100}%;
        flex-basis: ${(sm / 12) * 100}%;
      }
    `}
  
  ${({ md }) =>
    md !== undefined &&
    css`
      ${breakpoints.up('md')} {
        flex-grow: 0;
        max-width: ${(md / 12) * 100}%;
        flex-basis: ${(md / 12) * 100}%;
      }
    `}
  
  ${({ lg }) =>
    lg !== undefined &&
    css`
      ${breakpoints.up('lg')} {
        flex-grow: 0;
        max-width: ${(lg / 12) * 100}%;
        flex-basis: ${(lg / 12) * 100}%;
      }
    `}
  
  ${({ xl }) =>
    xl !== undefined &&
    css`
      ${breakpoints.up('xl')} {
        flex-grow: 0;
        max-width: ${(xl / 12) * 100}%;
        flex-basis: ${(xl / 12) * 100}%;
      }
    `}
`;

export const Paper = styled.div<{
  elevation?: number;
  square?: boolean;
  variant?: 'elevation' | 'outlined';
}>`
  background-color: ${colors.background.paper};
  color: ${colors.text.primary};
  border-radius: ${({ square }) => (square ? '0' : '4px')};
  padding: 16px;
  
  ${({ variant, elevation = 1 }) => {
    if (variant === 'outlined') {
      return css`
        border: 1px solid ${colors.divider};
        box-shadow: none;
      `;
    } else {
      const shadowValue = (elevation * 0.5);
      return css`
        box-shadow: 0px ${shadowValue}px ${shadowValue * 2}px rgba(0, 0, 0, 0.1);
        border: none;
      `;
    }
  }}
`;

export const Divider = styled.hr<{
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
}>`
  margin: 0;
  border: none;
  border-bottom: 1px solid ${colors.divider};
  
  ${({ orientation }) =>
    orientation === 'vertical'
      ? css`
          height: auto;
          align-self: stretch;
          border-bottom: none;
          border-right: 1px solid ${colors.divider};
        `
      : css`
          width: 100%;
        `}
  
  ${({ variant }) => {
    if (variant === 'inset') {
      return css`
        margin-left: 72px;
      `;
    } else if (variant === 'middle') {
      return css`
        margin-left: 16px;
        margin-right: 16px;
      `;
    }
    return '';
  }}
`;

export const TextField = styled.input<{
  fullWidth?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}>`
  font-family: ${typography.fontFamily};
  font-size: ${({ size }) => (size === 'small' ? '0.875rem' : '1rem')};
  line-height: 1.4375em;
  color: ${colors.text.primary};
  box-sizing: border-box;
  position: relative;
  cursor: text;
  background-color: ${colors.background.paper};
  border: 1px solid ${({ error }) => (error ? colors.error.main : colors.grey[300])};
  border-radius: 4px;
  padding: ${({ size }) => (size === 'small' ? '8px 12px' : '12px 14px')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  transition: border-color 0.2s;
  outline: none;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:focus {
    border-color: ${({ error }) => (error ? colors.error.main : colors.primary.main)};
    box-shadow: 0 0 0 2px ${({ error }) => (error ? `rgba(${hexToRgb(colors.error.main)}, 0.2)` : `rgba(${hexToRgb(colors.primary.main)}, 0.2)`)};
  }
  
  &::placeholder {
    color: ${colors.text.secondary};
    opacity: 0.7;
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: ${colors.grey[100]};
    color: ${colors.text.disabled};
  }
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const ListItem = styled.li<{
  selected?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  text-decoration: none;
  padding: 8px 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  
  background-color: ${({ selected }) => (selected ? `rgba(${hexToRgb(colors.primary.main)}, 0.08)` : 'transparent')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  
  &:hover {
    background-color: ${({ selected, disabled }) => 
      disabled 
        ? 'transparent' 
        : selected 
          ? `rgba(${hexToRgb(colors.primary.main)}, 0.12)` 
          : `rgba(0, 0, 0, 0.04)`
    };
  }
`;

export const Chip = styled.div<{
  variant?: 'outlined' | 'filled';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
  size?: 'small' | 'medium';
  onClick?: () => void;
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 16px;
  height: ${({ size = 'medium' }) => (size === 'small' ? '24px' : '32px')};
  font-size: ${({ size = 'medium' }) => (size === 'small' ? '12px' : '14px')};
  padding: 0 12px;
  box-sizing: border-box;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  
  ${({ color = 'default', variant = 'filled' }) => {
    // 색상 변수 설정
    let backgroundColor, borderColor, textColor;
    
    if (color === 'default') {
      backgroundColor = colors.grey[300];
      borderColor = colors.grey[300];
      textColor = colors.text.primary;
    } else {
      const themeColor = colors[color] || colors.grey;
      backgroundColor = themeColor.main;
      borderColor = themeColor.main;
      textColor = themeColor.contrastText;
    }
    
    if (variant === 'outlined') {
      return css`
        background-color: transparent;
        border: 1px solid ${borderColor};
        color: ${color === 'default' ? colors.text.primary : backgroundColor};
      `;
    } else {
      return css`
        background-color: ${backgroundColor};
        color: ${textColor};
      `;
    }
  }}
`;

export const Avatar = styled.div<{
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
  width: ${({ size }) => 
    size === 'small' 
      ? '32px' 
      : size === 'large' 
        ? '56px' 
        : '40px'
  };
  height: ${({ size }) => 
    size === 'small' 
      ? '32px' 
      : size === 'large' 
        ? '56px' 
        : '40px'
  };
  font-size: ${({ size }) => 
    size === 'small' 
      ? '1rem' 
      : size === 'large' 
        ? '1.75rem' 
        : '1.25rem'
  };
  color: ${colors.background.paper};
  background-color: ${({ backgroundColor }) => backgroundColor || colors.grey[300]};
  
  ${({ src, alt }) => 
    src 
      ? css`
          background-image: url(${src});
          background-size: cover;
          background-position: center;
        `
      : alt && alt.length > 0
      ? css`
          &::after {
            content: "${alt.charAt(0).toUpperCase()}";
          }
        `
      : ''
  }
`;

export const IconButton = styled.button<{
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
  padding: 0;
  width: ${({ size }) => 
    size === 'small' 
      ? '32px' 
      : size === 'large' 
        ? '48px' 
        : '40px'
  };
  height: ${({ size }) => 
    size === 'small' 
      ? '32px' 
      : size === 'large' 
        ? '48px' 
        : '40px'
  };
  color: ${({ color = 'default' }) => 
    color === 'default' 
      ? colors.text.primary 
      : colors[color].main
  };
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ disabled }) => 
      disabled 
        ? 'transparent' 
        : 'rgba(0, 0, 0, 0.04)'
    };
  }
`;

// Helper function for rgba conversion
function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}
