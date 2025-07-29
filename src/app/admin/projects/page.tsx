'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUp,
  ArrowDown,
  Search,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Star,
  Check
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features?: string[];
  demoUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  images: string[];
  status: 'completed' | 'in-progress' | 'concept';
  featured: boolean;
  metrics?: {
    desktop: number;
    mobile: number;
    loadTime: number;
    improvement?: number;
  };
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default function AdminProjectsPage() {
  const { user, loading } = useAuth();
  // TODO: Fix userProfile - needs to use useAuthStore instead
  const userProfile = { role: 'admin' as const };
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [savingChanges, setSavingChanges] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    if (!user || userProfile?.role !== 'admin') return;

    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      
      setProjects(projectsData);
      setLoadingProjects(false);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleToggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    setSavingChanges(projectId);
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        featured: !currentFeatured,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
    } finally {
      setSavingChanges(null);
    }
  };

  const handleToggleStatus = async (projectId: string, currentStatus: string) => {
    setSavingChanges(projectId);
    const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
    
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSavingChanges(null);
    }
  };

  const handleUpdateOrder = async (projectId: string, direction: 'up' | 'down') => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const newIndex = direction === 'up' ? projectIndex - 1 : projectIndex + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    setSavingChanges(projectId);
    
    try {
      const batch = writeBatch(db);
      
      // Swap order values
      const currentProject = projects[projectIndex];
      const swapProject = projects[newIndex];
      
      batch.update(doc(db, 'projects', currentProject.id), { 
        order: swapProject.order,
        updatedAt: new Date()
      });
      batch.update(doc(db, 'projects', swapProject.id), { 
        order: currentProject.order,
        updatedAt: new Date()
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setSavingChanges(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setSavingChanges(projectId);
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setSavingChanges(null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category))];

  if (loading || loadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading projects...</p>
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
              <h1 className="text-3xl font-bold mb-2">Manage Projects</h1>
              <p className="text-text-secondary">
                Add, edit, and organize your portfolio projects
              </p>
            </div>
            
            <Link href="/admin/projects/new">
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="glass-primary p-4 rounded-xl mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FloatingTile className="glass-primary p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {project.title}
                              {project.featured && (
                                <Star className="inline-block w-5 h-5 text-yellow-500 ml-2" fill="currentColor" />
                              )}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {project.category} • {project.status}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {project.liveUrl && (
                              <a 
                                href={project.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-glass-lighter rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {project.videoUrl && (
                              <Video className="w-4 h-4 text-text-secondary" />
                            )}
                            {project.images.length > 0 && (
                              <div className="flex items-center gap-1 text-text-secondary">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-sm">{project.images.length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-text-secondary mb-3">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-1 bg-glass-lighter rounded-md text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {project.metrics && (
                          <div className="flex gap-4 text-sm">
                            <span>Desktop: {project.metrics.desktop}</span>
                            <span>Mobile: {project.metrics.mobile}</span>
                            <span>Load: {project.metrics.loadTime}s</span>
                            {project.metrics.improvement && (
                              <span className="text-green-600">
                                +{project.metrics.improvement}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:gap-1">
                        <Button
                          variant={project.featured ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => handleToggleFeatured(project.id, project.featured)}
                          disabled={savingChanges === project.id}
                        >
                          {project.featured ? (
                            <>
                              <Star className="w-4 h-4 mr-1" fill="currentColor" />
                              Featured
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-1" />
                              Feature
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleStatus(project.id, project.status)}
                          disabled={savingChanges === project.id}
                        >
                          {project.status === 'completed' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateOrder(project.id, 'up')}
                            disabled={index === 0 || savingChanges === project.id}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateOrder(project.id, 'down')}
                            disabled={index === filteredProjects.length - 1 || savingChanges === project.id}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Button variant="secondary" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={savingChanges === project.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </FloatingTile>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-text-secondary mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'No projects found matching your filters.'
                  : 'No projects yet. Add your first project!'}
              </p>
              {(!searchTerm && filterCategory === 'all') && (
                <Link href="/admin/projects/new">
                  <Button variant="primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Project
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}