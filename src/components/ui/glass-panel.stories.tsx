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
    glassLevel: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'light', 'lighter'],
      description: 'The level of glass effect applied',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    animate: {
      control: 'boolean',
      description: 'Enable hover animations',
    },
  },
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Glass level variations
export const Primary: Story = {
  args: {
    glassLevel: 'primary',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Primary Glass</h3>
        <p className="text-gray-600">Strong glass effect with 70% opacity and 20px blur</p>
      </div>
    ),
  },
};

export const Secondary: Story = {
  args: {
    glassLevel: 'secondary',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Secondary Glass</h3>
        <p className="text-gray-600">Subtle glass effect with 50% opacity and 12px blur</p>
      </div>
    ),
  },
};

export const Accent: Story = {
  args: {
    glassLevel: 'accent',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Accent Glass</h3>
        <p className="text-gray-600">Gradient glass with blue/purple tint</p>
      </div>
    ),
  },
};

export const Light: Story = {
  args: {
    glassLevel: 'light',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Light Glass</h3>
        <p className="text-gray-600">Light variant with 30% opacity and 8px blur</p>
      </div>
    ),
  },
};

export const Lighter: Story = {
  args: {
    glassLevel: 'lighter',
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Lighter Glass</h3>
        <p className="text-gray-600">Minimal glass with 20% opacity and 4px blur</p>
      </div>
    ),
  },
};

// Interactive examples
export const WithAnimation: Story = {
  args: {
    glassLevel: 'primary',
    animate: true,
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Animated Panel</h3>
        <p className="text-gray-600">Hover over this panel to see the animation</p>
      </div>
    ),
  },
};

export const NoAnimation: Story = {
  args: {
    glassLevel: 'primary',
    animate: false,
    children: (
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-2">Static Panel</h3>
        <p className="text-gray-600">This panel has no hover effects</p>
      </div>
    ),
  },
};

// All glass levels showcase
export const AllGlassLevels: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <GlassPanel glassLevel="primary">
        <div className="p-6">
          <h3 className="font-bold">Primary Glass</h3>
          <p className="text-sm text-gray-600">70% opacity, 20px blur</p>
        </div>
      </GlassPanel>
      <GlassPanel glassLevel="secondary">
        <div className="p-6">
          <h3 className="font-bold">Secondary Glass</h3>
          <p className="text-sm text-gray-600">50% opacity, 12px blur</p>
        </div>
      </GlassPanel>
      <GlassPanel glassLevel="accent">
        <div className="p-6">
          <h3 className="font-bold">Accent Glass</h3>
          <p className="text-sm text-gray-600">Gradient with blue/purple tint</p>
        </div>
      </GlassPanel>
      <GlassPanel glassLevel="light">
        <div className="p-6">
          <h3 className="font-bold">Light Glass</h3>
          <p className="text-sm text-gray-600">30% opacity, 8px blur</p>
        </div>
      </GlassPanel>
      <GlassPanel glassLevel="lighter">
        <div className="p-6">
          <h3 className="font-bold">Lighter Glass</h3>
          <p className="text-sm text-gray-600">20% opacity, 4px blur</p>
        </div>
      </GlassPanel>
    </div>
  ),
};

// Practical examples
export const ContactCard: Story = {
  args: {
    glassLevel: 'primary',
    animate: true,
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
    glassLevel: 'secondary',
    animate: true,
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
    glassLevel: 'light',
    children: (
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">Nested Glass Panels</h2>
        <GlassPanel glassLevel="secondary">
          <div className="p-4">
            <h3 className="font-bold">Inner Panel</h3>
            <p className="text-sm">Creating depth with layered glass effects</p>
          </div>
        </GlassPanel>
      </div>
    ),
  },
};