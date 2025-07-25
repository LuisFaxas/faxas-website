'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    // Check if Tailwind styles are loaded
    const testDiv = document.createElement('div');
    testDiv.className = 'bg-blue-500';
    document.body.appendChild(testDiv);
    const computedStyle = window.getComputedStyle(testDiv);
    console.log('Background color of bg-blue-500:', computedStyle.backgroundColor);
    document.body.removeChild(testDiv);

    // Check for custom CSS classes
    const testGlass = document.createElement('div');
    testGlass.className = 'glass-primary';
    document.body.appendChild(testGlass);
    const glassStyle = window.getComputedStyle(testGlass);
    console.log('Glass backdrop filter:', glassStyle.backdropFilter);
    console.log('Glass background:', glassStyle.backgroundColor);
    document.body.removeChild(testGlass);

    // Log all stylesheets
    console.log('Loaded stylesheets:', Array.from(document.styleSheets).map(s => s.href));
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-500 text-white rounded">
          This should be blue with white text
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">
          This should have a gradient background
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
          <div className="relative glass-primary p-4 rounded-lg">
            This should have glass effect over gradient
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          Direct inline glass effect
        </div>
      </div>
    </div>
  );
}