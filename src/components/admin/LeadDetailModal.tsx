'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  MessageSquare,
  Tag,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { EnhancedLead } from '@/lib/firebase/admin-leads';
import { updateLeadStatus, addLeadNote, addLeadTags, removeLeadTag, type Lead } from '@/lib/firebase/leads';
import { getTemperatureEmoji } from '@/types/portal';
import { useAuthStore } from '@/lib/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface LeadDetailModalProps {
  lead: EnhancedLead;
  onClose: () => void;
  onUpdate: (updatedLead: EnhancedLead) => void;
}

export function LeadDetailModal({ lead, onClose, onUpdate }: LeadDetailModalProps) {
  const { user, userProfile } = useAuthStore();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Predefined tag suggestions
  const tagSuggestions = [
    'High Priority',
    'Follow Up',
    'Enterprise',
    'Startup',
    'E-commerce',
    'SaaS',
    'Mobile App',
    'Web App',
    'Design Focus',
    'Technical',
    'Budget Confirmed',
    'Decision Maker'
  ];

  const handleStatusUpdate = async (newStatus: Lead['status']) => {
    try {
      const success = await updateLeadStatus(lead.id!, newStatus);
      if (success) {
        onUpdate({ ...lead, status: newStatus });
        toast.success('Status updated', `Lead status changed to ${newStatus}`);
      } else {
        toast.error('Update failed', 'Could not update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Update failed', 'An error occurred while updating the lead');
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    
    setIsSaving(true);
    try {
      const success = await addLeadNote(
        lead.id!,
        noteContent,
        user?.uid || '',
        userProfile?.displayName || 'Admin'
      );
      
      if (success) {
        const newNote = {
          content: noteContent,
          authorId: user?.uid || '',
          authorName: userProfile?.displayName || 'Admin',
          createdAt: new Date()
        };
        
        const updatedLead = {
          ...lead,
          notes: [...(lead.notes || []), newNote]
        };
        
        onUpdate(updatedLead);
        setNoteContent('');
        setIsAddingNote(false);
        toast.success('Note added', 'Your note has been saved');
      } else {
        toast.error('Failed to add note', 'Please try again');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Error', 'Failed to add note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!tag.trim() || lead.tags?.includes(tag)) return;
    
    try {
      const success = await addLeadTags(lead.id!, [tag]);
      if (success) {
        const updatedLead = {
          ...lead,
          tags: [...(lead.tags || []), tag]
        };
        onUpdate(updatedLead);
        setNewTag('');
        setIsAddingTag(false);
        toast.success('Tag added', `Added "${tag}" tag`);
      } else {
        toast.error('Failed to add tag', 'Please try again');
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Error', 'Failed to add tag');
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      const success = await removeLeadTag(lead.id!, tag);
      if (success) {
        const updatedLead = {
          ...lead,
          tags: lead.tags?.filter(t => t !== tag) || []
        };
        onUpdate(updatedLead);
        toast.success('Tag removed', `Removed "${tag}" tag`);
      } else {
        toast.error('Failed to remove tag', 'Please try again');
      }
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Error', 'Failed to remove tag');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassPanel className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-glass-lighter">
            <h3 className="text-2xl font-bold text-text-primary">Lead Details</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-glass-light transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary mb-1">Name</p>
                <p className="text-text-primary font-medium">{lead.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary mb-1">Email</p>
                <a href={`mailto:${lead.email}`} className="text-accent-blue hover:underline">
                  {lead.email}
                </a>
              </div>
              
              {lead.phone && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Phone</p>
                  <a href={`tel:${lead.phone}`} className="text-accent-blue hover:underline">
                    {lead.phone}
                  </a>
                </div>
              )}
              
              {lead.company && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Company</p>
                  <p className="text-text-primary">{lead.company}</p>
                </div>
              )}
            </div>
            
            {/* Score and Status */}
            <div className="flex items-center gap-4 p-4 bg-glass-light rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-1">{getTemperatureEmoji(lead.questionnaire?.score || lead.score)}</div>
                <div className="text-sm text-text-secondary">Score: {lead.questionnaire?.score || lead.score}</div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-text-secondary block mb-2">Status</label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as Lead['status'])}
                  className="w-full px-3 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-text-secondary">Tags</p>
                <button
                  onClick={() => setIsAddingTag(true)}
                  className="text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {lead.tags?.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="group flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-full"
                  >
                    <Tag className="w-3 h-3 text-accent-blue" />
                    <span className="text-sm text-text-primary">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-text-secondary hover:text-red-500" />
                    </button>
                  </motion.div>
                ))}
                
                {isAddingTag && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(newTag);
                        }
                      }}
                      placeholder="Add tag..."
                      className="px-3 py-1 text-sm bg-white/50 border border-glass-lighter rounded-full focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                      autoFocus
                    />
                    <button
                      onClick={() => handleAddTag(newTag)}
                      className="text-accent-blue hover:text-accent-purple"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingTag(false);
                        setNewTag('');
                      }}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {isAddingTag && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tagSuggestions
                    .filter(tag => !lead.tags?.includes(tag))
                    .map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="text-xs px-2 py-1 bg-glass-light hover:bg-glass-lighter rounded-full text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
            
            {/* Message */}
            {lead.message && (
              <div>
                <p className="text-sm text-text-secondary mb-2">Message</p>
                <div className="p-4 bg-glass-light rounded-lg">
                  <p className="text-text-primary whitespace-pre-wrap">{lead.message}</p>
                </div>
              </div>
            )}
            
            {/* Questionnaire Responses */}
            {lead.questionnaire && lead.questionnaire.responses && (
              <div>
                <p className="text-sm text-text-secondary mb-2">Questionnaire Responses</p>
                <div className="space-y-3">
                  {lead.questionnaire.responses.map((response, index) => (
                    <div key={index} className="p-4 bg-glass-light rounded-lg">
                      <p className="text-xs text-text-tertiary mb-1">Question {index + 1}</p>
                      <p className="text-sm text-text-secondary mb-2">{response.question}</p>
                      <p className="text-text-primary font-medium">{response.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-text-secondary">Notes</p>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {lead.notes?.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-glass-light rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{note.authorName}</p>
                        <p className="text-xs text-text-tertiary">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-primary whitespace-pre-wrap">{note.content}</p>
                  </motion.div>
                ))}
                
                {isAddingNote && (
                  <div className="p-4 bg-glass-light rounded-lg">
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full px-3 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!noteContent.trim() || isSaving}
                      >
                        <Save className="w-4 h-4" />
                        Save Note
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setIsAddingNote(false);
                          setNoteContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Metadata */}
            {lead.metadata && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lead.metadata.budget && (
                  <div className="p-4 bg-glass-light rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">Budget</p>
                    <p className="text-text-primary font-medium">{lead.metadata.budget}</p>
                  </div>
                )}
                
                {lead.metadata.timeline && (
                  <div className="p-4 bg-glass-light rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">Timeline</p>
                    <p className="text-text-primary font-medium">{lead.metadata.timeline}</p>
                  </div>
                )}
                
                {lead.metadata.projectType && (
                  <div className="p-4 bg-glass-light rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">Project Type</p>
                    <p className="text-text-primary font-medium">{lead.metadata.projectType}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="p-6 border-t border-glass-lighter flex gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.href = `mailto:${lead.email}`}
            >
              <Mail className="w-4 h-4" />
              Send Email
            </Button>
            {lead.phone && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.location.href = `tel:${lead.phone}`}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}