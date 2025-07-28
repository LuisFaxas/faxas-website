import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { FormField } from './form-field';
import { useState } from 'react';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic checkbox
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    defaultChecked: true,
  },
};

export const NoLabel: Story = {
  args: {},
};

// States
export const Error: Story = {
  args: {
    label: 'I agree to the terms',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'This option is disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'This option is locked',
    disabled: true,
    defaultChecked: true,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-2">
        <Checkbox
          label={`Checkbox is ${checked ? 'checked' : 'unchecked'}`}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-gray-600">
          Click to toggle: {checked ? '✓' : '✗'}
        </p>
      </div>
    );
  },
};

// Multiple checkboxes
export const MultipleOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    const options = [
      'React/Next.js Development',
      'UI/UX Design',
      'API Integration',
      'Performance Optimization',
      'Consulting',
    ];

    const toggle = (option: string) => {
      setSelected(prev =>
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    };

    return (
      <div className="space-y-3">
        <p className="font-medium text-sm mb-2">Select services needed:</p>
        {options.map(option => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
          />
        ))}
        <p className="text-sm text-gray-600 mt-4">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

// With FormField
export const InFormField: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <FormField>
        <Checkbox label="Send me promotional emails" />
      </FormField>

      <FormField error="You must accept the terms to continue">
        <Checkbox 
          label="I accept the terms and conditions" 
          error
        />
      </FormField>

      <FormField helper="We'll only send important updates">
        <Checkbox 
          label="Subscribe to newsletter" 
          defaultChecked
        />
      </FormField>
    </div>
  ),
};

// Real-world examples
export const PrivacySettings: Story = {
  render: () => (
    <div className="w-96 p-6 bg-white/10 backdrop-blur-sm rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      
      <div className="space-y-3">
        <Checkbox 
          label="Allow cookies for analytics" 
          defaultChecked
        />
        <Checkbox 
          label="Personalize my experience" 
          defaultChecked
        />
        <Checkbox 
          label="Share data with partners" 
        />
        <Checkbox 
          label="Receive marketing communications" 
        />
      </div>
    </div>
  ),
};

export const ProjectRequirements: Story = {
  render: () => {
    const [requirements, setRequirements] = useState({
      responsive: true,
      seo: true,
      analytics: false,
      cms: false,
      ecommerce: false,
    });

    return (
      <div className="w-96 p-6 bg-white/10 backdrop-blur-sm rounded-2xl space-y-4">
        <h3 className="text-lg font-semibold mb-4">Project Features</h3>
        
        <div className="space-y-3">
          <Checkbox 
            label="Responsive Design (Mobile-First)" 
            checked={requirements.responsive}
            onChange={(e) => setRequirements({...requirements, responsive: e.target.checked})}
          />
          <Checkbox 
            label="SEO Optimization" 
            checked={requirements.seo}
            onChange={(e) => setRequirements({...requirements, seo: e.target.checked})}
          />
          <Checkbox 
            label="Analytics Integration" 
            checked={requirements.analytics}
            onChange={(e) => setRequirements({...requirements, analytics: e.target.checked})}
          />
          <Checkbox 
            label="Content Management System" 
            checked={requirements.cms}
            onChange={(e) => setRequirements({...requirements, cms: e.target.checked})}
          />
          <Checkbox 
            label="E-Commerce Functionality" 
            checked={requirements.ecommerce}
            onChange={(e) => setRequirements({...requirements, ecommerce: e.target.checked})}
          />
        </div>

        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm font-medium">Selected features:</p>
          <p className="text-xs text-gray-600 mt-1">
            {Object.entries(requirements)
              .filter(([_, checked]) => checked)
              .map(([feature]) => feature)
              .join(', ') || 'None selected'}
          </p>
        </div>
      </div>
    );
  },
};