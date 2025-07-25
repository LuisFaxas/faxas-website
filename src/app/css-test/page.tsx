export default function CSSTest() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">CSS Test - Verifying Styles</h1>
      
      {/* Test basic Tailwind */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Basic Tailwind Classes</h2>
        <div className="flex gap-4">
          <div className="w-32 h-32 bg-red-500 rounded">Red Box</div>
          <div className="w-32 h-32 bg-green-500 rounded">Green Box</div>
          <div className="w-32 h-32 bg-blue-500 rounded">Blue Box</div>
        </div>
      </div>

      {/* Test gradients */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Gradient Classes</h2>
        <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white flex items-center justify-center">
          Standard Tailwind Gradient
        </div>
      </div>

      {/* Test backdrop blur */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Backdrop Blur</h2>
        <div className="relative h-32 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg">
          <div className="absolute inset-4 bg-white/30 backdrop-blur-md rounded flex items-center justify-center">
            Backdrop Blur Applied
          </div>
        </div>
      </div>

      {/* Test custom glass classes with inline styles as fallback */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Custom Glass Classes</h2>
        <div className="space-y-4">
          <div 
            className="glass-primary p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
            }}
          >
            Glass Primary (with inline fallback)
          </div>
        </div>
      </div>

      {/* Test custom gradient background */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Custom Gradient Background</h2>
        <div 
          className="gradient-background w-full h-32 rounded-lg"
          style={{
            background: 'linear-gradient(-45deg, #ffffff 0%, #f0f9ff 25%, #fef3f9 50%, #f5f3ff 75%, #ffffff 100%)',
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      {/* Test mesh background */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Mesh Background</h2>
        <div 
          className="mesh-dawn w-full h-32 rounded-lg"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(251, 207, 232, 0.3) 0%, transparent 50%),
              radial-gradient(at 80% 20%, rgba(219, 234, 254, 0.3) 0%, transparent 50%),
              radial-gradient(at 40% 80%, rgba(237, 233, 254, 0.3) 0%, transparent 50%),
              linear-gradient(180deg, #ffffff 0%, #fafafa 100%)
            `
          }}
        />
      </div>

      {/* Test gradient text */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Gradient Text</h2>
        <h3 
          className="gradient-text text-5xl font-bold"
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Gradient Text Effect
        </h3>
      </div>
    </div>
  );
}