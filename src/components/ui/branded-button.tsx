
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface BrandedButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const BrandedButton = React.forwardRef<HTMLButtonElement, BrandedButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = "font-display uppercase tracking-wider transition-all duration-300";
    
    const variantClasses = {
      primary: "bg-cc-gold text-cc-teal hover:bg-cc-gold/90 border border-cc-gold",
      secondary: "bg-cc-teal text-cc-gold hover:bg-cc-teal/90 border border-cc-gold",
      outline: "bg-transparent border-2 border-cc-gold text-cc-gold hover:bg-cc-gold/10"
    };
    
    const sizeClasses = {
      sm: "text-xs px-4 py-1.5",
      md: "text-sm px-6 py-2.5",
      lg: "text-base px-8 py-3"
    };
    
    return (
      <Button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

BrandedButton.displayName = "BrandedButton";

export { BrandedButton };
