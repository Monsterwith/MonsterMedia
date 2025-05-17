import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeSettings } from '@/lib/types';
import { getThemeSettings, updateThemeSettings } from '@/lib/api';
import { applyThemeColors, getDefaultThemeColors } from '@/lib/theme';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ThemeContextType {
  theme: ThemeSettings | null;
  isLoading: boolean;
  updateTheme: (settings: Omit<ThemeSettings, 'id' | 'isActive' | 'createdAt'>) => void;
  isPending: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  isLoading: false,
  updateTheme: () => {},
  isPending: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const { toast } = useToast();

  // Query to get theme settings
  const { isLoading } = useQuery({
    queryKey: ['/api/theme'],
    queryFn: async () => {
      try {
        const themeData = await getThemeSettings();
        setTheme(themeData);
        
        // Apply theme colors
        applyThemeColors(
          themeData.primaryColor,
          themeData.secondaryColor,
          themeData.accentColor,
          themeData.backgroundColor
        );
        
        return themeData;
      } catch (err) {
        // Use default theme colors if there's an error
        const defaultColors = getDefaultThemeColors();
        applyThemeColors(
          defaultColors.primaryColor,
          defaultColors.secondaryColor,
          defaultColors.accentColor,
          defaultColors.backgroundColor
        );
        console.error('Failed to fetch theme settings', err);
        return null;
      }
    },
    retry: 1,
  });

  // Mutation to update theme settings
  const mutation = useMutation({
    mutationFn: updateThemeSettings,
    onSuccess: (newTheme) => {
      setTheme(newTheme);
      applyThemeColors(
        newTheme.primaryColor,
        newTheme.secondaryColor,
        newTheme.accentColor,
        newTheme.backgroundColor
      );
      queryClient.invalidateQueries({ queryKey: ['/api/theme'] });
      toast({
        title: "Theme updated",
        description: "The theme settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: (error as Error).message || "Could not update theme settings",
        variant: "destructive",
      });
    },
  });

  const updateTheme = (settings: Omit<ThemeSettings, 'id' | 'isActive' | 'createdAt'>) => {
    mutation.mutate(settings);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isLoading, 
        updateTheme, 
        isPending: mutation.isPending 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
