import React from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';

const RepeatOrderButton = ({ onRepeat, order, isRepeating }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRepeat(order);
      }}
      disabled={isRepeating}
      className="flex items-center space-x-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-primary-200 disabled:opacity-50"
    >
      {isRepeating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCcw className="w-4 h-4" />
      )}
      <span>{isRepeating ? 'Repeating...' : 'Order Again'}</span>
    </button>
  );
};

export default RepeatOrderButton;
