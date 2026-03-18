import React from 'react';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-orange-100 mt-12 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="grid grid-cols-1 gap-8 text-center">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Sunbrim Premier</h3>
            <p className="text-gray-600 text-sm mb-4">
              Premium bakery confectionery for the best bread, cakes, and pastries in town.
            </p>
            <div className="flex justify-center space-x-6 text-primary-600">
              <a href="tel:+254700000000" className="p-2 bg-primary-50 rounded-full">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-50 rounded-full">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-primary-50 rounded-full">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span>Nairobi, Kenya • Open 7AM - 8PM</span>
          </div>
          
          <div className="text-gray-400 text-[10px] uppercase tracking-widest">
            © 2026 Sunbrim Premier. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
