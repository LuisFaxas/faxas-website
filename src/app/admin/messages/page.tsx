'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Archive,
  Search,
  Calendar,
  User,
  Clock,
  Filter,
  CheckCircle
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { formatDistance } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: any;
}

export default function AdminMessagesPage() {
  const { user, loading } = useAuth();
  // TODO: Fix userProfile - needs to use useAuthStore instead
  const userProfile: any = { role: 'admin' };
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    if (!user || userProfile?.role !== 'admin') return;

    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setMessages(messagesData);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleMarkAsRead = async (messageId: string) => {
    setProcessingId(messageId);
    try {
      await updateDoc(doc(db, 'contacts', messageId), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleArchive = async (messageId: string) => {
    setProcessingId(messageId);
    try {
      await updateDoc(doc(db, 'contacts', messageId), {
        status: 'archived'
      });
    } catch (error) {
      console.error('Error archiving message:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setProcessingId(messageId);
    try {
      await deleteDoc(doc(db, 'contacts', messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Count unread messages
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading || loadingMessages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user || userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-text-secondary">
                {unreadCount > 0 ? `${unreadCount} unread messages` : 'All messages read'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-primary p-4 rounded-xl mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-3">
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'unread') {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <FloatingTile 
                      className={`glass-primary p-4 transition-all ${
                        selectedMessage?.id === message.id 
                          ? 'ring-2 ring-accent-blue' 
                          : 'hover:shadow-lg'
                      } ${
                        message.status === 'unread' 
                          ? 'border-l-4 border-accent-blue' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.status === 'unread' ? (
                            <Mail className="w-4 h-4 text-accent-blue" />
                          ) : (
                            <MailOpen className="w-4 h-4 text-text-secondary" />
                          )}
                          <h3 className="font-semibold text-sm truncate">
                            {message.name}
                          </h3>
                        </div>
                        {message.status === 'archived' && (
                          <Archive className="w-4 h-4 text-text-secondary" />
                        )}
                      </div>
                      
                      <p className="text-xs text-text-secondary mb-1 truncate">
                        {message.email}
                      </p>
                      
                      <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                        {message.message}
                      </p>
                      
                      <p className="text-xs text-text-tertiary">
                        {message.createdAt?.toDate && 
                          formatDistance(message.createdAt.toDate(), new Date(), { addSuffix: true })
                        }
                      </p>
                    </FloatingTile>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredMessages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Mail className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-secondary">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No messages found matching your filters.'
                      : 'No messages yet.'}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedMessage.id}
                >
                  <FloatingTile className="glass-primary p-6 h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{selectedMessage.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {selectedMessage.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {selectedMessage.createdAt?.toDate && 
                              new Date(selectedMessage.createdAt.toDate()).toLocaleDateString()
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedMessage.createdAt?.toDate && 
                              new Date(selectedMessage.createdAt.toDate()).toLocaleTimeString()
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedMessage.status !== 'archived' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleArchive(selectedMessage.id)}
                            disabled={processingId === selectedMessage.id}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(selectedMessage.id)}
                          disabled={processingId === selectedMessage.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-text-primary whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-glass-lighter">
                      <h3 className="text-sm font-medium text-text-secondary mb-4">
                        Quick Actions
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <a href={`mailto:${selectedMessage.email}`}>
                          <Button variant="primary" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Reply via Email
                          </Button>
                        </a>
                        {selectedMessage.status === 'unread' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                            disabled={processingId === selectedMessage.id}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </FloatingTile>
                </motion.div>
              ) : (
                <FloatingTile className="glass-primary p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <Mail className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary">
                      Select a message to view details
                    </p>
                  </div>
                </FloatingTile>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}