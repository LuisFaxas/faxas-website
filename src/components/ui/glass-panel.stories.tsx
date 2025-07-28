import type { Meta, StoryObj } from '@storybook/react';
import { GlassPanel } from './glass-panel';

const meta = {
  title: 'UI/GlassPanel',
  component: GlassPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['primary', 'secondary', 'accent'],
      description: 'The level of glass effect applied',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    float: {
      control: 'boolean',
      description: 'Enable floating effect',
    },
  },
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Glass level variations
export const Primary: Story = {
  args: {
    level: 'primary',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Primary Glass</h3>
        <p className="text-gray-600">Strong glass effect with higher opacity and blur</p>
      </div>
    ),
  },
};

export const Secondary: Story = {
  args: {
    level: 'secondary',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Secondary Glass</h3>
        <p className="text-gray-600">Subtle glass effect with medium opacity</p>
      </div>
    ),
  },
};

export const Accent: Story = {
  args: {
    level: 'accent',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Accent Glass</h3>
        <p className="text-gray-600">Gradient glass with blue/purple tint</p>
      </div>
    ),
  },
};

// Interactive examples
export const WithFloat: Story = {
  args: {
    level: 'primary',
    float: true,
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Floating Panel</h3>
        <p className="text-gray-600">Hover over this panel to see the floating effect</p>
      </div>
    ),
  },
};

export const NoFloat: Story = {
  args: {
    level: 'primary',
    float: false,
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Static Panel</h3>
        <p className="text-gray-600">This panel has no floating effects</p>
      </div>
    ),
  },
};

// All glass levels showcase
export const AllGlassLevels: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <GlassPanel level="primary">
        <div className="p-6">
          <h3 className="font-bold">Primary Glass</h3>
          <p className="text-sm text-gray-600">glass-primary class</p>
        </div>
      </GlassPanel>
      <GlassPanel level="secondary">
        <div className="p-6">
          <h3 className="font-bold">Secondary Glass</h3>
          <p className="text-sm text-gray-600">glass-secondary class</p>
        </div>
      </GlassPanel>
      <GlassPanel level="accent">
        <div className="p-6">
          <h3 className="font-bold">Accent Glass</h3>
          <p className="text-sm text-gray-600">glass-accent class</p>
        </div>
      </GlassPanel>
    </div>
  ),
};

// Practical examples
export const ContactCard: Story = {
  args: {
    level: 'primary',
    float: true,
    children: (
      <div className="p-8 w-96">
        <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
        <p className="text-gray-600 mb-6">
          Ready to transform your web presence? Let's discuss your project and create something extraordinary together.
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
          Start Conversation
        </button>
      </div>
    ),
  },
};

export const FeatureCard: Story = {
  args: {
    level: 'secondary',
    float: true,
    className: 'hover:shadow-2xl transition-shadow duration-300',
    children: (
      <div className="p-6">
        <div className="text-4xl mb-4">⚡</div>
        <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
        <p className="text-gray-600">
          Optimized for speed with sub-second load times and 95+ Lighthouse scores
        </p>
      </div>
    ),
  },
};

export const Nested: Story = {
  args: {
    level: 'primary',
    children: (
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">Nested Glass Panels</h2>
        <GlassPanel level="secondary">
          <div className="p-4">
            <h3 className="font-bold">Inner Panel</h3>
            <p className="text-sm">Creating depth with layered glass effects</p>
          </div>
        </GlassPanel>
      </div>
    ),
  },
};