'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Rocket
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/lib/store/authStore';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassPanel } from '@/components/ui/glass-panel';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

// Floating animation variants
const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress steps
const steps = [
  { id: 1, name: 'Account', icon: User },
  { id: 2, name: 'Security', icon: Shield },
  { id: 3, name: 'Welcome', icon: Rocket }
];

// Decorative floating elements
function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-tr from-accent-green/20 to-accent-blue/20 rounded-full blur-2xl"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-bl from-accent-blue/30 to-accent-purple/30 rounded-full blur-lg"
        variants={floatAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 4 }}
      />
    </>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, error, clearError, isLoading } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    return '';
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return strength;
  };

  // Validate current step
  const validateStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name) errors.name = 'Name is required';
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    } else if (currentStep === 2) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        errors.terms = 'You must agree to the terms';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    clearError();
    
    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      setCurrentStep(3); // Show success screen
      toast.success('Welcome aboard!', 'Your account has been created successfully.');
      
      // Redirect after showing success
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 2000);
    } else {
      setIsSubmitting(false);
      toast.error('Registration failed', result.error || 'Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Welcome!', 'Successfully signed up with Google.');
      router.push('/portal/dashboard');
    }
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background-start via-background-middle to-background-end overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Welcome content (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink mb-6"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Start Your Journey
              </h1>
              <p className="text-lg text-text-secondary">
                Join thousands of businesses transforming their digital presence with FAXAS.
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Expert Development</h3>
                  <p className="text-sm text-text-secondary">Work with seasoned professionals who understand your vision</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Modern Technology</h3>
                  <p className="text-sm text-text-secondary">Built with cutting-edge tools for optimal performance</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Dedicated Support</h3>
                  <p className="text-sm text-text-secondary">Get help whenever you need it with our responsive team</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Registration form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Back to Home */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-text-secondary hover:text-accent-blue transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Home</span>
            </Link>

            <GlassPanel className="p-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: currentStep >= step.id || currentStep === 3 ? 1 : 0.8,
                        opacity: 1
                      }}
                      className={cn(
                        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                        currentStep >= step.id || currentStep === 3
                          ? "bg-gradient-to-br from-accent-blue to-accent-purple"
                          : "bg-glass-lighter"
                      )}
                    >
                      <step.icon className={cn(
                        "w-5 h-5",
                        currentStep >= step.id || currentStep === 3 ? "text-white" : "text-text-tertiary"
                      )} />
                      {currentStep > step.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -inset-1 rounded-full bg-accent-blue/20"
                        />
                      )}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-12 h-0.5 mx-2 transition-all duration-300",
                        currentStep > step.id ? "bg-accent-blue" : "bg-glass-lighter"
                      )} />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Let's get started
                      </h2>
                      <p className="text-text-secondary">
                        Tell us a bit about yourself
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-lg glass-accent border border-red-500/30 text-red-600 dark:text-red-400 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Full Name
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (focusedField === 'name' && validationErrors.name) {
                                setValidationErrors({ ...validationErrors, name: '' });
                              }
                            }}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => {
                              setFocusedField(null);
                              if (!formData.name) {
                                setValidationErrors({ ...validationErrors, name: 'Name is required' });
                              }
                            }}
                            className={cn(
                              "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                              "border-2 rounded-2xl transition-all duration-300",
                              "focus:outline-none focus:ring-0",
                              validationErrors.name
                                ? "border-red-400 bg-red-50/30"
                                : focusedField === 'name'
                                ? "border-accent-blue bg-white/70 shadow-lg"
                                : "border-glass-lighter hover:border-glass-light"
                            )}
                            placeholder="John Doe"
                          />
                          <User className={cn(
                            "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                            focusedField === 'name' ? "text-accent-blue" : "text-text-tertiary"
                          )} />
                          {focusedField === 'name' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                            />
                          )}
                        </div>
                        {validationErrors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Email Address
                        </label>
                        <div className="relative group">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (focusedField === 'email') {
                                const emailError = validateEmail(e.target.value);
                                setValidationErrors({ ...validationErrors, email: emailError });
                              }
                            }}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => {
                              setFocusedField(null);
                              const emailError = validateEmail(formData.email);
                              setValidationErrors({ ...validationErrors, email: emailError });
                            }}
                            className={cn(
                              "w-full px-4 py-3 pl-12 bg-white/50 backdrop-blur-sm",
                              "border-2 rounded-2xl transition-all duration-300",
                              "focus:outline-none focus:ring-0",
                              validationErrors.email
                                ? "border-red-400 bg-red-50/30"
                                : focusedField === 'email'
                                ? "border-accent-blue bg-white/70 shadow-lg"
                                : "border-glass-lighter hover:border-glass-light"
                            )}
                            placeholder="you@example.com"
                          />
                          <Mail className={cn(
                            "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                            focusedField === 'email' ? "text-accent-blue" : "text-text-tertiary"
                          )} />
                          {focusedField === 'email' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                            />
                          )}
                        </div>
                        {validationErrors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative group mt-8"
                      >
                        <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)]">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          <span className="relative z-10 flex items-center gap-2">
                            Continue
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Secure your account
                      </h2>
                      <p className="text-text-secondary">
                        Choose a strong password to protect your data
                      </p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value });
                              setPasswordStrength(calculatePasswordStrength(e.target.value));
                              if (focusedField === 'password' && e.target.value.length >= 8) {
                                setValidationErrors({ ...validationErrors, password: '' });
                              }
                            }}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={cn(
                              "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                              "border-2 rounded-2xl transition-all duration-300",
                              "focus:outline-none focus:ring-0",
                              validationErrors.password
                                ? "border-red-400 bg-red-50/30"
                                : focusedField === 'password'
                                ? "border-accent-blue bg-white/70 shadow-lg"
                                : "border-glass-lighter hover:border-glass-light"
                            )}
                            placeholder="••••••••"
                          />
                          <Lock className={cn(
                            "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                            focusedField === 'password' ? "text-accent-blue" : "text-text-tertiary"
                          )} />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-secondary transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          {focusedField === 'password' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                            />
                          )}
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-secondary">Password strength</span>
                              <span className={cn(
                                "text-xs font-medium",
                                passwordStrength < 50 ? "text-red-600" :
                                passwordStrength < 75 ? "text-amber-600" :
                                "text-green-600"
                              )}>
                                {passwordStrength < 50 ? "Weak" :
                                 passwordStrength < 75 ? "Good" :
                                 "Strong"}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                  "h-full rounded-full",
                                  passwordStrength < 50 ? "bg-red-500" :
                                  passwordStrength < 75 ? "bg-amber-500" :
                                  "bg-green-500"
                                )}
                              />
                            </div>
                            <p className="text-xs text-text-tertiary">
                              Use 8+ characters with uppercase, numbers & symbols
                            </p>
                          </div>
                        )}
                        
                        {validationErrors.password && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => {
                              setFormData({ ...formData, confirmPassword: e.target.value });
                              if (focusedField === 'confirmPassword' && e.target.value === formData.password) {
                                setValidationErrors({ ...validationErrors, confirmPassword: '' });
                              }
                            }}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            className={cn(
                              "w-full px-4 py-3 pl-12 pr-12 bg-white/50 backdrop-blur-sm",
                              "border-2 rounded-2xl transition-all duration-300",
                              "focus:outline-none focus:ring-0",
                              validationErrors.confirmPassword
                                ? "border-red-400 bg-red-50/30"
                                : focusedField === 'confirmPassword'
                                ? "border-accent-blue bg-white/70 shadow-lg"
                                : "border-glass-lighter hover:border-glass-light"
                            )}
                            placeholder="••••••••"
                          />
                          <Lock className={cn(
                            "absolute left-4 top-3.5 w-5 h-5 transition-colors duration-300",
                            focusedField === 'confirmPassword' ? "text-accent-blue" : "text-text-tertiary"
                          )} />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3.5 text-text-tertiary hover:text-text-secondary transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          {focusedField === 'confirmPassword' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-xl rounded-2xl"
                            />
                          )}
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Passwords do not match
                          </p>
                        )}
                        {validationErrors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => {
                              setFormData({ ...formData, agreeToTerms: e.target.checked });
                              if (e.target.checked) {
                                setValidationErrors({ ...validationErrors, terms: '' });
                              }
                            }}
                            className="mt-1 w-4 h-4 rounded border-glass-lighter text-accent-blue focus:ring-accent-blue"
                          />
                          <span className="text-sm text-text-secondary">
                            I agree to the{' '}
                            <Link href="/terms" className="text-accent-blue hover:text-accent-purple transition-colors">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-accent-blue hover:text-accent-purple transition-colors">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                        {validationErrors.terms && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.terms}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 px-6 py-3 border-2 border-glass-lighter rounded-2xl text-text-secondary hover:border-glass-light transition-colors"
                        >
                          Back
                        </button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                          className="flex-1 relative group"
                        >
                          <div className="relative h-14 px-8 flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-lg transition-all duration-300 group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl" />
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="relative z-10 flex items-center gap-2">
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  Create Account
                                  <Rocket className="w-5 h-5" />
                                </>
                              )}
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-green to-accent-blue mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-text-primary mb-3">
                      Welcome to FAXAS!
                    </h2>
                    <p className="text-lg text-text-secondary mb-8">
                      Your account has been created successfully.
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting to your dashboard...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Sign Up - Only show on step 1 */}
              {currentStep === 1 && (
                <>
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-glass-lighter" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-text-secondary">Or continue with</span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6"
                    >
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isGoogleLoading}
                        className="w-full glass-secondary px-6 py-3 rounded-2xl flex items-center justify-center gap-3 group hover:bg-white/80 transition-all duration-300"
                      >
                        {isGoogleLoading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                            <span className="font-medium text-text-primary">Creating account...</span>
                          </>
                        ) : (
                          <>
                            <FcGoogle className="w-6 h-6" />
                            <span className="font-medium text-text-primary">Sign up with Google</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  </div>

                  <p className="mt-8 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-accent-blue hover:text-accent-purple transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-green/10 to-accent-blue/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}