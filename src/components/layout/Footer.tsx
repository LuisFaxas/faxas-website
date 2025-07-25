'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { cn } from '@/lib/utils';

export function Footer() {
  const { isAdmin } = useAuthStore();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Web Development', href: '/projects' },
      { label: 'UI/UX Design', href: '/projects' },
      { label: 'Consulting', href: '/contact' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
    social: [
      { label: 'GitHub', href: 'https://github.com', icon: Github },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
      { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    ],
  };

  return (
    <footer className="relative mt-20 pb-6">
      <GlassPanel level="light" className="mx-4 sm:mx-6 lg:mx-8 rounded-t-[32px]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold gradient-text mb-4">FAXAS</h3>
              <p className="text-sm text-text-secondary mb-4">
                Building premium digital experiences with cutting-edge technology.
              </p>
              <div className="flex space-x-3">
                {footerLinks.social.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-glass-light hover:bg-glass-lighter transition-colors"
                    >
                      <Icon className="w-4 h-4 text-text-secondary hover:text-text-primary" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:hello@faxas.net" className="hover:text-text-primary transition-colors">
                    hello@faxas.net
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4" />
                  United States
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-glass-lighter mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary text-center sm:text-left">
              © {currentYear} FAXAS. All rights reserved.
            </p>

            {/* Admin Access Link */}
            <div className="flex items-center gap-4">
              <p className="text-xs text-text-tertiary hidden sm:block">
                Built with ❤️ by FAXAS
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isAdmin ? (
                  <Link href="/admin">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium shadow-lg"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </motion.div>
                  </Link>
                ) : (
                  <Link href="/admin-login">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-light hover:bg-glass-lighter text-text-tertiary hover:text-text-primary text-xs font-medium transition-all"
                    >
                      <Shield className="w-3 h-3 group-hover:text-accent-blue transition-colors" />
                      <span>Admin</span>
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </footer>
  );
}