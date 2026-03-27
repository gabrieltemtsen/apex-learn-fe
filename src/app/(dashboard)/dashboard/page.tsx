"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Trophy, Flame, Award, ChevronRight,
  GraduationCap, Play, Star, Clock, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { enrollmentsApi } from "@/lib/api";
import { StatCardSkeleton, CourseCardSkeleton } from "@/components/Skeleton";

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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
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
  }, []);

  const stats = [
    { label: "Enrolled", value: enrollments.length || 3, icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Day Streak", value: user?.streak ?? 7, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Points", value: (user?.points ?? 1240).toLocaleString(), icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Certs", value: 2, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {getGreeting()}{user?.firstName ? `, ${user.firstName}` : ""}
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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col gap-2">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`}/>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            </div>
          ))
        }
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
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700/50 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-slate-700/50 rounded animate-pulse w-1/3" />
                  <div className="h-1.5 bg-slate-700/50 rounded-full animate-pulse w-full" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-700/50 animate-pulse shrink-0" />
              </div>
            ))}
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
  );
}
