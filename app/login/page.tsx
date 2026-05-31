'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { setSessionCookieAction, clearSessionCookieAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Invalid administrator email or password.');
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
        setError('Access denied: Unauthorized account.');
        setLoading(false);
        return;
      }

      // 3. Write access token to secure HTTP-Only cookie
      if (session?.access_token) {
        const res = await setSessionCookieAction(session.access_token);
        if (res.success) {
          router.push('/admin');
          router.refresh();
        } else {
          setError('Failed to establish secure session cookie.');
        }
      } else {
        setError('Failed to retrieve authentication token.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 md:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 relative w-16 h-16 flex items-center justify-center bg-zinc-800 border border-zinc-700">
            <Image
              src="/logo_icon.svg"
              alt="Prabhat Classes Logo"
              width={40}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider text-center">
            PRABHAT CLASSES
          </h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
            Supabase Admin Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-955/50 border border-red-900 flex gap-3 text-red-200 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-zinc-400 uppercase tracking-widest"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prabhatclasses2017@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-650 text-sm focus:border-red-600 focus:outline-none transition-colors rounded-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-zinc-400 uppercase tracking-widest"
            >
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-650 text-sm focus:border-red-600 focus:outline-none transition-colors rounded-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-sm transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Access Supabase Panel</span>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-600 mt-8 uppercase tracking-wider">
          Authorized personnel only. Access logging is active.
        </p>
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-6 text-zinc-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
      >
        ← Back to website
      </button>
    </main>
  );
}
