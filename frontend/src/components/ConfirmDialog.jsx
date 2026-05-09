import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

export default function ConfirmDialog({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm, 
  onCancel 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-sm w-full mx-4 rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-1 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
        >
          <FaTimes />
        </button>

        {/* Icon */}
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl mb-6 ${
          isDangerous 
            ? 'bg-red-500/15 text-red-400' 
            : 'bg-amber-500/15 text-amber-400'
        }`}>
          <FaExclamationTriangle className="text-xl" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white text-center mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-slate-400 text-center mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/30'
                : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/30'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
