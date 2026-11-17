import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showDemoNotice?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  reviewCount, 
  size = 14,
  showDemoNotice = true 
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center text-amber-500">
        <Star size={size} className="fill-amber-400 stroke-amber-500" />
        <span className="ml-1 text-xs font-semibold text-[#172033]">{rating.toFixed(1)}</span>
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-[#667085]">
          ({reviewCount} reviews)
        </span>
      )}
      {showDemoNotice && (
        <span className="text-[10px] bg-gray-100 text-[#667085] px-1.5 py-0.2 rounded border border-gray-200" title="Demonstration rating score">
          Demo
        </span>
      )}
    </div>
  );
};
