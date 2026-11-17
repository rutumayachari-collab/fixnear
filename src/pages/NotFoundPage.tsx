import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-[#0B1F3A]">
          <Wrench size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B1F3A]">404</h1>
        <h2 className="text-base font-bold text-gray-800">Page Not Found</h2>
        <p className="text-xs text-[#667085]">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#142d52] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to FixNear Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
