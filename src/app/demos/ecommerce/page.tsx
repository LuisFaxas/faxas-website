'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Package, 
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';

// Mock product data
const products = [
  { id: 1, name: 'Premium Headphones', price: 299, stock: 45, image: '🎧' },
  { id: 2, name: 'Wireless Mouse', price: 79, stock: 123, image: '🖱️' },
  { id: 3, name: 'Mechanical Keyboard', price: 189, stock: 67, image: '⌨️' },
  { id: 4, name: 'USB-C Hub', price: 49, stock: 234, image: '🔌' },
];

export default function EcommerceDemoPage() {
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalValue = Object.entries(cart).reduce((sum, [id, count]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + (product?.price || 0) * count;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-primary p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold gradient-text">E-Commerce Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="glass-accent px-4 py-2 rounded-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold">{totalItems} items</span>
                <span className="text-text-secondary">${totalValue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FloatingTile className="glass-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Revenue Today</p>
                <p className="text-2xl font-bold">$3,456</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </FloatingTile>
          <FloatingTile className="glass-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Orders</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </FloatingTile>
          <FloatingTile className="glass-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Customers</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </FloatingTile>
          <FloatingTile className="glass-primary p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Avg Order</p>
                <p className="text-2xl font-bold">$82</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </FloatingTile>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProduct(product.id)}
            >
              <FloatingTile className="glass-primary p-6 cursor-pointer">
                <div className="text-6xl text-center mb-4">{product.image}</div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <span className="text-sm text-text-secondary">{product.stock} in stock</span>
                </div>
                
                {cart[product.id] ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(product.id);
                      }}
                      className="p-2 glass-secondary rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold">{cart[product.id]} in cart</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product.id);
                      }}
                      className="p-2 glass-secondary rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </FloatingTile>
            </motion.div>
          ))}
        </div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="glass-accent inline-block p-6 rounded-2xl">
            <p className="text-sm text-text-secondary mb-2">
              ✨ Notice how everything updates instantly without page reloads?
            </p>
            <p className="font-medium">
              This is the power of modern React applications!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}