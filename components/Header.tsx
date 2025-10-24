
import React from 'react';
import { LayersIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LayersIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">
            Landfill-Compli<span className="text-blue-600">Design</span>
          </h1>
        </div>
        <p className="text-sm text-slate-500 hidden sm:block">AI-Powered Landfill Design & Management</p>
      </div>
    </header>
  );
};
