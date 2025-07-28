import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './alert';
import { useState } from 'react';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
    },
    title: {
      control: 'text',
    },
    icon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic alerts
export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Alert Title',
    children: 'This is an alert with a title and description.',
  },
};

// Variants
export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    children: 'Your changes have been saved successfully.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'There was a problem processing your request. Please try again.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Your session will expire in 5 minutes. Please save your work.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'New features are available. Check out the changelog for details.',
  },
};

// Without icon
export const NoIcon: Story = {
  args: {
    variant: 'info',
    icon: false,
    title: 'No Icon Alert',
    children: 'This alert is displayed without an icon.',
  },
};

// Dismissible alerts
export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <button
          onClick={() => setVisible(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Show Alert Again
        </button>
      );
    }

    return (
      <Alert
        variant="info"
        title="Dismissible Alert"
        onClose={() => setVisible(false)}
      >
        Click the X button to dismiss this alert.
      </Alert>
    );
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="default" title="Default">
        Default alert style for general messages.
      </Alert>
      <Alert variant="success" title="Success">
        Operation completed successfully!
      </Alert>
      <Alert variant="error" title="Error">
        Something went wrong. Please try again.
      </Alert>
      <Alert variant="warning" title="Warning">
        Please review before proceeding.
      </Alert>
      <Alert variant="info" title="Info">
        Here's some helpful information.
      </Alert>
    </div>
  ),
};

// Real-world examples
export const FormValidation: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Alert variant="error" title="Validation Error">
        <ul className="list-disc list-inside space-y-1">
          <li>Email address is required</li>
          <li>Password must be at least 8 characters</li>
          <li>Please accept the terms and conditions</li>
        </ul>
      </Alert>
    </div>
  ),
};

export const SystemStatus: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Alert variant="success" title="All Systems Operational">
        All services are running normally. Last checked: 2 minutes ago.
      </Alert>

      <Alert variant="warning" title="Scheduled Maintenance">
        System maintenance is scheduled for Sunday, 2:00 AM - 4:00 AM EST.
      </Alert>

      <Alert variant="error" title="Service Disruption">
        We're experiencing issues with the payment processing service. Our team is working on a fix.
      </Alert>
    </div>
  ),
};

export const FeatureAnnouncement: Story = {
  render: () => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
      <Alert
        variant="info"
        title="🎉 New Feature: Real-time Collaboration"
        onClose={() => setDismissed(true)}
        className="w-[500px]"
      >
        <p className="mb-2">
          You can now collaborate with your team in real-time. Features include:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Live cursor tracking</li>
          <li>Instant updates</li>
          <li>Comment threads</li>
          <li>Version history</li>
        </ul>
        <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
          Learn more →
        </button>
      </Alert>
    );
  },
};

export const SecurityAlert: Story = {
  render: () => (
    <Alert
      variant="warning"
      title="Security Notice"
      className="w-[450px]"
    >
      <p className="mb-2">
        We've detected a login from a new device:
      </p>
      <div className="bg-yellow-100/50 rounded-lg p-3 text-sm space-y-1">
        <p><strong>Device:</strong> Chrome on Windows</p>
        <p><strong>Location:</strong> New York, USA</p>
        <p><strong>Time:</strong> 2 minutes ago</p>
      </div>
      <p className="mt-3 text-sm">
        If this wasn't you, please{' '}
        <a href="#" className="font-medium underline">
          secure your account
        </a>
        .
      </p>
    </Alert>
  ),
};

export const UpgradePrompt: Story = {
  render: () => (
    <Alert
      variant="default"
      icon={false}
      className="w-[500px] bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Upgrade to Pro</h3>
          <p className="text-sm text-gray-600 mb-3">
            Unlock advanced features and remove all limits
          </p>
          <ul className="text-sm space-y-1 mb-3">
            <li>✓ Unlimited projects</li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
          </ul>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Upgrade Now
        </button>
      </div>
    </Alert>
  ),
};