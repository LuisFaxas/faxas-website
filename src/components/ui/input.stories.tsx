import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { FormField } from './form-field';
import { Search, Mail, Lock, User, DollarSign, Calendar, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Forms/Input',
  component: Input,
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
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic inputs
export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Email address',
    defaultValue: 'hello@faxas.net',
  },
};

// Variants
export const Error: Story = {
  args: {
    placeholder: 'Email address',
    error: true,
    defaultValue: 'invalid-email',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Email address',
    success: true,
    defaultValue: 'valid@email.com',
  },
};

// Sizes
export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'lg',
  },
};

// Glass effect
export const Glass: Story = {
  args: {
    placeholder: 'Glassmorphic input',
    glass: true,
  },
};

// With icons
export const WithStartIcon: Story = {
  args: {
    placeholder: 'Search...',
    startIcon: <Search className="w-4 h-4" />,
  },
};

export const WithEndIcon: Story = {
  args: {
    placeholder: 'Enter amount',
    endIcon: <DollarSign className="w-4 h-4" />,
    type: 'number',
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'jane@example.com',
    startIcon: <Mail className="w-4 h-4" />,
    endIcon: <CheckCircle className="w-4 h-4 text-green-500" />,
    success: true,
  },
};

// Input types
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
    startIcon: <Mail className="w-4 h-4" />,
  },
};

export const PasswordInput: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        startIcon={<Lock className="w-4 h-4" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
      />
    );
  },
};

export const DateInput: Story = {
  args: {
    type: 'date',
    startIcon: <Calendar className="w-4 h-4" />,
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0.00',
    min: 0,
    step: 0.01,
    startIcon: <DollarSign className="w-4 h-4" />,
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    defaultValue: 'Cannot edit this',
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: 'Read-only input',
    readOnly: true,
    defaultValue: 'Read-only value',
  },
};

// With FormField wrapper
export const InFormField: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormField 
        label="Email Address" 
        required
        helper="We'll never share your email"
      >
        <Input 
          type="email" 
          placeholder="your@email.com"
          startIcon={<Mail className="w-4 h-4" />}
        />
      </FormField>

      <FormField 
        label="Password" 
        error="Password must be at least 8 characters"
        required
      >
        <Input 
          type="password" 
          placeholder="Enter password"
          error
          startIcon={<Lock className="w-4 h-4" />}
        />
      </FormField>

      <FormField 
        label="Username" 
        success="Username is available!"
      >
        <Input 
          placeholder="Choose a username"
          success
          defaultValue="faxas_dev"
          startIcon={<User className="w-4 h-4" />}
        />
      </FormField>
    </div>
  ),
};

// Real-world examples
export const ContactFormInputs: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      
      <FormField label="Full Name" required>
        <Input 
          placeholder="John Doe"
          startIcon={<User className="w-4 h-4" />}
        />
      </FormField>

      <FormField label="Email" required>
        <Input 
          type="email"
          placeholder="john@company.com"
          startIcon={<Mail className="w-4 h-4" />}
        />
      </FormField>

      <FormField label="Company" helper="Optional">
        <Input 
          placeholder="Acme Inc."
        />
      </FormField>
    </div>
  ),
};

