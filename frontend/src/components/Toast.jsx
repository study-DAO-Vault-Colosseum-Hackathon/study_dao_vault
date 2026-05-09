import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-400/30',
      icon: FaCheckCircle,
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-200',
    },
    error: {
      bg: 'bg-red-500/15',
      border: 'border-red-400/30',
      icon: FaExclamationCircle,
      iconColor: 'text-red-400',
      textColor: 'text-red-200',
    },
    info: {
      bg: 'bg-blue-500/15',
      border: 'border-blue-400/30',
      icon: FaInfoCircle,
      iconColor: 'text-blue-400',
      textColor: 'text-blue-200',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`fixed top-6 right-6 max-w-md rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50`}
    >
      <div className="flex items-start gap-4 p-4">
        <div className={`mt-1 flex-shrink-0 ${config.iconColor} text-xl`}>
          <IconComponent />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.textColor}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-2 flex-shrink-0 ${config.textColor} hover:opacity-75 transition`}
        >
          <FaTimes />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`h-1 rounded-b-2xl ${config.bg} origin-left animate-pulse`}
        style={{
          background: type === 'success' ? 'rgba(52, 211, 153, 0.5)' : 
                     type === 'error' ? 'rgba(239, 68, 68, 0.5)' : 
                     'rgba(59, 130, 246, 0.5)',
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
