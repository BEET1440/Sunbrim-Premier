import React from 'react';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ProductCard = ({ product, onOrder }) => {
  const { id, name, price, category, image, description, isAvailable } = product;

  return (
    <div className={twMerge(
      "card flex flex-col group transition-all duration-300",
      !isAvailable && "opacity-60 grayscale"
    )}>
      <div className="relative aspect-square overflow-hidden bg-orange-50">
        <img 
          src={image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop"} 
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-primary-700 uppercase tracking-wider shadow-sm border border-orange-100">
            {category}
          </span>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-800">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 line-clamp-1">{name}</h3>
          <span className="font-bold text-primary-600">
            KSh {price}
          </span>
        </div>
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8">
          {description}
        </p>

        <button
          onClick={() => onOrder(product)}
          disabled={!isAvailable}
          className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-sm font-bold mt-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Quick Order</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
