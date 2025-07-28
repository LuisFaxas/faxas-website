import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty-state';
import { 
  Inbox, 
  Search, 
  FileX, 
  Users, 
  ShoppingCart, 
  MessageSquare,
  Folder,
  Calendar,
  Image,
  Database,
  Mail,
  Bell
} from 'lucide-react';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic empty states
export const Default: Story = {
  args: {
    title: 'No data found',
    description: 'There is no data to display at the moment.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: Inbox,
    title: 'No messages',
    description: 'You don\'t have any messages yet. Start a conversation!',
  },
};

export const WithAction: Story = {
  args: {
    icon: FileX,
    title: 'No documents',
    description: 'Upload your first document to get started.',
    action: {
      label: 'Upload Document',
      onClick: () => console.log('Upload clicked'),
    },
  },
};

export const WithBothActions: Story = {
  args: {
    icon: Users,
    title: 'No team members',
    description: 'Invite team members to collaborate on projects.',
    action: {
      label: 'Invite Members',
      onClick: () => console.log('Invite clicked'),
    },
    secondaryAction: {
      label: 'Learn More',
      onClick: () => console.log('Learn more clicked'),
    },
  },
};

// Sizes
export const Small: Story = {
  args: {
    icon: Search,
    title: 'No results',
    description: 'Try adjusting your search.',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    icon: Database,
    title: 'Database is empty',
    description: 'Your database doesn\'t contain any data yet. Import data or create your first record.',
    action: {
      label: 'Import Data',
      onClick: () => console.log('Import clicked'),
    },
    size: 'lg',
  },
};

// Real-world examples
export const SearchNoResults: Story = {
  args: {
    icon: Search,
    title: 'No results found',
    description: 'We couldn\'t find anything matching your search. Try different keywords or filters.',
    action: {
      label: 'Clear Filters',
      onClick: () => console.log('Clear filters'),
    },
    secondaryAction: {
      label: 'Search Tips',
      onClick: () => console.log('Show tips'),
    },
  },
};

export const EmptyCart: Story = {
  args: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything to your cart yet.',
    action: {
      label: 'Start Shopping',
      onClick: () => console.log('Start shopping'),
    },
  },
};

export const NoProjects: Story = {
  args: {
    icon: Folder,
    title: 'No projects yet',
    description: 'Create your first project to start building amazing web experiences.',
    action: {
      label: 'Create Project',
      onClick: () => console.log('Create project'),
    },
    secondaryAction: {
      label: 'Browse Templates',
      onClick: () => console.log('Browse templates'),
    },
  },
};

export const NoNotifications: Story = {
  args: {
    icon: Bell,
    title: 'You\'re all caught up!',
    description: 'No new notifications at the moment.',
    size: 'sm',
  },
};

export const NoComments: Story = {
  args: {
    icon: MessageSquare,
    title: 'No comments yet',
    description: 'Be the first to share your thoughts!',
    action: {
      label: 'Add Comment',
      onClick: () => console.log('Add comment'),
    },
  },
};

export const NoEvents: Story = {
  args: {
    icon: Calendar,
    title: 'No upcoming events',
    description: 'Your calendar is clear. Schedule your first event to get started.',
    action: {
      label: 'Create Event',
      onClick: () => console.log('Create event'),
    },
  },
};

export const NoImages: Story = {
  args: {
    icon: Image,
    title: 'No images uploaded',
    description: 'Upload images to build your media library.',
    action: {
      label: 'Upload Images',
      onClick: () => console.log('Upload images'),
    },
    secondaryAction: {
      label: 'Import from URL',
      onClick: () => console.log('Import from URL'),
    },
  },
};

export const InboxZero: Story = {
  args: {
    icon: Mail,
    title: 'Inbox Zero! 🎉',
    description: 'Great job! You\'ve processed all your emails.',
  },
};

// Complex example with custom styling
export const CustomStyled: Story = {
  render: () => (
    <div className="w-[600px] h-[400px] bg-white rounded-xl border border-gray-200 p-8">
      <EmptyState
        icon={Database}
        title="No data to display"
        description="Connect a data source to see analytics and insights about your projects."
        action={{
          label: 'Connect Data Source',
          onClick: () => console.log('Connect'),
        }}
        secondaryAction={{
          label: 'View Documentation',
          onClick: () => console.log('View docs'),
        }}
        className="h-full"
      />
    </div>
  ),
};

// Multiple empty states
export const EmptyDashboard: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Recent Projects</h3>
        <EmptyState
          icon={Folder}
          title="No projects"
          description="Start your first project"
          size="sm"
        />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Messages</h3>
        <EmptyState
          icon={MessageSquare}
          title="No messages"
          description="Your inbox is empty"
          size="sm"
        />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Notifications</h3>
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="No new notifications"
          size="sm"
        />
      </div>
    </div>
  ),
};