import type { Meta, StoryObj } from '@storybook/react';
import { ToastContainer, toast, useToast } from './toast';
import { Button } from './button';
import { useEffect } from 'react';

// Wrapper component to ensure ToastContainer is rendered
const ToastDemo = () => {
  return (
    <>
      <ToastContainer />
      <div className="space-y-4">
        <div className="space-x-2">
          <Button
            onClick={() => toast.success('Success!', 'Your changes have been saved.')}
            variant="primary"
          >
            Show Success
          </Button>
          <Button
            onClick={() => toast.error('Error!', 'Something went wrong. Please try again.')}
            variant="secondary"
          >
            Show Error
          </Button>
          <Button
            onClick={() => toast.info('Info', 'New update available. Click to learn more.')}
            variant="outline"
          >
            Show Info
          </Button>
          <Button
            onClick={() => toast.warning('Warning', 'Your session will expire in 5 minutes.')}
            variant="ghost"
          >
            Show Warning
          </Button>
        </div>
      </div>
    </>
  );
};

const meta = {
  title: 'Feedback/Toast',
  component: ToastDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic toasts
export const Default: Story = {};

// Multiple toasts
export const MultipleToasts: Story = {
  render: () => {
    const showMultiple = () => {
      toast.success('First toast', 'This appears first');
      setTimeout(() => toast.info('Second toast', 'This appears second'), 500);
      setTimeout(() => toast.warning('Third toast', 'This appears third'), 1000);
    };

    return (
      <>
        <ToastContainer />
        <Button onClick={showMultiple}>
          Show Multiple Toasts
        </Button>
      </>
    );
  },
};

// Auto-dismiss disabled
export const PersistentToast: Story = {
  render: () => {
    const { addToast } = useToast();
    
    const showPersistent = () => {
      addToast({
        type: 'info',
        title: 'Persistent Toast',
        message: 'This toast will not auto-dismiss. Click X to close.',
        duration: 0,
      });
    };

    return (
      <>
        <ToastContainer />
        <Button onClick={showPersistent}>
          Show Persistent Toast
        </Button>
      </>
    );
  },
};

// Real-world examples
export const FormSubmission: Story = {
  render: () => {
    const handleSubmit = async () => {
      toast.info('Submitting...', 'Please wait while we process your request.');
      
      // Simulate API call
      setTimeout(() => {
        toast.success('Form Submitted!', 'We\'ll get back to you within 24 hours.');
      }, 2000);
    };

    return (
      <>
        <ToastContainer />
        <div className="w-96 p-6 bg-white/50 backdrop-blur-sm rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 rounded-lg border"
          />
          <textarea
            placeholder="Message"
            className="w-full mb-4 px-4 py-2 rounded-lg border h-24"
          />
          <Button onClick={handleSubmit} className="w-full">
            Submit Form
          </Button>
        </div>
      </>
    );
  },
};

export const FileUpload: Story = {
  render: () => {
    const handleUpload = () => {
      toast.info('Uploading file...', 'large-document.pdf');
      
      setTimeout(() => {
        toast.success('Upload complete!', 'File uploaded successfully.');
      }, 3000);
    };

    const handleError = () => {
      toast.error('Upload failed', 'File size exceeds 10MB limit.');
    };

    return (
      <>
        <ToastContainer />
        <div className="space-y-4">
          <Button onClick={handleUpload}>
            Simulate Successful Upload
          </Button>
          <Button onClick={handleError} variant="outline">
            Simulate Upload Error
          </Button>
        </div>
      </>
    );
  },
};

export const CopyToClipboard: Story = {
  render: () => {
    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success('Copied!', `"${text}" copied to clipboard`);
    };

    return (
      <>
        <ToastContainer />
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <code className="flex-1">npm install @faxas/ui</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy('npm install @faxas/ui')}
            >
              Copy
            </Button>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <code className="flex-1">API_KEY=your_key_here</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy('API_KEY=your_key_here')}
            >
              Copy
            </Button>
          </div>
        </div>
      </>
    );
  },
};

export const SaveStatus: Story = {
  render: () => {
    const handleSave = () => {
      toast.info('Saving...', 'Your changes are being saved');
      
      setTimeout(() => {
        toast.success('Saved!', 'All changes saved successfully');
      }, 1500);
    };

    const handleAutoSave = () => {
      toast.success('Auto-saved', 'Your work has been automatically saved');
    };

    return (
      <>
        <ToastContainer />
        <div className="space-y-4">
          <Button onClick={handleSave}>
            Manual Save
          </Button>
          <Button onClick={handleAutoSave} variant="outline">
            Trigger Auto-save
          </Button>
        </div>
      </>
    );
  },
};

export const NetworkStatus: Story = {
  render: () => {
    const goOffline = () => {
      toast.error('Connection Lost', 'You are currently offline. Some features may be limited.');
    };

    const goOnline = () => {
      toast.success('Back Online', 'Connection restored. All features are available.');
    };

    return (
      <>
        <ToastContainer />
        <div className="space-y-4">
          <Button onClick={goOffline} variant="outline">
            Simulate Offline
          </Button>
          <Button onClick={goOnline} variant="primary">
            Simulate Online
          </Button>
        </div>
      </>
    );
  },
};

export const ActionFeedback: Story = {
  render: () => {
    return (
      <>
        <ToastContainer />
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => toast.success('Item added', 'Product added to cart')}
            size="sm"
          >
            Add to Cart
          </Button>
          <Button
            onClick={() => toast.info('Item removed', 'Product removed from cart')}
            size="sm"
            variant="outline"
          >
            Remove from Cart
          </Button>
          <Button
            onClick={() => toast.success('Subscribed!', 'You\'ll receive our newsletter')}
            size="sm"
          >
            Subscribe
          </Button>
          <Button
            onClick={() => toast.warning('Logged out', 'You have been logged out')}
            size="sm"
            variant="outline"
          >
            Logout
          </Button>
          <Button
            onClick={() => toast.success('Invite sent', 'Team invitation sent via email')}
            size="sm"
          >
            Invite Member
          </Button>
          <Button
            onClick={() => toast.error('Delete failed', 'Item cannot be deleted')}
            size="sm"
            variant="outline"
          >
            Delete Item
          </Button>
        </div>
      </>
    );
  },
};