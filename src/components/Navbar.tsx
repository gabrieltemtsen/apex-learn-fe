"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu, X, BookOpen, ChevronDown, LogOut, User, LayoutDashboard
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api";

const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/#about", label: "About" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "?";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium max-w-[120px] truncate">{user.firstName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-white text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-slate-400 text-xs truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4"/> Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                        <User className="w-4 h-4"/> Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
                        <LogOut className="w-4 h-4"/> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-700 z-50 md:hidden transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">{initials}</div>
            <div>
              <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-slate-400 text-xs truncate max-w-[170px]">{user.email}</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}

          {isAuthenticated && user ? (
            <>
              <div className="border-t border-slate-700 my-2" />
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm">
                <LayoutDashboard className="w-4 h-4"/> Dashboard
              </Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm">
                <User className="w-4 h-4"/> Profile
              </Link>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors text-sm">
                <LogOut className="w-4 h-4"/> Logout
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-slate-700 my-2" />
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-slate-600 text-white hover:bg-slate-800 text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
