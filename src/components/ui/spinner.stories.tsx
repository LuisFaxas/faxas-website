import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, LoadingOverlay } from './spinner';
import { Button } from './button';
import { useState } from 'react';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white', 'current'],
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic spinners
export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Loading...',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <div className="bg-gray-800 p-2 rounded">
        <Spinner color="white" />
      </div>
      <div className="text-purple-600">
        <Spinner color="current" />
      </div>
    </div>
  ),
};

// Loading states in buttons
export const InButton: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    
    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
    };

    return (
      <div className="space-y-4">
        <Button onClick={handleClick} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            'Click to Load'
          )}
        </Button>

        <Button variant="secondary" disabled>
          <Spinner size="sm" />
          <span className="ml-2">Loading...</span>
        </Button>

        <Button variant="outline" disabled>
          <Spinner size="sm" color="current" />
          <span className="ml-2">Please wait...</span>
        </Button>
      </div>
    );
  },
};

// Loading overlay examples
export const Overlay: Story = {
  render: () => (
    <div className="relative w-96 h-64 bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-2">Content Area</h3>
      <p className="text-gray-600">This content is covered by a loading overlay.</p>
      <LoadingOverlay visible label="Loading content..." />
    </div>
  ),
};

export const OverlayNoBlur: Story = {
  render: () => (
    <div className="relative w-96 h-64 bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-2">Content Area</h3>
      <p className="text-gray-600">Loading overlay without blur effect.</p>
      <LoadingOverlay visible blur={false} />
    </div>
  ),
};

// Real-world examples
export const FormSubmission: Story = {
  render: () => {
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setTimeout(() => setSubmitting(false), 3000);
    };

    return (
      <form onSubmit={handleSubmit} className="relative w-96 p-6 bg-white/50 backdrop-blur-sm rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 rounded-lg border"
          disabled={submitting}
        />
        <textarea
          placeholder="Message"
          className="w-full mb-4 px-4 py-2 rounded-lg border h-24"
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">Sending...</span>
            </>
          ) : (
            'Send Message'
          )}
        </Button>
        {submitting && <LoadingOverlay visible />}
      </form>
    );
  },
};

export const DataLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <div className="w-96 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Button
            size="sm"
            onClick={() => setLoading(!loading)}
          >
            {loading ? 'Show Data' : 'Show Loading'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-600">Loading project {i + 1}...</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {['Project Alpha', 'Project Beta', 'Project Gamma'].map((project) => (
              <div key={project} className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium">{project}</h4>
                <p className="text-sm text-gray-600">Loaded successfully</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

export const InlineLoading: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span>Checking availability</span>
          <Spinner size="sm" />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Spinner size="xs" color="secondary" />
          <span className="text-sm text-gray-600">Syncing data...</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            <Spinner size="sm" color="current" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900">Processing your request</p>
            <p className="text-blue-700">This may take a few moments</p>
          </div>
        </div>
      </div>
    </div>
  ),
};