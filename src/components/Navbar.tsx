'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ApexLearn™</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Courses</Link>
            <Link href="/#about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About</Link>
            <Link href="/#pricing" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
            <Link href="/#contact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm font-medium">{user.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#334155] transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#334155] transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-[#334155] transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-4 py-2">Login</Link>
                <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400 hover:text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1e293b] border-t border-[#334155] px-4 py-4 space-y-3">
          <Link href="/courses" className="block text-slate-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Courses</Link>
          <Link href="/#about" className="block text-slate-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/#pricing" className="block text-slate-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <div className="pt-3 border-t border-[#334155] flex gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard" className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="flex-1 text-center border border-[#334155] text-slate-300 py-2 rounded-lg text-sm">Login</Link>
                <Link href="/register" className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
