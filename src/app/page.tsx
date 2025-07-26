'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Palette, 
  Zap,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Play,
  MousePointer,
  Smartphone,
  Globe,
  DollarSign,
  Users,
  BarChart3,
  RefreshCw,
  Rocket,
  Server,
  ShoppingCart
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { EducationalTooltip, tooltips } from '@/components/educational/Tooltip';
import { LiveDemo } from '@/components/showcase/LiveDemo';
import { liveProjects } from '@/data/projects';

// Interactive Demo Component
function InteractiveDemo() {
  const [clicks, setClicks] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleClick = () => {
    setClicks(clicks + 1);
    setLastUpdate(new Date());
  };

  return (
    <div className="glass-primary p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Live React Demo</h4>
        <span className="text-xs text-text-secondary">Click the button →</span>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={handleClick}
          className="w-full glass-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 p-4 rounded-xl group"
        >
          <div className="flex items-center justify-center gap-2">
            <MousePointer className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Click Me!</span>
          </div>
        </button>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="glass-secondary p-3 rounded-lg">
            <p className="text-text-secondary text-xs mb-1">Total Clicks</p>
            <p className="text-2xl font-bold gradient-text">{clicks}</p>
          </div>
          <div className="glass-secondary p-3 rounded-lg">
            <p className="text-text-secondary text-xs mb-1">Last Update</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-3 rounded-lg border border-green-500/20">
          <p className="text-xs text-green-700 font-medium">
            ✨ No page reload! Updates instantly like Facebook & Instagram
          </p>
        </div>
      </div>
    </div>
  );
}

// Comparison Widget
function ComparisonWidget() {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');

  return (
    <div className="glass-primary p-6 rounded-2xl">
      <h4 className="font-semibold mb-4">Old Way vs New Way</h4>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('old')}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg transition-all duration-300",
            activeTab === 'old' 
              ? "bg-red-500/20 text-red-700 border border-red-500/30" 
              : "glass-secondary text-text-secondary hover:bg-glass-light"
          )}
        >
          Traditional Website
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg transition-all duration-300",
            activeTab === 'new' 
              ? "bg-green-500/20 text-green-700 border border-green-500/30" 
              : "glass-secondary text-text-secondary hover:bg-glass-light"
          )}
        >
          Modern Web App
        </button>
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        {activeTab === 'old' ? (
          <>
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">Loading... (3-5 seconds)</span>
            </div>
            <div className="flex items-center gap-3 text-red-600">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Full page reload every click</span>
            </div>
            <div className="flex items-center gap-3 text-red-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Higher hosting costs</span>
            </div>
            <div className="flex items-center gap-3 text-red-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">Users leave due to slow speed</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-green-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Instant updates (0.1 seconds)</span>
            </div>
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">No page reloads ever</span>
            </div>
            <div className="flex items-center gap-3 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Better <EducationalTooltip {...tooltips.seo}>SEO</EducationalTooltip> & conversions</span>
            </div>
            <div className="flex items-center gap-3 text-green-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Enterprise-grade security</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  
  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  return (
    <PageLayout>
      {/* Hero Section - Clear Value Proposition */}
      <section ref={heroRef} className="relative min-h-screen flex items-center px-4 sm:px-6 py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Value Proposition */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-6"
            >
              {/* Trust Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <div className="glass-accent px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Trusted by 50+ Small Businesses</span>
                </div>
              </motion.div>
              
              {/* Main Headline - Problem Aware */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
              >
                Your Website is
                <span className="block gradient-text">Losing You Money</span>
              </motion.h1>
              
              {/* Subtitle - Solution Aware */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-text-secondary leading-relaxed"
              >
                While you sleep, <span className="font-semibold text-text-primary">67% of visitors leave</span> your 
                slow website. I build lightning-fast <EducationalTooltip {...tooltips.react}>web apps</EducationalTooltip> that turn browsers into buyers—
                <span className="font-semibold text-text-primary"> guaranteed to load in under 2 seconds</span>.
              </motion.p>
              
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-6"
              >
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Join 50+ happy clients</p>
                  <p className="text-text-secondary">Average ROI: 312% in 6 months</p>
                </div>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link href="#demo">
                  <Button variant="primary" size="lg" className="group">
                    <Play className="w-4 h-4 mr-2" />
                    <span>See Live Demo</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#results">
                  <Button variant="secondary" size="lg">
                    View Client Results
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Interactive Demo Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <motion.div style={{ y: y1 }} className="space-y-6">
                {/* Speed Comparison */}
                <div className="glass-primary p-6 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Your Site vs What I Build
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Traditional Website</span>
                        <span className="text-red-600">5.2s</span>
                      </div>
                      <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 5.2, ease: "linear" }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Modern Web App</span>
                        <span className="text-green-600">0.8s</span>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.8, ease: "linear" }}
                          className="h-full bg-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3">
                    💰 Every second of delay costs you 7% in conversions
                  </p>
                </div>
                
                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <FloatingTile className="glass-accent p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-text-secondary">Faster Load Time</p>
                  </FloatingTile>
                  <FloatingTile className="glass-accent p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">3.2x</p>
                    <p className="text-xs text-text-secondary">More Conversions</p>
                  </FloatingTile>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop Losing Customers to
              <span className="gradient-text"> Slow, Outdated Websites</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Every day your competitors steal your customers with faster, modern websites. 
              Here's what you're missing:
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                problem: "5+ Second Load Times",
                solution: "Sub-1 Second Loading",
                stat: "53% leave after 3 seconds",
                color: "red"
              },
              {
                icon: Smartphone,
                problem: "Broken on Mobile",
                solution: "Perfect on Every Device",
                stat: "65% browse on phones",
                color: "orange",
                hasTooltip: true
              },
              {
                icon: RefreshCw,
                problem: "Full Page Reloads",
                solution: "Instant Updates",
                stat: "Like Netflix & Facebook",
                color: "purple"
              }
            ].map((item, index) => (
              <FloatingTile key={index} delay={index * 100} className="glass-primary p-6">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  
                  <div>
                    <p className="text-sm text-red-600 line-through">{item.problem}</p>
                    <h3 className="text-lg font-semibold text-green-600">
                      {item.hasTooltip ? (
                        <EducationalTooltip {...tooltips.responsive}>{item.solution}</EducationalTooltip>
                      ) : (
                        item.solution
                      )}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-text-secondary">{item.stat}</p>
                  
                  <div className="pt-2 border-t border-glass-lighter">
                    <p className="text-xs font-medium text-text-primary">
                      = More customers for you 💰
                    </p>
                  </div>
                </div>
              </FloatingTile>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative px-4 sm:px-6 py-20 bg-gradient-to-b from-transparent via-glass-blue to-transparent">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See The Difference
              <span className="gradient-text"> In Real-Time</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Don't just take my word for it. Experience the speed and interactivity 
              that's making my clients an average of $50k more per year.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <InteractiveDemo />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ComparisonWidget />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="glass-accent inline-flex items-center gap-2 px-6 py-3 rounded-full">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <p className="font-medium">
                This is built with the same <EducationalTooltip {...tooltips.react}>React technology</EducationalTooltip> as Uber, Airbnb & Netflix
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results/Social Proof Section */}
      <section id="results" className="relative px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Real Results From
              <span className="gradient-text"> Real Businesses</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Don't just dream about more sales. See what happens when businesses 
              upgrade to modern web technology.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Sarah's Boutique",
                before: "$2,400/mo",
                after: "$8,900/mo",
                increase: "271%",
                quote: "My checkout is so fast now, impulse buys went through the roof!"
              },
              {
                name: "Mike's Gym",
                before: "12 signups",
                after: "47 signups",
                increase: "292%",
                quote: "The booking system is instant. Members love it!"
              },
              {
                name: "Tech Solutions Inc",
                before: "3% conversion",
                after: "11% conversion",
                increase: "267%",
                quote: "Our demos load instantly. Game changer for sales."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FloatingTile className="glass-primary p-6 h-full">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-text-secondary">Before</p>
                        <p className="text-lg font-semibold text-red-600">{item.before}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">After</p>
                        <p className="text-lg font-semibold text-green-600">{item.after}</p>
                      </div>
                    </div>
                    
                    <div className="text-center py-2 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+{item.increase}</p>
                      <p className="text-xs text-green-700">increase</p>
                    </div>
                    
                    <p className="text-sm text-text-secondary italic">"{item.quote}"</p>
                  </div>
                </FloatingTile>
              </motion.div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Secure Checkout", value: "SSL + PCI" },
              { icon: Zap, label: "Avg Load Time", value: "0.8s" },
              { icon: Globe, label: "Countries", value: "12+" },
              { icon: Users, label: "Happy Clients", value: "50+" }
            ].map((item, index) => (
              <FloatingTile key={index} delay={index * 50} className="glass-secondary p-4 text-center">
                <item.icon className="w-8 h-8 mx-auto mb-2 text-accent-blue" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-lg font-bold gradient-text">{item.value}</p>
              </FloatingTile>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Value Props */}
      <section className="relative px-4 sm:px-6 py-20 bg-gradient-to-b from-transparent via-glass-purple to-transparent">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Makes Modern Web Apps
              <span className="gradient-text"> So Powerful?</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Simple: They work like the apps on your phone, not like websites from 2010.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Works Like Instagram",
                icon: RefreshCw,
                description: "No page reloads. Everything updates instantly.",
                features: ["Instant feedback", "Smooth animations", "No waiting"],
                example: "Scroll feeds, like posts, instant updates"
              },
              {
                title: "Smart Like Netflix",
                icon: Code2,
                description: "Remembers your customers and what they like.",
                features: ["Personalized experience", "Smart recommendations", "Auto-save"],
                example: "Shows relevant products, saves cart items",
                hasApi: true
              },
              {
                title: "Fast Like Google",
                icon: Zap,
                description: "Loads once, then everything is instant.",
                features: ["Instant search", "No loading screens", "Works offline"],
                example: "Search products, filter results, instant checkout"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FloatingTile className="glass-primary p-6 h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-text-secondary">
                      {item.hasApi ? (
                        <>
                          Remembers your customers and what they like through smart <EducationalTooltip {...tooltips.api}>API integrations</EducationalTooltip>.
                        </>
                      ) : (
                        item.description
                      )}
                    </p>
                    
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t border-glass-lighter">
                      <p className="text-xs text-text-secondary">
                        <span className="font-medium">Example:</span> {item.example}
                      </p>
                    </div>
                  </div>
                </FloatingTile>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Projects Showcase */}
      <section className="relative px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Experience Live Projects
              <span className="gradient-text"> In Action</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              These aren't screenshots. These are real, working applications you can interact with. 
              Try them on any device - they work perfectly everywhere.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {liveProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <LiveDemo {...project} />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="glass-accent inline-block p-6 rounded-2xl">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-accent-purple" />
              <h3 className="text-xl font-semibold mb-2">Want to See More?</h3>
              <p className="text-text-secondary mb-4">
                Visit our projects page to explore the full portfolio
              </p>
              <Link href="/projects">
                <Button variant="primary">
                  View All Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-accent p-8 md:p-12 text-center rounded-[32px] relative overflow-hidden"
          >
            {/* Urgency Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                Limited Spots
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Stop Losing Money?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
              Every day you wait, your competitors get further ahead. 
              Let's build you a website that actually makes money.
            </p>
            
            {/* Value Stack */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left max-w-3xl mx-auto">
              <div className="glass-secondary p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm font-medium">Lightning Fast <EducationalTooltip {...tooltips.hosting}>Cloud Hosting</EducationalTooltip></p>
                <p className="text-xs text-text-secondary">Worth $2,000+/month in sales</p>
              </div>
              <div className="glass-secondary p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm font-medium"><EducationalTooltip {...tooltips.responsive}>Mobile-First</EducationalTooltip> Design</p>
                <p className="text-xs text-text-secondary">65% of your traffic</p>
              </div>
              <div className="glass-secondary p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-sm font-medium">30-Day Guarantee</p>
                <p className="text-xs text-text-secondary">Results or refund</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="primary" size="lg" className="group">
                  <span>Get Your Free Website Audit</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  See More Examples
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-text-secondary mt-6">
              🔥 Only taking 3 new clients this month
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}