import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <PageLayout>

        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <GlassPanel level="accent" float className="inline-block px-4 py-2">
                  <span className="text-sm font-medium text-text-primary">Welcome to the Future of Web Development</span>
                </GlassPanel>
                
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
                  Building <span className="gradient-text">Premium</span> Digital Experiences
                </h2>
                
                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
                  Transform your vision into stunning, glassmorphic web applications that captivate users and drive business growth.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link href="/projects">
                    <Button variant="primary" size="lg" float>
                      View Projects
                    </Button>
                  </Link>
                  <Link href="#about">
                    <Button variant="secondary" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column - Visual Element */}
              <div className="relative mt-8 lg:mt-0">
                <GlassPanel level="primary" float className="p-6 sm:p-8">
                  <div className="space-y-4">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-4/5" />
                    <div className="h-2 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full w-3/5" />
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {['React', 'Next.js', 'TypeScript'].map((tech) => (
                      <GlassPanel key={tech} level="secondary" className="p-3 text-center">
                        <span className="text-sm font-medium">{tech}</span>
                      </GlassPanel>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative px-4 sm:px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">What I Build</h3>
              <p className="text-lg sm:text-xl text-text-secondary">Modern solutions for real business challenges</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <GlassPanel level="primary" className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-blue/20 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Web Applications</h4>
                <p className="text-text-secondary">
                  Full-stack applications with real-time features, beautiful UIs, and scalable architecture
                </p>
              </GlassPanel>
              
              <GlassPanel level="primary" className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">E-commerce Solutions</h4>
                <p className="text-text-secondary">
                  High-converting online stores with secure payments and inventory management
                </p>
              </GlassPanel>
              
              <GlassPanel level="primary" className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Progressive Web Apps</h4>
                <p className="text-text-secondary">
                  Mobile-first experiences that work offline and feel like native apps
                </p>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="relative px-6 py-20 bg-gradient-to-b from-transparent to-glass-light/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">How I Work</h3>
              <p className="text-xl text-text-secondary">A proven process that delivers results</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Discover', desc: 'Understanding your goals and requirements' },
                { step: 2, title: 'Design', desc: 'Creating beautiful, functional interfaces' },
                { step: 3, title: 'Develop', desc: 'Building with clean, scalable code' },
                { step: 4, title: 'Deploy', desc: 'Launching and ongoing support' }
              ].map((item) => (
                <GlassPanel key={item.step} level="secondary" className="p-6">
                  <div className="text-3xl font-bold text-accent-blue mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Preview */}
        <section className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Featured Projects</h3>
              <p className="text-xl text-text-secondary">See what's possible with modern web development</p>
            </div>
            
            <div className="text-center">
              <Link href="/projects">
                <Button variant="primary" size="lg" float>
                  Explore All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <GlassPanel level="accent" className="p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Something Amazing?
              </h3>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                Let's transform your ideas into reality with modern web development that drives results.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="primary" size="lg" float>
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="secondary" size="lg">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </GlassPanel>
          </div>
        </section>
    </PageLayout>
  );
}
