import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { FormField } from './form-field';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    glass: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    success: {
      control: 'boolean',
    },
    showCount: {
      control: 'boolean',
    },
    maxLength: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic textareas
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Enter your message...',
    defaultValue: 'This is a pre-filled message that demonstrates how the textarea looks with content.',
  },
};

// Variants
export const Error: Story = {
  args: {
    placeholder: 'Describe the issue...',
    error: true,
    defaultValue: 'Too short',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Your feedback...',
    success: true,
    defaultValue: 'Thank you for your detailed feedback! This helps us improve our services.',
  },
};

// Sizes
export const Small: Story = {
  args: {
    placeholder: 'Small textarea',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large textarea for longer content',
    size: 'lg',
  },
};

// Glass effect
export const Glass: Story = {
  args: {
    placeholder: 'Glassmorphic textarea',
    glass: true,
  },
};

// Character count
export const WithCharacterCount: Story = {
  args: {
    placeholder: 'Type your message...',
    showCount: true,
    defaultValue: 'This textarea shows character count',
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Limited to 100 characters...',
    showCount: true,
    maxLength: 100,
    defaultValue: 'This textarea has a maximum length limit. Try typing more to see it in action.',
  },
};

export const NearLimit: Story = {
  args: {
    placeholder: 'Almost at limit...',
    showCount: true,
    maxLength: 50,
    defaultValue: 'This message is very close to the character limit!',
    error: true,
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
    defaultValue: 'This textarea is disabled and cannot be edited.',
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'Read-only textarea',
    readOnly: true,
    defaultValue: 'This content is read-only. Users can select and copy but cannot modify.',
  },
};

// With FormField wrapper
export const InFormField: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <FormField 
        label="Message" 
        required
        helper="Please provide detailed information"
      >
        <Textarea 
          placeholder="Describe your project requirements..."
          showCount
          maxLength={500}
        />
      </FormField>

      <FormField 
        label="Additional Notes" 
        error="Please provide more details (minimum 20 characters)"
      >
        <Textarea 
          placeholder="Any other information..."
          error
          defaultValue="Too short"
          showCount
        />
      </FormField>

      <FormField 
        label="Feedback" 
        success="Thank you for your feedback!"
      >
        <Textarea 
          placeholder="Share your thoughts..."
          success
          defaultValue="Great service! The website loads incredibly fast and the design is beautiful."
        />
      </FormField>
    </div>
  ),
};

// Real-world examples
export const ContactFormMessage: Story = {
  render: () => (
    <div className="w-96 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
      
      <FormField 
        label="How can we help?" 
        required
        helper="Be as specific as possible"
      >
        <Textarea 
          placeholder="I need help with..."
          size="lg"
          showCount
          maxLength={1000}
          defaultValue="I'm interested in building a modern web application for my business. We need a solution that can handle real-time data updates and provide a seamless user experience across all devices."
        />
      </FormField>
    </div>
  ),
};

export const ProjectRequirements: Story = {
  render: () => (
    <div className="w-[500px] p-6 bg-white/10 backdrop-blur-sm rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold">Project Details</h3>
      
      <FormField label="Project Description" required>
        <Textarea 
          placeholder="Describe your project..."
          showCount
          maxLength={500}
          defaultValue="E-commerce platform with real-time inventory management, multi-vendor support, and integrated payment processing."
        />
      </FormField>

      <FormField label="Technical Requirements">
        <Textarea 
          placeholder="Any specific technologies or integrations..."
          size="sm"
          defaultValue="Must integrate with existing CRM system, support mobile apps, and handle 10k+ concurrent users."
        />
      </FormField>

      <FormField label="Timeline & Budget">
        <Textarea 
          placeholder="Project timeline and budget range..."
          size="sm"
          glass
        />
      </FormField>
    </div>
  ),
};