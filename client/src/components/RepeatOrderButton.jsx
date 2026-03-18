import React from 'react';
import { RefreshCcw } from 'lucide-react';

const RepeatOrderButton = ({ onRepeat, order }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRepeat(order);
      }}
      className="flex items-center space-x-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-primary-200"
    >
      <RefreshCcw className="w-4 h-4" />
      <span>Order Again</span>
    </button>
  );
};

export default RepeatOrderButton;
