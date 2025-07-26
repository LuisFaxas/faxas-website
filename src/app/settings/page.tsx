'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Save,
  LogOut
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { FloatingTile } from '@/components/ui/floating-tile';
import { auth } from '@/lib/firebase/config';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function SettingsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setError('');
    setMessage('');

    try {
      // Update display name in Auth
      await updateProfile(user, { displayName });

      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        updatedAt: new Date()
      });

      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !email) return;
    
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updateEmail(user, email);
      
      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        email,
        updatedAt: new Date()
      });

      setMessage('Email updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading settings...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {message && (
            <div className="glass-green p-4 rounded-lg mb-6">
              <p className="text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <FloatingTile className="glass-primary p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-accent-blue" />
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Changing your email will require you to verify the new address
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleUpdateProfile}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleUpdateEmail}
                  disabled={saving || email === user.email}
                >
                  Update Email
                </Button>
              </div>
            </div>
          </FloatingTile>

          {/* Security */}
          <FloatingTile className="glass-primary p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-accent-purple" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-glass-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleUpdatePassword}
                disabled={saving || !newPassword || !confirmPassword}
              >
                <Shield className="w-4 h-4 mr-2" />
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </FloatingTile>

          {/* Preferences (Coming Soon) */}
          <FloatingTile className="glass-primary p-6 mb-6 opacity-50">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-accent-green" />
              <h2 className="text-xl font-semibold">Preferences</h2>
              <span className="text-sm text-text-secondary">(Coming Soon)</span>
            </div>

            <div className="space-y-4 text-text-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm">Switch between light and dark themes</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm">Receive updates about your account</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm">Choose your preferred language</p>
                </div>
                <Globe className="w-5 h-5" />
              </div>
            </div>
          </FloatingTile>

          {/* Account Info */}
          <FloatingTile className="glass-secondary p-6">
            <h3 className="font-medium mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Account ID</span>
                <span className="font-mono text-xs">{user.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Account Type</span>
                <span>{userProfile?.role === 'admin' ? 'Administrator' : 'User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Member Since</span>
                <span>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </FloatingTile>
        </motion.div>
      </div>
    </PageLayout>
  );
}