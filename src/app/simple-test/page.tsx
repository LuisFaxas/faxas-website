'use client';

import { useEffect } from 'react';

export default function SimpleTest() {
  useEffect(() => {
    // Check CSS support
    const supports = CSS.supports('backdrop-filter', 'blur(10px)');
    console.log('Browser supports backdrop-filter:', supports);
    
    const supportsWebkit = CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    console.log('Browser supports -webkit-backdrop-filter:', supportsWebkit);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Simple Tailwind Test</h1>
      
      <div className="grid grid-cols-3 gap-4 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Card 1</h2>
          <p className="text-gray-600 mt-2">Basic white card with shadow</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Card 2</h2>
          <p className="text-gray-600 mt-2">Semi-transparent with backdrop blur</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/50">
          <h2 className="text-xl font-semibold text-gray-800">Card 3</h2>
          <p className="text-gray-600 mt-2">Glass effect with border</p>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-4">Glass Panel Test</h2>
        <p className="text-white/90">This panel should have a glassmorphic effect with blur and transparency.</p>
      </div>
      
      <div className="mt-8 space-y-4 max-w-4xl">
        <div className="glass-primary p-6">
          <h3 className="text-xl font-semibold">Custom Glass Primary</h3>
          <p>Testing our custom glass-primary class</p>
        </div>
        
        <div className="glass-secondary p-6">
          <h3 className="text-xl font-semibold">Custom Glass Secondary</h3>
          <p>Testing our custom glass-secondary class</p>
        </div>
        
        <div className="glass-accent p-6">
          <h3 className="text-xl font-semibold">Custom Glass Accent</h3>
          <p>Testing our custom glass-accent class</p>
        </div>
      </div>
    </div>
  );
}