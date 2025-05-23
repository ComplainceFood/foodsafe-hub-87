
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-gradient-to-b from-primary/90 to-accent/50 border-r border-white/10 shadow-xl backdrop-blur-sm", 
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Animated glow effect on hover */}
        {isHovered && (
          <div 
            className="absolute inset-0 bg-gradient-to-b from-accent/20 to-primary/20 rounded-r-lg opacity-50"
          />
        )}
        
        {/* Background patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// Add the missing exports
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-3 py-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarContent.displayName = "SidebarContent";

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-auto", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

export { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter 
};
