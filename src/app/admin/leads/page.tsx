'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  Mail, 
  Star
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { getLeads, updateLeadStatus, getLeadQuality, type Lead } from '@/lib/firebase/leads';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, searchQuery, statusFilter, sortBy]);

  const loadLeads = async () => {
    try {
      const fetchedLeads = await getLeads();
      setLeads(fetchedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error('Failed to load leads', 'Please refresh the page to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else {
        // Sort by date (newest first)
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      }
    });

    setFilteredLeads(filtered);
  };

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const success = await updateLeadStatus(leadId, newStatus);
      if (success) {
        // Update local state
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        toast.success('Status updated', `Lead status changed to ${newStatus}`);
      } else {
        toast.error('Update failed', 'Could not update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Update failed', 'An error occurred while updating the lead');
    }
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    converted: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const getScoreColor = (score: number) => {
    const quality = getLeadQuality(score);
    const colors = {
      red: 'text-red-500',
      orange: 'text-orange-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
      gray: 'text-gray-500',
    };
    return colors[quality.color as keyof typeof colors] || 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-secondary">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Lead Management</h1>
          <p className="text-text-secondary mt-1">
            Track and convert your potential clients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-text-primary">{filteredLeads.length}</p>
            <p className="text-xs text-text-secondary">Total Leads</p>
          </div>
          <Button variant="primary" size="md">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GlassPanel className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'all')}
            className="px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
            className="px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      </GlassPanel>

      {/* Leads Table */}
      <GlassPanel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-glass-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-lighter">
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No leads found matching your filters.' 
                      : 'No leads yet. They will appear here when people contact you.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-glass-light/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {lead.name}
                      </p>
                      <p className="text-sm text-text-secondary">{lead.email}</p>
                      {lead.company && (
                        <p className="text-xs text-text-tertiary">{lead.company}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className={cn('w-5 h-5 mr-1', getScoreColor(lead.score))} />
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      statusColors[lead.status]
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {lead.createdAt && formatDistanceToNow(lead.createdAt.toDate(), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(lead.id!, e.target.value as Lead['status']);
                      }}
                      className="px-3 py-1 bg-white/50 border border-glass-lighter rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel className="p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Lead Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Name</p>
                  <p className="text-text-primary font-medium">{selectedLead.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-accent-blue hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                
                {selectedLead.phone && (
                  <div>
                    <p className="text-sm text-text-secondary">Phone</p>
                    <a href={`tel:${selectedLead.phone}`} className="text-accent-blue hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
                
                {selectedLead.company && (
                  <div>
                    <p className="text-sm text-text-secondary">Company</p>
                    <p className="text-text-primary">{selectedLead.company}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-text-secondary">Message</p>
                  <p className="text-text-primary whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
                
                {selectedLead.metadata && (
                  <>
                    {selectedLead.metadata.budget && (
                      <div>
                        <p className="text-sm text-text-secondary">Budget</p>
                        <p className="text-text-primary">{selectedLead.metadata.budget}</p>
                      </div>
                    )}
                    
                    {selectedLead.metadata.timeline && (
                      <div>
                        <p className="text-sm text-text-secondary">Timeline</p>
                        <p className="text-text-primary">{selectedLead.metadata.timeline}</p>
                      </div>
                    )}
                    
                    {selectedLead.metadata.projectType && (
                      <div>
                        <p className="text-sm text-text-secondary">Project Type</p>
                        <p className="text-text-primary">{selectedLead.metadata.projectType}</p>
                      </div>
                    )}
                  </>
                )}
                
                <div className="pt-4 flex gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${selectedLead.email}`}
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedLead(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}