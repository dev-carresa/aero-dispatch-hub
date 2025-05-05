
import { LucideIcon, LucideProps } from 'lucide-react';
import { useExtendedTheme } from '../theme/ExtendedThemeProvider';
import { cn } from '@/lib/utils';

interface ThemedIconProps extends LucideProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemedIcon({ 
  icon: Icon, 
  size = 'md', 
  className, 
  ...props 
}: ThemedIconProps) {
  const { accentColor } = useExtendedTheme();
  
  return (
    <Icon 
      className={cn(
        "themed-icon", 
        `icon-size-${size}`,
        `icon-color-${accentColor}`, 
        className
      )} 
      {...props} 
    />
  );
}
