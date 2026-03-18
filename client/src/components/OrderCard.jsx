import React from 'react';
import StatusTracker from './StatusTracker';
import RepeatOrderButton from './RepeatOrderButton';
import { clsx } from 'clsx';
import { Package, MapPin, ChevronRight } from 'lucide-react';

const OrderCard = ({ order, onRepeat, onClick, isRepeating }) => {
  const { id, items, totalAmount, status, createdAt, location } = order;
  const dateStr = new Date(createdAt?.seconds * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      onClick={() => onClick && onClick(order)}
      className="card p-5 space-y-5 group cursor-pointer active:scale-[0.99] transition-all hover:shadow-md hover:border-primary-100"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary-600 border border-orange-100 group-hover:bg-primary-50 transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">#{id.slice(-6)}</span>
            <h3 className="font-bold text-gray-900 line-clamp-1">{items.map(i => i.name).join(', ')}</h3>
            <p className="text-xs text-gray-500 font-medium">{dateStr}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-gray-900 block">KSh {totalAmount}</span>
          <span className={clsx(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
            status === 'Delivered' ? 'bg-green-100 text-green-700' : 
            status === 'Paid' ? 'bg-blue-100 text-blue-700' :
            'bg-orange-100 text-orange-700'
          )}>
            {status}
          </span>
        </div>
      </div>

      {/* Show tracker if active */}
      {status !== 'Delivered' && status !== 'Failed' && (
        <div className="pt-2 border-t border-orange-50">
          <StatusTracker currentStatus={status} />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-orange-50">
        <div className="flex items-center space-x-1 text-gray-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium truncate max-w-[120px]">{location?.address || 'Self-Pickup'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {status === 'Delivered' && (
            <RepeatOrderButton 
              onRepeat={onRepeat} 
              order={order} 
              isRepeating={isRepeating} 
            />
          )}
          <div className="p-2 text-gray-400 group-hover:text-primary-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
