import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, Check, Search, TrendingUp } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        await register(email, password, fullName);
      } else {
        await login(email, password, rememberMe);
      }
      const searchParams = new URLSearchParams(location.search);
      const next = searchParams.get('next') || '/dashboard';
      navigate(next);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'string') {
          setErrorMessage(detail);
        } else if (Array.isArray(detail)) {
          setErrorMessage(detail.map((item: any) => item.msg || JSON.stringify(item)).join('; '));
        } else {
          setErrorMessage(JSON.stringify(detail));
        }
      } else {
        setErrorMessage('Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-saasflow-slate-canvas">
      {/* Left Form Column (Fixed 576px desktop) */}
      <div className="w-full lg:w-[576px] min-h-screen bg-white border-r border-saasflow-slate-border p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-saasflow-accent flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-saasflow-slate-textPrimary">SaaSflow</span>
        </div>

        {/* Form Body */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-[30px] font-bold text-saasflow-slate-textPrimary tracking-tight mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-saasflow-slate-textSecondary">
              {isSignUp
                ? 'Enter your details below to get started with SaaSflow'
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-saasflow-status-dangerBg border border-red-200 text-saasflow-status-danger text-sm font-medium animate-shake">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-saasflow-slate-textPrimary mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Devon"
                  className="w-full h-11 px-4 text-sm text-saasflow-slate-textPrimary bg-white border border-saasflow-slate-border rounded-lg focus:outline-none focus:border-saasflow-accent focus:ring-4 focus:ring-saasflow-accent/15 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-saasflow-slate-textPrimary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 px-4 text-sm text-saasflow-slate-textPrimary bg-white border border-saasflow-slate-border rounded-lg focus:outline-none focus:border-saasflow-accent focus:ring-4 focus:ring-saasflow-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-saasflow-slate-textPrimary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 pr-11 text-sm text-saasflow-slate-textPrimary bg-white border border-saasflow-slate-border rounded-lg focus:outline-none focus:border-saasflow-accent focus:ring-4 focus:ring-saasflow-accent/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-saasflow-slate-textMuted hover:text-saasflow-slate-textSecondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      rememberMe
                        ? 'bg-saasflow-accent border-saasflow-accent text-white'
                        : 'border-saasflow-slate-border bg-white'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-[13px] text-saasflow-slate-textSecondary">Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-[13px] font-semibold text-saasflow-accent hover:text-saasflow-accent-hover transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-saasflow-accent hover:bg-saasflow-accent-hover active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-saasflow-slate-border" />
            </div>
            <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-saasflow-slate-textMuted font-medium">
              Or continue with
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-11 flex items-center justify-center gap-2.5 rounded-lg border border-saasflow-slate-border hover:bg-slate-50 text-sm font-semibold text-saasflow-slate-textPrimary transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="h-11 flex items-center justify-center gap-2.5 rounded-lg border border-saasflow-slate-border hover:bg-slate-50 text-sm font-semibold text-saasflow-slate-textPrimary transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer Prompt */}
        <p className="text-center text-[13px] text-saasflow-slate-textSecondary">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            className="font-semibold text-saasflow-accent cursor-pointer hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      {/* Right Visual Column (864px on desktop, dark slate background) */}
      <div className="hidden lg:flex flex-1 min-h-screen bg-saasflow-slate-sidebar p-16 flex-col justify-between relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Mockup Window (Figma layout) */}
        <div className="w-full max-w-[680px] mx-auto bg-saasflow-slate-surfaceDark border border-saasflow-slate-borderDark rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm z-10">
          {/* Mockup Header */}
          <div className="px-5 py-3.5 bg-slate-900 border-b border-saasflow-slate-borderDark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-saasflow-status-danger" />
              <div className="w-3 h-3 rounded-full bg-saasflow-status-warning" />
              <div className="w-3 h-3 rounded-full bg-saasflow-status-success" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-saasflow-slate-surfaceDark text-saasflow-slate-textMuted text-xs w-48">
              <Search className="w-3.5 h-3.5" />
              <span>Search dashboard...</span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-xs text-saasflow-slate-textMuted block mb-1">Conversion Rate</span>
                <span className="text-xl font-bold text-white tracking-tight">3.24%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="text-xs text-saasflow-slate-textMuted block mb-1">Monthly MRR</span>
                <span className="text-xl font-bold text-white tracking-tight">$128,400</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-saasflow-slate-textMuted">
                <span className="font-semibold text-white">Daily Revenue Growth</span>
                <span className="flex items-center gap-1 text-saasflow-status-success font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.2%
                </span>
              </div>
              {/* Mini SVG preview chart */}
              <div className="h-20 w-full flex items-end gap-2 pt-2">
                {[40, 55, 35, 65, 80, 75, 95, 85, 110, 100, 130, 125].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-saasflow-accent/40 hover:bg-saasflow-accent rounded-t transition-all" style={{ height: `${(val / 140) * 100}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Card (Glassmorphism Figma card) */}
        <div className="w-full max-w-[680px] mx-auto p-8 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-md z-10">
          <p className="text-base font-medium text-slate-100 leading-relaxed mb-6">
            "This platform has completely transformed how we track and scale our product analytics. Setup took minutes, and our conversion rate improved by 22% in the first month alone."
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                alt="Sarah Jenkins"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-saasflow-accent/50"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">Sarah Jenkins</h4>
                <p className="text-xs text-saasflow-slate-textMuted">VP of Product, CloudScale</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-md bg-white/10 text-xs font-semibold text-white tracking-wide">
              CloudScale Enterprise
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
