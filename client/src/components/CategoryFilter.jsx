import React from 'react';
import { clsx } from 'clsx';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 px-1 scrollbar-hide -mx-1">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={clsx(
            "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border-2 active:scale-95",
            selectedCategory === category.id
              ? "bg-primary-600 text-white border-primary-600 shadow-md"
              : "bg-white text-gray-600 border-orange-100 hover:border-primary-200 hover:text-primary-600"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
