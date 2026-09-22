import React from 'react';
import { Outlet } from '@tanstack/react-router';

export const ConditionsLayout: React.FC = () => {
  return (
    <div className="min-h-full">
      <Outlet />
    </div>
  );
};
