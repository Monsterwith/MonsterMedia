import { hexToHsl } from './utils';

export function applyThemeColors(
  primaryColor: string,
  secondaryColor: string,
  accentColor: string,
  backgroundColor: string
) {
  const root = document.documentElement;
  
  // Convert hex colors to HSL format for CSS variables
  const primaryHsl = hexToHsl(primaryColor);
  const secondaryHsl = hexToHsl(secondaryColor);
  const accentHsl = hexToHsl(accentColor);
  const backgroundHsl = hexToHsl(backgroundColor);
  
  // Apply colors to CSS variables
  root.style.setProperty('--primary', primaryHsl);
  root.style.setProperty('--secondary', secondaryHsl);
  root.style.setProperty('--accent', accentHsl);
  root.style.setProperty('--background', backgroundHsl);
  
  // Also update related variables
  root.style.setProperty('--chart-1', primaryHsl);
  root.style.setProperty('--chart-2', secondaryHsl);
  root.style.setProperty('--chart-3', accentHsl);
  
  // Update sidebar variables
  root.style.setProperty('--sidebar-primary', primaryHsl);
  root.style.setProperty('--sidebar-accent', secondaryHsl);
}

export function getDefaultThemeColors() {
  return {
    primaryColor: '#7C4DFF',
    secondaryColor: '#FF4081',
    accentColor: '#00BCD4',
    backgroundColor: '#121212'
  };
}
