import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from './glass-card';
import { Sparkles, Code2, Rocket, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../button';

const meta = {
  title: 'UI/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['light', 'medium', 'heavy'],
    },
    hoverable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof GlassCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic cards
export const Default: Story = {
  args: {
    children: (
      <p className="text-gray-600">
        This is a glass card with default settings. It provides a beautiful glassmorphic effect for your content.
      </p>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Glass Card Title',
    children: (
      <p className="text-gray-600">
        Cards can have titles to organize content effectively.
      </p>
    ),
  },
};

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Premium Features',
    subtitle: 'Everything you need to build modern web apps',
    children: (
      <ul className="space-y-2 text-gray-600">
        <li>✓ Beautiful glassmorphic design</li>
        <li>✓ Fully responsive layout</li>
        <li>✓ Dark mode support</li>
        <li>✓ Accessibility features</li>
      </ul>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Magical Experience',
    subtitle: 'Delight your users with smooth animations',
    children: (
      <p className="text-gray-600">
        Create stunning visual effects with our glass components that adapt to any design system.
      </p>
    ),
  },
};

// Different levels
export const LightLevel: Story = {
  args: {
    level: 'light',
    title: 'Light Glass Effect',
    children: (
      <p className="text-gray-600">
        This card uses a light glass effect with minimal blur and transparency.
      </p>
    ),
  },
};

export const HeavyLevel: Story = {
  args: {
    level: 'heavy',
    title: 'Heavy Glass Effect',
    children: (
      <p className="text-gray-600">
        This card uses a heavy glass effect with maximum blur and opacity for better readability.
      </p>
    ),
  },
};

// Interactive examples
export const NonHoverable: Story = {
  args: {
    hoverable: false,
    title: 'Static Card',
    children: (
      <p className="text-gray-600">
        This card doesn't have hover effects. Useful for static content or mobile experiences.
      </p>
    ),
  },
};

// Real-world examples
export const FeatureCard: Story = {
  args: {
    icon: <Zap className="w-8 h-8" />,
    title: 'Lightning Fast',
    subtitle: 'Optimized for performance',
    children: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Sub-second load times with advanced optimization techniques including code splitting, lazy loading, and edge caching.
        </p>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-900">0.8s</p>
            <p className="text-gray-500">Load time</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">98</p>
            <p className="text-gray-500">Performance score</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const PricingCard: Story = {
  args: {
    title: 'Professional',
    subtitle: 'Perfect for growing businesses',
    level: 'heavy',
    children: (
      <div className="space-y-6">
        <div>
          <p className="text-4xl font-bold text-gray-900">$99</p>
          <p className="text-gray-500">/month</p>
        </div>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Priority support
          </li>
          <li className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Advanced analytics
          </li>
          <li className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Custom integrations
          </li>
        </ul>
        <Button className="w-full">Get Started</Button>
      </div>
    ),
  },
};

export const ServiceCard: Story = {
  args: {
    icon: <Code2 className="w-10 h-10" />,
    title: 'Web Development',
    children: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Custom web applications built with modern frameworks and best practices.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Next.js</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">TypeScript</span>
        </div>
        <Button variant="ghost" className="w-full">
          Learn More →
        </Button>
      </div>
    ),
  },
};

export const StatsCard: Story = {
  args: {
    level: 'light',
    children: (
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-bold text-gray-900">150+</p>
          <p className="text-sm text-gray-500">Projects</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">98%</p>
          <p className="text-sm text-gray-500">Satisfaction</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">24/7</p>
          <p className="text-sm text-gray-500">Support</p>
        </div>
      </div>
    ),
  },
};

// Grid example
export const CardGrid: Story = {
  args: {
    children: 'Card content',
  },
  render: () => (
    <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
      <GlassCard
        icon={<Rocket className="w-8 h-8" />}
        title="Fast Development"
        level="light"
      >
        <p className="text-gray-600 text-sm">
          Rapid prototyping and iterative development process.
        </p>
      </GlassCard>
      <GlassCard
        icon={<Shield className="w-8 h-8" />}
        title="Secure & Reliable"
        level="medium"
      >
        <p className="text-gray-600 text-sm">
          Enterprise-grade security with 99.9% uptime guarantee.
        </p>
      </GlassCard>
      <GlassCard
        icon={<Globe className="w-8 h-8" />}
        title="Global Scale"
        level="heavy"
      >
        <p className="text-gray-600 text-sm">
          Deploy worldwide with edge computing and CDN support.
        </p>
      </GlassCard>
    </div>
  ),
};

// Complex example
export const TeamMemberCard: Story = {
  args: {
    className: 'w-80',
    children: (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Luis Faxas</h3>
            <p className="text-sm text-gray-600">Full-Stack Developer</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Specializing in React, Next.js, and cloud architecture. Building scalable web applications with modern technologies.
        </p>
        <div className="flex gap-2">
          <Button size="sm">Contact</Button>
          <Button size="sm" variant="ghost">View Work</Button>
        </div>
      </div>
    ),
  },
};