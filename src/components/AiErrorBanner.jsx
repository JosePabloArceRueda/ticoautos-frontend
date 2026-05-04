import React from 'react';

export const AiErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg text-sm flex justify-between items-start gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800 font-bold shrink-0">✕</button>
    </div>
  );
};
