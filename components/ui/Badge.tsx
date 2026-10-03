import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Tag,
} from 'lucide-react';
import { CATEGORY_CONFIG, ExpenseCategory } from '@/lib/utils/categories';

export interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  size = 'md',
  showIcon = true,
  className,
}: CategoryBadgeProps) {
  const categoryKey = (category in CATEGORY_CONFIG
    ? category
    : 'Others') as ExpenseCategory;
  const config = CATEGORY_CONFIG[categoryKey];

  // Dynamic Lucide icon resolution
  const renderIcon = () => {
    const iconSize = size === 'sm' ? 12 : 14;
    switch (categoryKey) {
      case 'Food':
        return <Utensils size={iconSize} />;
      case 'Transport':
        return <Car size={iconSize} />;
      case 'Shopping':
        return <ShoppingBag size={iconSize} />;
      case 'Bills':
        return <Receipt size={iconSize} />;
      case 'Entertainment':
        return <Film size={iconSize} />;
      case 'Health':
        return <HeartPulse size={iconSize} />;
      case 'Education':
        return <GraduationCap size={iconSize} />;
      default:
        return <Tag size={iconSize} />;
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1 rounded-md'
      : 'px-2.5 py-1 text-xs gap-1.5 rounded-lg';

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium border transition-colors select-none',
          config.badgeBg,
          config.badgeText,
          config.badgeBorder,
          sizeClasses,
          className
        )
      )}
    >
      {showIcon && renderIcon()}
      <span>{config.label}</span>
    </span>
  );
}

export default CategoryBadge;
