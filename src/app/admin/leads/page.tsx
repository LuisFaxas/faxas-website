'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter,
  SortDesc,
  RefreshCw,
  X,
  Phone,
  Mail,
  MessageSquare,
  Building,
  Calendar,
  TrendingUp,
  Download,
  ChevronRight
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { updateLeadStatus, type Lead } from '@/lib/firebase/leads';
import { subscribeToLeads, EnhancedLead } from '@/lib/firebase/admin-leads';
import { LeadCard } from '@/components/admin/LeadCard';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { getTemperatureEmoji } from '@/types/portal';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<EnhancedLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<EnhancedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<EnhancedLead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Set up real-time listener
    const unsubscribe = subscribeToLeads(
      (updatedLeads) => {
        setLeads(updatedLeads);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading leads:', error);
        toast.error('Failed to load leads', 'Please check your connection.');
        setIsLoading(false);
      },
      {
        orderByScore: sortBy === 'score'
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [sortBy]);

  useEffect(() => {
    filterAndSortLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, searchQuery, statusFilter]);

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

  // Get temperature-based stats
  const getLeadStats = () => {
    const stats = {
      hot: 0,
      warm: 0,
      qualified: 0,
      cool: 0,
      early: 0,
      total: leads.length
    };

    leads.forEach(lead => {
      const score = lead.questionnaire?.score || lead.score;
      if (score >= 80) stats.hot++;
      else if (score >= 60) stats.warm++;
      else if (score >= 40) stats.qualified++;
      else if (score >= 20) stats.cool++;
      else stats.early++;
    });

    return stats;
  };

  const stats = getLeadStats();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end">
      <AnimatedBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6">
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

      {/* Temperature Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-red-600">{stats.hot}</div>
          <div className="text-xs text-text-secondary">Hot Leads</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🌟</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.warm}</div>
          <div className="text-xs text-text-secondary">Warm Leads</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-2xl font-bold text-blue-600">{stats.qualified}</div>
          <div className="text-xs text-text-secondary">Qualified</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">❄️</div>
          <div className="text-2xl font-bold text-cyan-600">{stats.cool}</div>
          <div className="text-xs text-text-secondary">Cool Leads</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl mb-1">🌱</div>
          <div className="text-2xl font-bold text-green-600">{stats.early}</div>
          <div className="text-xs text-text-secondary">Early Stage</div>
        </GlassPanel>
      </div>

      {/* Leads Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <GlassPanel key={i} className="p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-glass-lighter rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-glass-lighter rounded w-1/4"></div>
                    <div className="h-3 bg-glass-lighter rounded w-1/3"></div>
                  </div>
                  <div className="w-16 h-16 bg-glass-lighter rounded-xl"></div>
                </div>
              </GlassPanel>
            ))}
          </>
        ) : filteredLeads.length === 0 ? (
          <GlassPanel className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No leads found' 
                  : 'No leads yet'}
              </h3>
              <p className="text-text-secondary">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'They will appear here when people contact you or complete the questionnaire.'}
              </p>
            </div>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredLeads.map((lead, index) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
                isSelected={selectedLead?.id === lead.id}
              />
            ))}
          </div>
        )}
      </div>

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
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-text-primary">
                  Lead Details
                </h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-lg hover:bg-glass-light transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Name</p>
                    <p className="text-text-primary font-medium">{selectedLead.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Email</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-accent-blue hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                  
                  {selectedLead.phone && (
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Phone</p>
                      <a href={`tel:${selectedLead.phone}`} className="text-accent-blue hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  
                  {selectedLead.company && (
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Company</p>
                      <p className="text-text-primary">{selectedLead.company}</p>
                    </div>
                  )}
                </div>
                
                {/* Score and Status */}
                <div className="flex items-center gap-4 p-4 bg-glass-light rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-1">{getTemperatureEmoji(selectedLead.questionnaire?.score || selectedLead.score)}</div>
                    <div className="text-sm text-text-secondary">Score: {selectedLead.questionnaire?.score || selectedLead.score}</div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-text-secondary block mb-2">Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusUpdate(selectedLead.id!, e.target.value as Lead['status'])}
                      className="w-full px-3 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                {/* Message */}
                {selectedLead.message && (
                  <div>
                    <p className="text-sm text-text-secondary mb-2">Message</p>
                    <div className="p-4 bg-glass-light rounded-lg">
                      <p className="text-text-primary whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  </div>
                )}
                
                {/* Questionnaire Responses */}
                {selectedLead.questionnaire && selectedLead.questionnaire.responses && (
                  <div>
                    <p className="text-sm text-text-secondary mb-2">Questionnaire Responses</p>
                    <div className="space-y-3">
                      {selectedLead.questionnaire.responses.map((response, index) => (
                        <div key={index} className="p-4 bg-glass-light rounded-lg">
                          <p className="text-xs text-text-tertiary mb-1">Question {index + 1}</p>
                          <p className="text-sm text-text-secondary mb-2">{response.question}</p>
                          <p className="text-text-primary font-medium">{response.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Metadata */}
                {selectedLead.metadata && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedLead.metadata.budget && (
                      <div className="p-4 bg-glass-light rounded-lg">
                        <p className="text-sm text-text-secondary mb-1">Budget</p>
                        <p className="text-text-primary font-medium">{selectedLead.metadata.budget}</p>
                      </div>
                    )}
                    
                    {selectedLead.metadata.timeline && (
                      <div className="p-4 bg-glass-light rounded-lg">
                        <p className="text-sm text-text-secondary mb-1">Timeline</p>
                        <p className="text-text-primary font-medium">{selectedLead.metadata.timeline}</p>
                      </div>
                    )}
                    
                    {selectedLead.metadata.projectType && (
                      <div className="p-4 bg-glass-light rounded-lg">
                        <p className="text-sm text-text-secondary mb-1">Project Type</p>
                        <p className="text-text-primary font-medium">{selectedLead.metadata.projectType}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="pt-4 flex gap-3 border-t border-glass-lighter">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => window.location.href = `mailto:${selectedLead.email}`}
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                  {selectedLead.phone && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => window.location.href = `tel:${selectedLead.phone}`}
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  )}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
      </div>
    </div>
  );
}