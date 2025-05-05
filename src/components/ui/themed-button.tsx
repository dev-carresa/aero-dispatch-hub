
import { Button, ButtonProps } from "./button";
import { ThemedIcon } from "./themed-icon";
import { LucideIcon } from "lucide-react";

interface ThemedButtonProps extends ButtonProps {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconSize?: 'sm' | 'md' | 'lg';
}

export function ThemedButton({
  children,
  icon,
  iconPosition = 'left',
  iconSize = 'md',
  variant = 'themed',
  ...props
}: ThemedButtonProps) {
  if (!icon) {
    return <Button variant={variant} {...props}>{children}</Button>;
  }

  return (
    <Button variant={variant} {...props}>
      {iconPosition === 'left' && icon && (
        <ThemedIcon icon={icon} size={iconSize} />
      )}
      {children}
      {iconPosition === 'right' && icon && (
        <ThemedIcon icon={icon} size={iconSize} />
      )}
    </Button>
  );
}
