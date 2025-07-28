'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  consentManager, 
  ConsentType, 
  COOKIE_CATEGORIES,
  type ConsentSettings 
} from '@/lib/analytics/consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>(consentManager.getConsent());

  useEffect(() => {
    // Check if user has already consented
    if (!consentManager.hasUserConsented()) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // Subscribe to consent changes
    const unsubscribe = consentManager.subscribe((newConsent) => {
      setConsent(newConsent);
    });

    return unsubscribe;
  }, []);

  const handleAcceptAll = () => {
    consentManager.acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    consentManager.rejectAll();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    consentManager.updateConsent({
      [ConsentType.NECESSARY]: true, // Always true
      [ConsentType.ANALYTICS]: consent[ConsentType.ANALYTICS],
      [ConsentType.MARKETING]: consent[ConsentType.MARKETING],
      [ConsentType.PREFERENCES]: consent[ConsentType.PREFERENCES],
    });
    setIsVisible(false);
  };

  const handleToggleConsent = (type: ConsentType, checked: boolean) => {
    setConsent(prev => ({
      ...prev,
      [type]: checked,
    }));
  };

  const getIcon = (type: ConsentType) => {
    switch (type) {
      case ConsentType.NECESSARY:
        return <Shield className="w-5 h-5" />;
      case ConsentType.ANALYTICS:
        return <BarChart3 className="w-5 h-5" />;
      case ConsentType.MARKETING:
        return <Cookie className="w-5 h-5" />;
      case ConsentType.PREFERENCES:
        return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <GlassPanel level="primary" className="mx-auto max-w-6xl">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main content */}
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies to enhance your browsing experience and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage 
                  your preferences by clicking "Manage Preferences".
                </p>

                {/* Detailed preferences */}
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 py-4 border-t border-border"
                  >
                    {Object.entries(COOKIE_CATEGORIES).map(([type, category]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getIcon(type as ConsentType)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium">{category.name}</h3>
                              <Checkbox
                                checked={consent[type as ConsentType]}
                                onChange={(e) => 
                                  handleToggleConsent(type as ConsentType, e.target.checked)
                                }
                                disabled={type === ConsentType.NECESSARY}
                                aria-label={`Toggle ${category.name} cookies`}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {category.description}
                            </p>
                            <div className="space-y-1">
                              {category.cookies.map((cookie, index) => (
                                <div key={index} className="text-xs text-muted-foreground">
                                  <span className="font-medium">{cookie.name}</span> - 
                                  {' '}{cookie.purpose} ({cookie.duration})
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDetails(!showDetails)}
                    className="sm:mr-auto"
                  >
                    {showDetails ? 'Hide' : 'Manage'} Preferences
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="glass"
                      onClick={handleRejectAll}
                    >
                      Reject All
                    </Button>
                    
                    {showDetails ? (
                      <Button
                        variant="primary"
                        onClick={handleSavePreferences}
                      >
                        Save Preferences
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleAcceptAll}
                      >
                        Accept All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Privacy links */}
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  By using our website, you agree to our{' '}
                  <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                  </a>
                  .
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Cookie settings button for footer/settings page
export function CookieSettingsButton() {
  const [showBanner, setShowBanner] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowBanner(true)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Cookie className="w-4 h-4" />
        Cookie Settings
      </button>
      
      {showBanner && <CookieConsent />}
    </>
  );
}