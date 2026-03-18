"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Trophy, Flame, Award, ChevronRight,
  LayoutDashboard, GraduationCap, BarChart2, User, LogOut,
  Play, Star, Clock, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { enrollmentsApi, authApi } from "@/lib/api";

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    category?: string;
    totalLessons?: number;
  };
  progress?: number;
  completedLessons?: number;
}

const DEMO_ENROLLMENTS: Enrollment[] = [
  { id: "1", course: { id: "c1", title: "Advanced TypeScript Patterns", category: "Programming", totalLessons: 24 }, progress: 65, completedLessons: 16 },
  { id: "2", course: { id: "c2", title: "React 19 Deep Dive", category: "Frontend", totalLessons: 18 }, progress: 30, completedLessons: 5 },
  { id: "3", course: { id: "c3", title: "System Design for Engineers", category: "Architecture", totalLessons: 12 }, progress: 8, completedLessons: 1 },
];

const RECOMMENDED = [
  { id: "r1", title: "Node.js Microservices", category: "Backend", rating: 4.9, duration: "12h", students: "3.2k" },
  { id: "r2", title: "Docker & Kubernetes", category: "DevOps", rating: 4.8, duration: "8h", students: "5.1k" },
  { id: "r3", title: "GraphQL Mastery", category: "API", rating: 4.7, duration: "6h", students: "2.8k" },
];

const BOTTOM_NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/leaderboard", label: "Ranks", icon: BarChart2 },
  { href: "/profile", label: "Profile", icon: User },
];

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "My Courses", icon: GraduationCap },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart2 },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const data = await enrollmentsApi.myEnrollments();
        setEnrollments(Array.isArray(data) ? data : data.enrollments ?? []);
      } catch {
        setEnrollments(DEMO_ENROLLMENTS);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    router.push("/");
  };

  const stats = [
    { label: "Enrolled", value: enrollments.length || 3, icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Day Streak", value: user?.streak ?? 7, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Points", value: (user?.points ?? 1240).toLocaleString(), icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Certs", value: 2, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-slate-800 fixed top-0 left-0 h-full z-30 bg-[#0f172a]">
        <div className="p-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white"/></div>
            <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                href === "/dashboard" ? "bg-indigo-600/20 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}>
              <Icon className="w-4 h-4"/> {label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                <p className="text-slate-400 text-xs capitalize">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5"/> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          {/* Greeting */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getGreeting()}, {user?.firstName ?? "Learner"}! 👋
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {isDemo ? "API not connected — showing demo data." : "Here's your learning overview today."}
            </p>
            {isDemo && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
                <TrendingUp className="w-3 h-3"/> Demo mode — connect your backend to see real data
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col gap-2">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`}/>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-slate-400 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Continue Learning</h2>
              <Link href="/courses" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4"/>
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-24 bg-slate-800/60 rounded-2xl animate-pulse"/>)}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center">
                <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3"/>
                <p className="text-slate-400">You haven&apos;t enrolled in any courses yet.</p>
                <Link href="/courses" className="mt-3 inline-block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.slice(0, 3).map(e => {
                  const pct = e.progress ?? 0;
                  return (
                    <div key={e.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/40 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-indigo-400"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{e.course.title}</p>
                        <p className="text-slate-400 text-xs mb-2">{e.course.category} • {e.completedLessons ?? 0}/{e.course.totalLessons ?? "?"} lessons</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }}/>
                          </div>
                          <span className="text-slate-400 text-xs shrink-0">{pct}%</span>
                        </div>
                      </div>
                      <Link href={`/courses/${e.course.id}/learn`}
                        className="shrink-0 w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-colors">
                        <Play className="w-4 h-4 text-white"/>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recommended */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recommended for You</h2>
              <Link href="/courses" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
                Browse all <ChevronRight className="w-4 h-4"/>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RECOMMENDED.map(c => (
                <div key={c.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 hover:border-indigo-500/40 transition-colors cursor-pointer group">
                  <div className="w-full h-24 rounded-xl bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border border-indigo-500/20 mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-indigo-400"/>
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">{c.category}</span>
                  <h3 className="text-white text-sm font-bold mt-1 mb-2 line-clamp-2">{c.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/> {c.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {c.duration}</span>
                    <span>{c.students} students</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Tab Nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around h-16">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
              href === "/dashboard" ? "text-indigo-400" : "text-slate-500 hover:text-white"
            }`}>
            <Icon className="w-5 h-5"/>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
