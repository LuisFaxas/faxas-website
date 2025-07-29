'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Rocket, 
  Code2, 
  Palette, 
  Users, 
  Target, 
  Sparkles, 
  Calendar,
  Award,
  Heart,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { EducationalTooltip, tooltips } from '@/components/educational/Tooltip';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-6">
              <div className="glass-accent px-4 py-2 rounded-full inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium">Crafting Digital Excellence Since 2024</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              Transforming Ideas Into
              <span className="block gradient-text">Digital Reality</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
            >
              I'm Luis Faxas, a full-stack developer passionate about creating web experiences 
              that not only look beautiful but deliver real business value through modern technology.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/portal/start">
                <Button variant="primary" size="lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  View My Work
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <FloatingTile className="glass-primary p-8 h-full">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h2 className="text-3xl font-bold">My Mission</h2>
                  <p className="text-text-secondary leading-relaxed">
                    To empower small and medium businesses with enterprise-grade web technology, 
                    making the power of modern development accessible to everyone. I believe every 
                    business deserves a website that works as hard as they do.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Transform complex technical concepts into clear business value</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Build websites that convert visitors into customers</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Deliver measurable ROI through modern technology</p>
                    </div>
                  </div>
                </div>
              </FloatingTile>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <FloatingTile className="glass-primary p-8 h-full">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-accent-purple" />
                  </div>
                  <h2 className="text-3xl font-bold">My Vision</h2>
                  <p className="text-text-secondary leading-relaxed">
                    To bridge the gap between cutting-edge technology and practical business needs. 
                    I envision a world where every business, regardless of size, can leverage the 
                    same powerful tools that tech giants use.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Democratize access to premium web technology</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Educate clients about the power of modern development</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Create lasting partnerships, not just transactions</p>
                    </div>
                  </div>
                </div>
              </FloatingTile>
            </motion.div>
          </div>
        </div>
      </section>

      {/* My Approach */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-glass-blue/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How I Work
              <span className="gradient-text"> Differently</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              I don't just build websites. I create digital experiences that educate, 
              engage, and convert your visitors into loyal customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Listen First",
                description: "I start by understanding your business, your customers, and your goals.",
                color: "blue"
              },
              {
                icon: Code2,
                title: "Build Smart",
                description: "Using modern technology like React and Next.js for blazing-fast performance.",
                color: "purple"
              },
              {
                icon: Users,
                title: "Educate Always",
                description: "I explain the technology in terms that make sense for your business.",
                color: "green"
              },
              {
                icon: Award,
                title: "Deliver Value",
                description: "Every feature is designed to impact your bottom line positively.",
                color: "orange"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingTile className="glass-primary p-6 h-full text-center">
                  <div className={`w-16 h-16 rounded-full bg-accent-${item.color}/20 mx-auto mb-4 flex items-center justify-center`}>
                    <item.icon className={`w-8 h-8 text-accent-${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </FloatingTile>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by
              <span className="gradient-text"> Modern Technology</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              I use the same cutting-edge tools that power companies like Netflix, 
              Uber, and Airbnb - but make them accessible for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "React", description: "UI Library", tooltip: tooltips.react },
              { name: "Next.js", description: "Framework", tooltip: tooltips.react },
              { name: "TypeScript", description: "Type Safety" },
              { name: "Tailwind CSS", description: "Styling" },
              { name: "Firebase", description: "Backend" },
              { name: "Vercel", description: "Hosting", tooltip: tooltips.hosting }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {tech.tooltip ? (
                  <EducationalTooltip {...tech.tooltip}>
                    <FloatingTile className="glass-secondary p-4 text-center cursor-help">
                      <p className="font-semibold text-sm">{tech.name}</p>
                      <p className="text-xs text-text-secondary">{tech.description}</p>
                    </FloatingTile>
                  </EducationalTooltip>
                ) : (
                  <FloatingTile className="glass-secondary p-4 text-center">
                    <p className="font-semibold text-sm">{tech.name}</p>
                    <p className="text-xs text-text-secondary">{tech.description}</p>
                  </FloatingTile>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-glass-purple/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built on
              <span className="gradient-text"> Strong Values</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Every project is guided by principles that ensure your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Client Success First",
                description: "Your success is my success. I measure my work by the impact it has on your business growth.",
                points: ["ROI-focused development", "Long-term partnerships", "Continuous support"]
              },
              {
                icon: Shield,
                title: "Transparency Always",
                description: "No jargon, no hidden fees, no surprises. Clear communication and honest pricing every step.",
                points: ["Clear project timelines", "Regular updates", "Open communication"]
              },
              {
                icon: Zap,
                title: "Innovation with Purpose",
                description: "Using cutting-edge technology not for its own sake, but to solve real business problems.",
                points: ["Practical solutions", "Future-proof tech", "Scalable architecture"]
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingTile className="glass-primary p-8 h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-text-secondary">{value.description}</p>
                    <ul className="space-y-2">
                      {value.points.map((point, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FloatingTile>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-primary p-8 md:p-12 rounded-3xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">My Story</h2>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mx-auto mb-6" />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary leading-relaxed mb-6">
                Hi, I'm Luis Faxas. My journey into web development began with a simple question: 
                "Why do small businesses struggle to get the same quality websites as big corporations?"
              </p>
              
              <p className="text-text-secondary leading-relaxed mb-6">
                After years of working with various technologies and seeing businesses lose customers 
                due to slow, outdated websites, I decided to focus on bridging this gap. I specialized 
                in modern web technologies like <EducationalTooltip {...tooltips.react}>React</EducationalTooltip> and 
                Next.js - the same tools used by tech giants - but with a twist: making them 
                accessible and understandable for everyday business owners.
              </p>
              
              <p className="text-text-secondary leading-relaxed mb-6">
                Today, I don't just build websites. I create digital experiences that educate visitors 
                about your value proposition, guide them through their journey, and convert them into 
                loyal customers. Every line of code I write is designed to impact your bottom line.
              </p>
              
              <p className="text-text-secondary leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or sharing my knowledge with the developer community. I believe 
                in continuous learning and bringing the best of what I discover to my clients.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-glass-lighter text-center">
              <p className="text-lg font-medium mb-4">Ready to transform your digital presence?</p>
              <Link href="/portal/start">
                <Button variant="primary" size="lg">
                  Let's Talk
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-glass-green/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Globe className="w-16 h-16 text-accent-blue mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Working
              <span className="gradient-text"> Globally</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Thanks to modern technology, I work with clients worldwide, 
              bringing premium web development to businesses everywhere.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Countries Served", value: "12+" },
                { label: "Happy Clients", value: "50+" },
                { label: "Projects Completed", value: "75+" },
                { label: "Average ROI", value: "312%" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingTile className="glass-primary p-6 text-center">
                    <p className="text-3xl font-bold gradient-text mb-2">{stat.value}</p>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                  </FloatingTile>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-accent p-8 md:p-12 rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Whether you're starting from scratch or looking to upgrade your existing website, 
              I'm here to help you succeed in the digital world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/portal/start">
                <Button variant="primary" size="lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}