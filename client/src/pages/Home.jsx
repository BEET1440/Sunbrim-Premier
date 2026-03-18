import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import OrderModal from '../components/OrderModal';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'bread', name: 'Bread' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'buns', name: 'Buns' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'cookies', name: 'Cookies' },
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'Soft Sandwich Bread', price: 65, category: 'bread', description: 'Freshly baked soft white sandwich bread.', isAvailable: true },
  { id: '2', name: 'Chocolate Fudge Cake', price: 1200, category: 'cakes', description: 'Rich chocolate cake with fudge icing.', isAvailable: true },
  { id: '3', name: 'Glazed Donuts', price: 50, category: 'pastries', description: 'Sweet and fluffy glazed donuts.', isAvailable: true },
  { id: '4', name: 'Oatmeal Cookies', price: 150, category: 'cookies', description: 'Crunchy oatmeal cookies with raisins.', isAvailable: true },
  { id: '5', name: 'Hot Cross Buns', price: 40, category: 'buns', description: 'Traditional spicy hot cross buns.', isAvailable: false },
];

const Home = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from Firestore (real implementation)
  /*
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = selectedCategory === 'all' 
          ? collection(db, 'products') 
          : query(collection(db, 'products'), where('category', '==', selectedCategory));
        
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);
  */

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrder = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          Freshly Baked <br /> 
          <span className="text-primary-600">Daily for You</span>
        </h1>
        <p className="text-gray-500 text-sm">Select your favorite treats and enjoy!</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search products..."
          className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Categories</h2>
        <CategoryFilter 
          categories={CATEGORIES} 
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-xl" />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOrder={handleOrder} 
            />
          ))
        ) : (
          <div className="col-span-2 py-12 text-center">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Bulk buyer support banner */}
      <div className="bg-primary-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Bulk Buyer Support</h3>
          <p className="text-primary-100 text-sm mb-4">Planning an event or need supplies for your shop? Get special rates.</p>
          <button className="bg-white text-primary-900 px-6 py-2 rounded-lg font-bold text-sm shadow-lg">
            Inquire Now
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-800 rounded-full opacity-50 blur-2xl" />
      </div>

      {selectedProduct && (
        <OrderModal 
          product={selectedProduct} 
          user={user}
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};


export default Home;
