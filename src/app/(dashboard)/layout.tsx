"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useAuth0 } from "@auth0/auth0-react";
import AuthGuard from "@/components/AuthGuard";
import {
  LayoutDashboard, BookOpen, Compass, Trophy, Award,
  User, Settings, LogOut, GraduationCap, Menu, X,
  Zap, BarChart3, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/my-courses",   label: "My Courses",  icon: GraduationCap },
  { href: "/explore",      label: "Explore",     icon: Compass },
  { href: "/leaderboard",  label: "Leaderboard", icon: Trophy },
  { href: "/certificates", label: "Certificates",icon: Award },
  { href: "/profile",      label: "Profile",     icon: User },
  { href: "/settings",     label: "Settings",    icon: Settings },
];

const ADMIN_LINKS = [
  { href: "/admin",      label: "Admin Panel",      icon: BarChart3 },
  { href: "/instructor", label: "Course Studio",    icon: Zap },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutLocal } = useAuthStore();
  const { logout } = useAuth0();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    logoutLocal();
    await logout({ logoutParams: { returnTo: window.location.origin } });
    router.push("/");
  }

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "?";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Admin</p>
            </div>
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href} onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />{label}
                </Link>
              );
            })}
          </>
        )}
      </nav>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-[#0f172a] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 fixed top-0 left-0 h-screen z-30">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
        </Link>

        <NavLinks />

        {/* User footer */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-slate-500 text-xs capitalize truncate">{user?.role ?? "learner"}</p>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <div className="p-3 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-slate-500 text-xs capitalize">{user?.role ?? "learner"}</p>
                </div>
                <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center"><BookOpen className="w-4 h-4 text-white"/></div>
            <span className="text-white font-extrabold">Apex<span className="text-indigo-400">Learn</span>™</span>
          </Link>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-20 px-2 py-2">
        <div className="flex justify-around">
          {[
            { href: "/dashboard",   icon: LayoutDashboard, label: "Home" },
            { href: "/my-courses",  icon: GraduationCap,   label: "My Courses" },
            { href: "/explore",     icon: Compass,          label: "Explore" },
            { href: "/leaderboard", icon: Trophy,           label: "Ranks" },
            { href: "/profile",     icon: User,             label: "Profile" },
          ].map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all">
                <Icon className={`w-5 h-5 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                <span className={`text-xs font-medium ${active ? "text-indigo-400" : "text-slate-600"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </AuthGuard>
  );
}
