'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Style Test Page</h1>
      
      {/* Basic Tailwind Test */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Basic Tailwind Test</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-blue-500 rounded"></div>
          <div className="w-20 h-20 bg-purple-500 rounded"></div>
          <div className="w-20 h-20 bg-pink-500 rounded"></div>
        </div>
      </div>
      
      {/* Test gradient background */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Gradient Background Test</h2>
        <div className="w-full h-32 gradient-background rounded-lg border-2 border-gray-300"></div>
      </div>
      
      {/* Test mesh background */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Mesh Background Test</h2>
        <div className="w-full h-32 mesh-dawn rounded-lg border-2 border-gray-300"></div>
      </div>
      
      {/* Test glass panel with background */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Glass Panel Test</h2>
        <div className="relative p-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
          <div className="glass-primary p-4">
            This should have a glass effect with blur
          </div>
        </div>
      </div>
      
      {/* Direct style test */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Direct Style Test</h2>
        <div 
          className="w-full h-32 rounded-lg" 
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          <p className="p-4 text-white">Direct inline styles</p>
        </div>
      </div>
      
      {/* Test custom colors */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Custom Color Test</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-accent-blue rounded"></div>
          <div className="w-20 h-20 bg-accent-purple rounded"></div>
          <div className="w-20 h-20 bg-accent-green rounded"></div>
          <div className="w-20 h-20 bg-accent-pink rounded"></div>
        </div>
      </div>
      
      {/* Test animation */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Animation Test</h2>
        <div className="w-20 h-20 bg-purple-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}