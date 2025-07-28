'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import Link from 'next/link';

export default function NewProjectPage() {
  const { user } = useAuth();
  // TODO: Fix userProfile - needs to use useAuthStore instead
  const userProfile: any = { role: 'admin' };
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    longDescription: '',
    techStack: [] as string[],
    features: [] as string[],
    demoUrl: '',
    liveUrl: '',
    videoUrl: '',
    images: [] as string[],
    status: 'completed' as 'completed' | 'in-progress' | 'concept',
    featured: false,
    metrics: {
      desktop: 90,
      mobile: 85,
      loadTime: 1.0,
      improvement: 0
    },
    testimonial: {
      client: '',
      role: '',
      content: '',
      image: ''
    },
    results: {
      before: '',
      after: '',
      metrics: {
        pageSpeed: { before: 0, after: 0, unit: 's' },
        bounceRate: { before: 0, after: 0, unit: '%' },
        conversion: { before: 0, after: 0, unit: '%' }
      }
    }
  });

  // Input states for array fields
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index)
    });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || userProfile?.role !== 'admin') {
      setError('Unauthorized');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);
      
      // Get the current number of projects to set order
      const projectsCollection = collection(db, 'projects');
      
      await addDoc(projectsCollection, {
        ...formData,
        slug,
        order: Date.now(), // Use timestamp for ordering new projects
        createdAt: new Date(),
        updatedAt: new Date()
      });

      router.push('/admin/projects');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  if (!user || userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-base">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add New Project</h1>
              <p className="text-text-secondary">Create a new portfolio project</p>
            </div>
          </div>

          {error && (
            <div className="glass-light border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <FloatingTile className="glass-primary p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={generateSlug(formData.title)}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Web Application, E-Commerce, SaaS Platform"
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="concept">Concept</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured Project
                    </label>
                  </div>
                </div>
              </div>
            </FloatingTile>

            {/* Tech Stack */}
            <FloatingTile className="glass-primary p-6">
              <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    placeholder="Add technology (e.g., React, Firebase)"
                    className="flex-1 px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTech}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-glass-lighter rounded-lg"
                    >
                      <span className="text-sm">{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FloatingTile>

            {/* Features */}
            <FloatingTile className="glass-primary p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Add feature"
                    className="flex-1 px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-glass-lighter rounded-lg"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </FloatingTile>

            {/* Links & Media */}
            <FloatingTile className="glass-primary p-6">
              <h2 className="text-xl font-semibold mb-4">Links & Media</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://live.example.com"
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Video className="w-4 h-4 inline mr-1" />
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Images
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                      placeholder="Add image URL"
                      className="flex-1 px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    />
                    <Button type="button" variant="secondary" onClick={handleAddImage}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FloatingTile>

            {/* Metrics */}
            <FloatingTile className="glass-primary p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Desktop Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.metrics.desktop}
                    onChange={(e) => setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, desktop: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Mobile Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.metrics.mobile}
                    onChange={(e) => setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, mobile: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Load Time (s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.metrics.loadTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, loadTime: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Improvement %
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.metrics.improvement}
                    onChange={(e) => setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, improvement: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  />
                </div>
              </div>
            </FloatingTile>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/admin/projects">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}