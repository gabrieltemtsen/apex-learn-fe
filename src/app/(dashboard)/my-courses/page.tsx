"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Play, CheckCircle, Clock, Trophy, Loader2, Search } from "lucide-react";
import { enrollmentsApi } from "@/lib/api";

const DEMO = [
  { id: "1", course: { id: "c1", slug: "ai-fundamentals", title: "AI Fundamentals for Public Servants", category: "Artificial Intelligence", thumbnailGradient: "from-violet-600 to-indigo-600" }, progressPercent: 65, status: "active" },
  { id: "2", course: { id: "c2", slug: "data-governance", title: "Data Governance & NDPR Compliance", category: "Compliance", thumbnailGradient: "from-blue-600 to-cyan-600" }, progressPercent: 30, status: "active" },
  { id: "3", course: { id: "c3", slug: "cybersecurity-essentials", title: "Cybersecurity Essentials", category: "Security", thumbnailGradient: "from-red-600 to-orange-600" }, progressPercent: 100, status: "completed" },
  { id: "4", course: { id: "c4", slug: "project-management", title: "Project Management Professional", category: "Management", thumbnailGradient: "from-amber-600 to-yellow-600" }, progressPercent: 8, status: "active" },
];

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState(DEMO);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"active"|"completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    enrollmentsApi.myEnrollments()
      .then(data => { if (data?.length) setEnrollments(data); })
      .catch(() => { /* use demo */ })
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch = !search || e.course.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const activeCount = enrollments.filter(e => e.status === "active").length;
  const completedCount = enrollments.filter(e => e.status === "completed").length;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Courses</h1>
        <p className="text-slate-400 mt-1">Track your learning progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Enrolled", value: enrollments.length, icon: BookOpen, color: "text-indigo-400" },
          { label: "In Progress", value: activeCount, icon: Play, color: "text-orange-400" },
          { label: "Completed", value: completedCount, icon: Trophy, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your courses..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
          {(["all","active","completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 text-lg font-semibold">No courses found</p>
          <p className="text-slate-500 text-sm mt-1">
            {search ? "Try a different search term" : filter === "completed" ? "Complete a course to see it here" : "Explore our catalog to enroll"}
          </p>
          <Link href="/explore" className="mt-4 inline-block px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
            Explore Courses
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(e => {
          const pct = e.progressPercent ?? 0;
          const isComplete = pct === 100 || e.status === "completed";
          return (
            <div key={e.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group">
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${(e.course as any).thumbnailGradient ?? "from-indigo-600 to-violet-600"} flex items-center justify-center relative`}>
                <BookOpen className="w-14 h-14 text-white/40" />
                {isComplete && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold border capitalize ${
                  isComplete ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                }`}>{isComplete ? "Completed" : "In Progress"}</span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">{e.course.title}</p>
                  {e.course.category && <p className="text-slate-500 text-xs mt-1">{e.course.category}</p>}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Progress</span>
                    <span className={isComplete ? "text-emerald-400 font-semibold" : "text-indigo-400 font-semibold"}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full rounded-full transition-all ${isComplete ? "bg-emerald-500" : "bg-indigo-500"}`} />
                  </div>
                </div>

                <Link href={`/courses/${e.course.slug ?? e.course.id}/learn`}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    isComplete ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}>
                  {isComplete ? <><Trophy className="w-4 h-4" /> View Certificate</> : <><Play className="w-4 h-4" /> Continue Learning</>}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
