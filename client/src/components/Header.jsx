import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Package, Menu } from 'lucide-react';

const Header = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">
            Sunbrim<span className="text-primary-600">Premier</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/track" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <Package className="w-6 h-6" />
          </Link>
          {user ? (
            <Link to="/profile" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          ) : (
            <Link to="/login" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
