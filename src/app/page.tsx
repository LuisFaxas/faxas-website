'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3, 
  Check, 
  CheckCircle, 
  ChevronRight, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Zap,
  Code2,
  Shield,
  Smartphone,
  Globe,
  DollarSign,
  Users,
  RefreshCw,
  Rocket,
  ShoppingCart,
  Calendar,
  Presentation,
  X
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { EducationalTooltip, tooltips } from '@/components/educational/Tooltip';
import { LiveDemo } from '@/components/showcase/LiveDemo';
import { liveProjects } from '@/data/projects';

// CRUD Demo Component
function InteractiveDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Schedule client meeting', completed: false },
    { id: 2, text: 'Update product catalog', completed: true }
  ]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingId ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="glass-primary p-6 rounded-3xl relative overflow-hidden">
      <div className="mb-4 relative z-10">
        <h4 className="font-semibold mb-2">Try a Mini Task Manager</h4>
        <p className="text-sm text-text-secondary">Experience CRUD operations in action - the foundation of every business app</p>
      </div>
      
      <div className="space-y-4 relative z-10">
        {/* Create */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 glass-secondary backdrop-blur-xl rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 placeholder:text-text-tertiary"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 glass-accent backdrop-blur-xl text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium relative overflow-hidden group"
          >
            <span className="relative z-10">Add</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-75 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Read, Update, Delete */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 p-3 glass-secondary backdrop-blur-xl rounded-xl group hover:shadow-md transition-all duration-300">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 text-accent-blue rounded focus:ring-2 focus:ring-accent-blue/30"
              />
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  className="flex-1 px-2 py-1 glass-light backdrop-blur-xl rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  autoFocus
                />
              ) : (
                <span 
                  className={cn(
                    "flex-1 text-sm cursor-pointer select-none",
                    task.completed && "line-through text-text-secondary opacity-60"
                  )}
                  onClick={() => startEdit(task.id, task.text)}
                >
                  {task.text}
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium text-red-500 hover:text-red-600 glass-secondary backdrop-blur-xl rounded-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        
        <div className="glass-accent backdrop-blur-xl p-4 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-white font-semibold mb-1 flex items-center gap-2">
              <span className="text-base">💡</span> What is CRUD?
            </p>
            <p className="text-xs text-white/80">
              Create, Read, Update, Delete - the four basic operations every business app needs. React makes these instant and seamless!
            </p>
          </div>
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
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                  <span className="text-sm font-medium">Building the Future of Web Development</span>
                </div>
              </motion.div>
              
              {/* Main Headline - Inviting and Educational */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
              >
                Building Lightning-Fast
                <span className="block gradient-text mt-2">Web Experiences</span>
              </motion.h1>
              
              {/* Subtitle - Value and Education Focused */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-text-secondary leading-relaxed"
              >
                I help businesses like yours grow with <EducationalTooltip {...tooltips.react}>modern web applications</EducationalTooltip> that 
                work seamlessly across all devices. Learn how the same technology powering 
                Netflix and Airbnb can <span className="font-semibold text-text-primary">transform your customer experience</span>.
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
                  <p className="font-semibold">Join forward-thinking businesses</p>
                  <p className="text-text-secondary">Learn why modern matters</p>
                </div>
              </motion.div>
              
              {/* CTA Buttons - Elegant Design */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link href="#demo">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <button className="relative px-8 py-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-3 text-gray-900 font-semibold">
                        <div className="relative">
                          <Play className="w-5 h-5 fill-current" />
                          <div className="absolute inset-0 bg-accent-blue/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="text-lg">See Live Demo</span>
                        <ChevronRight className="w-5 h-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </motion.div>
                </Link>
                
                <Link href="#results">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button className="px-8 py-4 bg-transparent backdrop-blur-sm rounded-3xl border-2 border-gray-300/30 hover:border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center gap-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-300">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-lg">View Results</span>
                      </div>
                    </button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Column - What is Modern Web Development? */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <motion.div style={{ y: y1 }} className="space-y-6">
                {/* Educational Preview */}
                <div className="glass-primary p-6 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-accent-blue" />
                    What Makes Modern Web Apps Different?
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-blue mt-2" />
                      <div>
                        <p className="font-medium text-sm">Interactive Like Mobile Apps</p>
                        <p className="text-xs text-text-secondary">No page reloads, instant responses</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-purple mt-2" />
                      <div>
                        <p className="font-medium text-sm">Works Everywhere</p>
                        <p className="text-xs text-text-secondary">Desktop, tablet, phone - one codebase</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      <div>
                        <p className="font-medium text-sm">Built for Growth</p>
                        <p className="text-xs text-text-secondary">Scales with your business needs</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-primary">
                    <Link href="#react-education" className="text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors flex items-center gap-2">
                      <span>Discover the technology difference</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="glass-accent p-6 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent-purple" />
                    Real Results for Real Businesses
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <p className="text-sm">Custom solutions tailored to your needs</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <p className="text-sm">Ongoing support and optimization</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <p className="text-sm">Clear, transparent communication</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* React Education Section */}
      <section id="react-education" className="relative px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Modern Web Technology
              <span className="gradient-text"> Matters for Your Business</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Discover how React and modern frameworks create better experiences for your customers 
              and easier management for your business.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "Traditional HTML Websites",
                traditional: "Static pages that reload entirely when you click a link",
                modern: "Dynamic apps that update instantly without reloading",
                benefit: "Seamless experience keeps visitors engaged",
                color: "blue"
              },
              {
                icon: Smartphone,
                title: "Responsive Design",
                traditional: "Basic mobile view that often breaks or looks cramped",
                modern: "Adaptive layouts that feel native on any device",
                benefit: "Reach customers wherever they are",
                color: "purple",
                hasTooltip: true
              },
              {
                icon: RefreshCw,
                title: "User Interactions",
                traditional: "Forms submit and wait for server response",
                modern: "Instant feedback and real-time updates",
                benefit: "Build trust with immediate responses",
                color: "green"
              }
            ].map((item, index) => (
              <FloatingTile key={index} delay={index * 100} className="glass-primary p-6">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">
                    {item.hasTooltip ? (
                      <EducationalTooltip {...tooltips.responsive}>{item.title}</EducationalTooltip>
                    ) : (
                      item.title
                    )}
                  </h3>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Traditional:</p>
                      <p className="text-sm text-text-secondary">{item.traditional}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-accent-blue uppercase tracking-wider">Modern React:</p>
                      <p className="text-sm font-medium">{item.modern}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-glass-lighter">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {item.benefit}
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
              Experience Modern Web Development
              <span className="gradient-text"> In Action</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Try these interactive demos to understand how React creates seamless, 
              responsive experiences that keep your customers engaged.
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
              Don&apos;t just dream about more sales. See what happens when businesses 
              upgrade to modern web technology.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                category: "E-commerce",
                icon: ShoppingCart,
                improvement: "Faster Checkout Process",
                benefit: "Reduced cart abandonment",
                feature: "Real-time inventory updates and instant form validation"
              },
              {
                category: "Service Business",
                icon: Calendar,
                improvement: "Smart Booking System",
                benefit: "More appointments booked",
                feature: "Live availability and instant confirmation"
              },
              {
                category: "B2B Software",
                icon: Presentation,
                improvement: "Interactive Demos",
                benefit: "Higher engagement rates",
                feature: "No loading delays, seamless user experience"
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
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.category}</h3>
                        <p className="text-sm text-text-secondary">{item.improvement}</p>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-500/5">
                      <p className="text-sm font-medium text-green-700">✓ {item.benefit}</p>
                    </div>
                    
                    <div className="bg-glass-secondary p-3 rounded-lg">
                      <p className="text-xs text-text-secondary">
                        <span className="font-medium text-accent-purple">How it works:</span> {item.feature}
                      </p>
                    </div>
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

      {/* Speed Comparison Demo */}
      <section className="relative px-4 sm:px-6 py-20 bg-gradient-to-b from-transparent via-glass-purple/50 to-transparent">
        <div className="mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See The Speed Difference
              <span className="gradient-text"> For Yourself</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Traditional websites reload the entire page. Modern React apps update only what changes.
              Try this live comparison to feel the difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional Website Demo */}
              <FloatingTile className="glass-primary p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Traditional HTML Website</h3>
                    <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">Slow</span>
                  </div>
                  
                  <div className="bg-glass-secondary rounded-lg p-4 space-y-3">
                    <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
                    <div className="h-20 bg-gray-700/30 rounded animate-pulse" />
                    <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
                  </div>
                  
                  <div className="text-center py-3">
                    <p className="text-2xl font-bold text-red-600">2.4s</p>
                    <p className="text-sm text-text-secondary">Full page reload</p>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-red-600">
                      <X className="w-4 h-4" /> Reloads everything
                    </li>
                    <li className="flex items-center gap-2 text-red-600">
                      <X className="w-4 h-4" /> Loses form data
                    </li>
                    <li className="flex items-center gap-2 text-red-600">
                      <X className="w-4 h-4" /> Screen flashes white
                    </li>
                  </ul>
                </div>
              </FloatingTile>

              {/* React App Demo */}
              <FloatingTile className="glass-primary p-6 border-2 border-green-500/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Modern React Web App</h3>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Fast</span>
                  </div>
                  
                  <div className="bg-glass-secondary rounded-lg p-4 space-y-3">
                    <motion.div 
                      className="h-8 bg-accent-blue/50 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="h-20 bg-accent-purple/30 rounded" />
                    <motion.div 
                      className="h-8 bg-accent-blue/50 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                  
                  <div className="text-center py-3">
                    <p className="text-2xl font-bold text-green-600">0.1s</p>
                    <p className="text-sm text-text-secondary">Instant updates</p>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Updates instantly
                    </li>
                    <li className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Preserves user data
                    </li>
                    <li className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Smooth transitions
                    </li>
                  </ul>
                </div>
              </FloatingTile>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-text-secondary mb-4">
              Speed matters: <span className="font-medium text-white">53% of users abandon sites that take over 3 seconds to load</span>
            </p>
            <a href="#demo" className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-purple transition-colors">
              Try the interactive demos below <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
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
              These aren&apos;t screenshots. These are real, working applications you can interact with. 
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
            {/* Trust Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-green-500/20 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                Trusted Partner
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your
              <span className="gradient-text"> Digital Presence?</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
              Let&apos;s discuss how modern web technology can help your business 
              connect with customers and grow sustainably.
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
              <Link href="/portal/start">
                <Button variant="primary" size="lg" className="group">
                  <span>Start Your Project</span>
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