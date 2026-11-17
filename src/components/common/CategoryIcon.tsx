import React from 'react';
import { Wrench, Zap, Wind, Cpu, Hammer, Sparkles, HelpCircle } from 'lucide-react';
import { ServiceCategoryId } from '../../types';

interface CategoryIconProps {
  categoryId: ServiceCategoryId | string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  categoryId, 
  size = 20, 
  className = '' 
}) => {
  switch (categoryId) {
    case 'plumbing':
      return <Wrench size={size} className={className} />;
    case 'electrical':
      return <Zap size={size} className={className} />;
    case 'ac-repair':
      return <Wind size={size} className={className} />;
    case 'appliance-repair':
      return <Cpu size={size} className={className} />;
    case 'carpentry':
      return <Hammer size={size} className={className} />;
    case 'home-cleaning':
      return <Sparkles size={size} className={className} />;
    default:
      return <HelpCircle size={size} className={className} />;
  }
};
