import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/70 rounded-2xl border border-charcoal/10 my-4">
      <div className="w-14 h-14 rounded-2xl bg-sage/20 text-forest flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold text-charcoal font-heading">{title}</h4>
      <p className="text-sm text-charcoal-muted max-w-md mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-semibold hover:bg-forest-light transition-all shadow-sm hover:shadow"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
