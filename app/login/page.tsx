'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { setSessionCookieAction, clearSessionCookieAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message || 'Invalid administrator email or password.', {
          description: 'Please check your credentials and try again.',
        });
        setLoading(false);
        return;
      }

      const user = data?.user;
      const session = data?.session;
      const adminEmail = 'prabhatclasses2017@gmail.com';

      // 2. Validate email equals prabhatclasses2017@gmail.com
      if (!user || user.email !== adminEmail) {
        await supabaseClient.auth.signOut();
        await clearSessionCookieAction();
        toast.error('Access denied.', {
          description: 'This account is not authorized to access the admin panel.',
        });
        setLoading(false);
        return;
      }

      // 3. Write access token to secure HTTP-Only cookie
      if (session?.access_token) {
        const res = await setSessionCookieAction(session.access_token);
        if (res.success) {
          toast.success('Login successful!', {
            description: 'Redirecting to admin panel...',
          });
          setTimeout(() => {
            router.push('/admin');
            router.refresh();
          }, 800);
        } else {
          toast.error('Session error.', {
            description: 'Failed to establish a secure session. Please try again.',
          });
        }
      } else {
        toast.error('Authentication error.', {
          description: 'Failed to retrieve authentication token.',
        });
      }
    } catch (err) {
      toast.error('Unexpected error.', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white font-sans relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-900/8 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/60 shadow-2xl relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            <div className="p-8 md:p-10">
              {/* Logo & Header */}
              <div className="flex flex-col items-center mb-9">
                <div className="relative mb-5">
                  <div className="w-[68px] h-[68px] bg-zinc-950 border border-zinc-700/60 flex items-center justify-center shadow-lg shadow-black/40">
                    <Image
                      src="/logo_icon.svg"
                      alt="Prabhat Classes Logo"
                      width={40}
                      height={40}
                      priority
                      className="object-contain"
                    />
                  </div>
                  {/* Shield badge */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-600 flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-[0.15em] text-center leading-tight">
                  PRABHAT CLASSES
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px w-8 bg-zinc-700" />
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    Admin Portal
                  </p>
                  <div className="h-px w-8 bg-zinc-700" />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors duration-200" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:border-red-600/70 focus:bg-zinc-950 focus:outline-none transition-all duration-200 rounded-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors duration-200" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3 bg-zinc-950/80 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:border-red-600/70 focus:bg-zinc-950 focus:outline-none transition-all duration-200 rounded-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold uppercase tracking-[0.12em] text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none shadow-lg shadow-red-900/20 hover:shadow-red-900/40"
                    id="login-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <span>Sign In to Admin Panel</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer note */}
              <p className="text-center text-[9px] text-zinc-700 mt-7 uppercase tracking-[0.15em] font-medium">
                Authorized personnel only · Access is logged
              </p>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="mt-5 mx-auto flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200"
            id="back-to-website-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to website
          </button>
        </div>
      </main>
  );
}
