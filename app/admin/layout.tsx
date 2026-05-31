'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSessionCookieAction } from '@/app/actions/auth';
import {
  Users,
  GraduationCap,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out from the administrator portal?')) {
      const res = await clearSessionCookieAction();
      if (res.success) {
        router.push('/login');
        router.refresh();
      }
    }
  };

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/faculty', label: 'Faculty', icon: Users },
    { href: '/admin/toppers', label: 'Toppers', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-650 selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-850 sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-wider leading-none">PRABHAT CLASSES</h1>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1 block">Admin Console</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Logout Button */}
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-zinc-850 bg-zinc-900 text-zinc-400 hover:text-white hover:border-red-600 hover:bg-red-950/20 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-850 bg-zinc-900/90 backdrop-blur-md px-4 py-4 space-y-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-zinc-850 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 text-zinc-450 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
