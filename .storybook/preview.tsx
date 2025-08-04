import React from 'react'
import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'glassmorphism',
      values: [
        {
          name: 'glassmorphism',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Getting Started',
          'UI',
          ['Button', 'GlassPanel', 'GlassCard'],
          'Forms',
          ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'FormField'],
          'Feedback',
          ['Alert', 'Toast', 'Spinner', 'Skeleton', 'EmptyState'],
          'Showcase',
          ['ProjectCard'],
          'Layout',
          'Navigation',
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;