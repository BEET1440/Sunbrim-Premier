import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 'Paid', icon: CreditCard, label: 'Paid' },
  { id: 'Baking', icon: Clock, label: 'Baking' },
  { id: 'OutForDelivery', icon: Truck, label: 'Shipping' },
  { id: 'Delivered', icon: PackageCheck, label: 'Arrived' },
];

const StatusTracker = ({ currentStatus }) => {
  const currentIndex = steps.findIndex(step => step.id === currentStatus);
  
  return (
    <div className="w-full py-6">
      <div className="flex justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-orange-100 -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-500 -z-10" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center space-y-2">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                isCompleted ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100" : "bg-white border-orange-100 text-gray-300",
                isCurrent && "ring-4 ring-primary-100 animate-pulse"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={clsx(
                "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                isCompleted ? "text-primary-700" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
