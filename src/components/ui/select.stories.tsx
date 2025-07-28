import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';
import { FormField } from './form-field';

const meta = {
  title: 'Forms/Select',
  component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic selects
export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    children: (
      <>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '2',
    children: (
      <>
        <option value="1">First Option</option>
        <option value="2">Second Option (Selected)</option>
        <option value="3">Third Option</option>
      </>
    ),
  },
};

// Variants
export const Error: Story = {
  args: {
    placeholder: 'Select a valid option',
    error: true,
    children: (
      <>
        <option value="">Please select...</option>
        <option value="invalid">Invalid Option</option>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: 'valid',
    children: (
      <>
        <option value="valid">Valid Selection</option>
        <option value="other">Other Option</option>
      </>
    ),
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small select',
    children: (
      <>
        <option value="1">Sm Option 1</option>
        <option value="2">Sm Option 2</option>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large select',
    children: (
      <>
        <option value="1">Large Option 1</option>
        <option value="2">Large Option 2</option>
      </>
    ),
  },
};

// Glass effect
export const Glass: Story = {
  args: {
    glass: true,
    placeholder: 'Glassmorphic select',
    children: (
      <>
        <option value="1">Glass Option 1</option>
        <option value="2">Glass Option 2</option>
      </>
    ),
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '1',
    children: (
      <>
        <option value="1">Disabled Selection</option>
        <option value="2">Cannot Change</option>
      </>
    ),
  },
};

// Real-world examples
export const ProjectType: Story = {
  args: {
    placeholder: 'Select project type',
    children: (
      <>
        <option value="web-app">Web Application</option>
        <option value="ecommerce">E-Commerce Platform</option>
        <option value="mobile">Mobile App</option>
        <option value="saas">SaaS Product</option>
        <option value="portfolio">Portfolio Website</option>
        <option value="other">Other</option>
      </>
    ),
  },
};

export const BudgetRange: Story = {
  args: {
    placeholder: 'Select budget range',
    children: (
      <>
        <option value="5k-10k">$5,000 - $10,000</option>
        <option value="10k-25k">$10,000 - $25,000</option>
        <option value="25k-50k">$25,000 - $50,000</option>
        <option value="50k-100k">$50,000 - $100,000</option>
        <option value="100k+">$100,000+</option>
      </>
    ),
  },
};

export const Timeline: Story = {
  args: {
    placeholder: 'Project timeline',
    children: (
      <>
        <option value="asap">ASAP</option>
        <option value="1month">Within 1 month</option>
        <option value="3months">1-3 months</option>
        <option value="6months">3-6 months</option>
        <option value="flexible">Flexible</option>
      </>
    ),
  },
};

// With FormField wrapper
export const InFormField: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormField 
        label="Industry" 
        required
        helper="Select your business industry"
      >
        <Select placeholder="Choose industry">
          <option value="tech">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </Select>
      </FormField>

      <FormField 
        label="Company Size" 
        error="Please select company size"
      >
        <Select placeholder="Number of employees" error>
          <option value="">Select size...</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-1000">201-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </Select>
      </FormField>

      <FormField 
        label="Preferred Contact Method" 
        success="Preference saved!"
      >
        <Select defaultValue="email" success>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="video">Video Call</option>
        </Select>
      </FormField>
    </div>
  ),
};

// Complex form example
export const ProjectInquiryForm: Story = {
  render: () => (
    <div className="w-96 p-6 bg-white/10 backdrop-blur-sm rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold mb-4">Project Inquiry</h3>
      
      <FormField label="Service Type" required>
        <Select placeholder="What do you need?">
          <option value="new">New Website/App</option>
          <option value="redesign">Redesign Existing</option>
          <option value="maintenance">Maintenance & Updates</option>
          <option value="consulting">Technical Consulting</option>
          <option value="other">Other Services</option>
        </Select>
      </FormField>

      <FormField label="Budget Range" required>
        <Select placeholder="Select budget">
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-50k">$25,000 - $50,000</option>
          <option value="50k+">$50,000+</option>
        </Select>
      </FormField>

      <FormField label="Timeline">
        <Select placeholder="When do you need it?" glass>
          <option value="asap">As soon as possible</option>
          <option value="1month">Within 1 month</option>
          <option value="3months">Within 3 months</option>
          <option value="flexible">I'm flexible</option>
        </Select>
      </FormField>
    </div>
  ),
};