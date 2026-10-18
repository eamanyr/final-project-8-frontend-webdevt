import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useLMS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-forest shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-300 bg-white/95 text-charcoal shadow-emerald-900/10',
          error: 'border-red-300 bg-white/95 text-charcoal shadow-red-900/10',
          warning: 'border-amber-300 bg-white/95 text-charcoal shadow-amber-900/10',
          info: 'border-forest/30 bg-white/95 text-charcoal shadow-forest/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              borders[toast.type] || borders.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <p className="text-xs font-medium leading-relaxed flex-1 pt-0.5">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-charcoal-muted hover:text-charcoal transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
