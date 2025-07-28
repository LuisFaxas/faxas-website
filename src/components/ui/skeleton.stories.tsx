import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, CardSkeleton, TableRowSkeleton, DashboardStatSkeleton } from './skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic skeletons
export const Default: Story = {
  args: {
    className: 'h-4 w-48',
  },
};

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
};

export const Square: Story = {
  args: {
    className: 'h-16 w-16 rounded-lg',
  },
};

// Different sizes
export const TextLines: Story = {
  render: () => (
    <div className="space-y-2 w-96">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
};

// Pre-built components
export const Card: Story = {
  render: () => <CardSkeleton />,
};

export const TableRow: Story = {
  render: () => (
    <table className="w-full">
      <tbody>
        <TableRowSkeleton />
      </tbody>
    </table>
  ),
};

export const DashboardStat: Story = {
  render: () => <DashboardStatSkeleton />,
};

// Real-world examples
export const ProjectCardSkeleton: Story = {
  render: () => (
    <div className="w-96 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
      <Skeleton className="h-48 w-full mb-4 rounded-xl" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  ),
};

export const NavigationSkeleton: Story = {
  render: () => (
    <nav className="w-full p-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </nav>
  ),
};

export const FormSkeleton: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  ),
};

export const GridSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50">
          <Skeleton className="h-32 w-full mb-3 rounded-lg" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 w-96 bg-white/50 backdrop-blur-sm rounded-xl">
      <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
};

export const DashboardSkeleton: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <DashboardStatSkeleton key={i} />
        ))}
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};