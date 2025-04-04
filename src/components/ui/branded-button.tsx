
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface BrandedButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const BrandedButton = React.forwardRef<HTMLButtonElement, BrandedButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = "font-display uppercase tracking-wider transition-all duration-300";
    
    const variantClasses = {
      primary: "bg-accent text-white hover:bg-accent/90 border border-accent",
      secondary: "bg-primary text-white hover:bg-primary/90 border border-accent",
      outline: "bg-transparent border-2 border-accent text-accent hover:bg-accent/10"
    };
    
    const sizeClasses = {
      sm: "text-xs px-4 py-1.5",
      md: "text-sm px-6 py-2.5",
      lg: "text-base px-8 py-3"
    };
    
    // Convert our custom size to base Button size
    const buttonSize = 
      size === 'lg' ? 'lg' : 
      size === 'sm' ? 'sm' : 
      'default';
    
    // Map our custom variant to a base Button variant
    const buttonVariant = 
      variant === 'outline' ? 'outline' : 
      'default';
    
    return (
      <Button
        ref={ref}
        size={buttonSize}
        variant={buttonVariant}
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
