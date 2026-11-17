import React from 'react';
import { useFixNear } from '../../context/FixNearContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useFixNear();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-3 bg-[#0B1F3A] text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700 text-sm">
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        <span className="flex-1 font-medium">{toastMessage}</span>
        <button 
          onClick={hideToast}
          className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
          aria-label="Dismiss toast"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
