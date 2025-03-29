
// src/components/layout/AppLayout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  title, 
  subtitle, 
  children, 
  showBackButton,
  onBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-charcoal mb-1">{title}</h1>
            {subtitle && <p className="text-charcoal-muted">{subtitle}</p>}
          </div>
          {showBackButton && (
            <Button variant="outline" onClick={handleBack} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>
      </div>
      <div className="bg-white border border-border rounded-lg shadow-sm p-6">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
