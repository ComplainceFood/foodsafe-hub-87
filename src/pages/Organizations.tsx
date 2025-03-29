
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';

const Organizations: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the organization management page
    navigate('/organization');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-700">Redirecting to Organizations...</p>
      </div>
    </div>
  );
};

export default Organizations;
