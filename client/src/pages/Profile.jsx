import React from 'react';
import { User, Phone, LogOut, Package, MapPin, ChevronRight, Settings, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { clsx } from 'clsx';

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const menuItems = [
    { icon: Package, label: 'Order History', action: () => navigate('/history'), color: 'text-primary-600' },
    { icon: MapPin, label: 'Saved Addresses', action: () => {}, color: 'text-blue-600' },
    { icon: Settings, label: 'Settings', action: () => {}, color: 'text-gray-600' },
    { icon: ShieldCheck, label: 'Privacy & Security', action: () => {}, color: 'text-green-600' },
    { icon: HelpCircle, label: 'Help & Support', action: () => {}, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <User className="text-primary-600 w-12 h-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">{user?.displayName || 'Sunbrim Customer'}</h1>
          <p className="text-gray-500 font-medium flex items-center justify-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>{user?.phoneNumber || '+254 700 000 000'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="card p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-md hover:border-primary-100"
            >
              <div className="flex items-center space-x-4">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-primary-50 transition-colors", item.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSignOut}
        className="w-full btn-outline border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center space-x-2 py-4 mt-8"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-bold">Sign Out</span>
      </button>

      <div className="text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Version 1.0.0 (SunbrimPremier)</p>
      </div>
    </div>
  );
};

export default Profile;
