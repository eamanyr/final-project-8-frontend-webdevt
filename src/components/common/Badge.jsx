import React from 'react';

export const Badge = ({ children, variant = 'forest', size = 'md', className = '' }) => {
  const variantStyles = {
    forest: 'bg-forest/10 text-forest border-forest/20',
    sage: 'bg-sage/20 text-forest-dark border-sage/40',
    gold: 'bg-gold/20 text-gold-dark border-gold/40',
    charcoal: 'bg-charcoal text-cream border-charcoal',
    cream: 'bg-cream text-charcoal border-charcoal/10',
    outline: 'bg-transparent text-charcoal-muted border-charcoal/20',
    danger: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all ${
        variantStyles[variant] || variantStyles.forest
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};
