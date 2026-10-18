import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'forest',
  onClick,
}) => {
  const schemeStyles = {
    forest: 'bg-white border-forest/15 hover:border-forest/40',
    sage: 'bg-white border-sage/30 hover:border-sage',
    gold: 'bg-white border-gold/30 hover:border-gold',
    charcoal: 'bg-white border-charcoal/15 hover:border-charcoal/30',
  };

  const iconBgStyles = {
    forest: 'bg-forest/10 text-forest',
    sage: 'bg-sage/20 text-forest',
    gold: 'bg-gold/15 text-gold-dark',
    charcoal: 'bg-charcoal/10 text-charcoal',
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border shadow-sm transition-all duration-200 ${
        schemeStyles[colorScheme] || schemeStyles.forest
      } ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-muted tracking-wide uppercase">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-charcoal tracking-tight font-heading">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-charcoal-muted flex items-center gap-1">
              {trend && (
                <span
                  className={`font-semibold ${
                    trendPositive ? 'text-forest' : 'text-red-600'
                  }`}
                >
                  {trend}
                </span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              iconBgStyles[colorScheme] || iconBgStyles.forest
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
