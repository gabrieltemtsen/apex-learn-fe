"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Star, Users, Clock, BookOpen, X, Filter } from "lucide-react";
import { coursesApi, enrollmentsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

const MOCK_COURSES = [
  { id: "1", slug: "ai-fundamentals", title: "AI Fundamentals for Public Servants", instructor: "Dr. Amaka Obi", category: "Artificial Intelligence", level: "beginner", durationHours: 12, enrollmentCount: 1240, averageRating: 4.8, reviewCount: 328, gradient: "from-violet-600 to-indigo-600" },
  { id: "2", slug: "data-governance", title: "Data Governance & NDPR Compliance", instructor: "Engr. Tunde Adeyemi", category: "Compliance", level: "intermediate", durationHours: 8, enrollmentCount: 876, averageRating: 4.7, reviewCount: 201, gradient: "from-blue-600 to-cyan-600" },
  { id: "3", slug: "cybersecurity-essentials", title: "Cybersecurity Essentials for Enterprises", instructor: "Mrs. Chioma Nwosu", category: "Security", level: "intermediate", durationHours: 16, enrollmentCount: 2100, averageRating: 4.9, reviewCount: 512, gradient: "from-red-600 to-orange-600" },
  { id: "4", slug: "project-management", title: "Project Management Professional (PMP Prep)", instructor: "Mr. Emeka Eze", category: "Management", level: "advanced", durationHours: 20, enrollmentCount: 654, averageRating: 4.6, reviewCount: 178, gradient: "from-amber-600 to-yellow-600" },
  { id: "5", slug: "financial-management", title: "Public Financial Management", instructor: "Dr. Ngozi Adichie", category: "Finance", level: "intermediate", durationHours: 10, enrollmentCount: 432, averageRating: 4.5, reviewCount: 95, gradient: "from-emerald-600 to-teal-600" },
  { id: "6", slug: "digital-transformation", title: "Digital Transformation Strategy", instructor: "Prof. Bola Tinubu-Watts", category: "Strategy", level: "advanced", durationHours: 14, enrollmentCount: 789, averageRating: 4.7, reviewCount: 234, gradient: "from-pink-600 to-rose-600" },
  { id: "7", slug: "data-analysis-python", title: "Data Analysis with Python", instructor: "Engr. Kemi Okafor", category: "Data Science", level: "intermediate", durationHours: 18, enrollmentCount: 1560, averageRating: 4.8, reviewCount: 410, gradient: "from-cyan-600 to-blue-600" },
  { id: "8", slug: "leadership-public-sector", title: "Leadership in the Public Sector", instructor: "Dr. Bayo Adeyemi", category: "Leadership", level: "beginner", durationHours: 6, enrollmentCount: 980, averageRating: 4.6, reviewCount: 267, gradient: "from-orange-600 to-red-600" },
];

const CATEGORIES = ["All", "Artificial Intelligence", "Compliance", "Security", "Management", "Finance", "Strategy", "Data Science", "Leadership"];
const LEVELS = ["All", "beginner", "intermediate", "advanced"];

const LEVEL_COLORS: Record<string, string> = {
  beginner:     "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  advanced:     "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function ExplorePage() {
  const { isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    // Try to load real courses
    coursesApi.list().then(data => { if (data?.length) setCourses(data); }).catch(() => {});
    // Load enrolled course IDs
    if (isAuthenticated) {
      enrollmentsApi.myEnrollments().then(data => {
        if (data?.length) setEnrolledIds(data.map((e: any) => e.courseId ?? e.course?.id));
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  async function handleEnroll(courseId: string) {
    if (!isAuthenticated) return;
    setEnrolling(courseId);
    try {
      await enrollmentsApi.enroll(courseId);
      setEnrolledIds(prev => [...prev, courseId]);
    } catch { /* ignore */ }
    finally { setEnrolling(null); }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Explore Courses</h1>
        <p className="text-slate-400 mt-1">{courses.length} courses available for your learning journey</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors..."
            className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X className="w-4 h-4"/></button>}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${category === c ? "bg-indigo-600 text-white" : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="flex gap-2">
        <Filter className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${level === l ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {l}
          </button>
        ))}
      </div>

      <p className="text-slate-500 text-sm">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No courses match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(course => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all group flex flex-col">
                {/* Thumbnail */}
                <Link href={`/courses/${course.slug}`}>
                  <div className={`h-36 bg-gradient-to-br ${(course as any).gradient ?? "from-indigo-600 to-violet-600"} flex items-center justify-center`}>
                    <BookOpen className="w-14 h-14 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-semibold ${LEVEL_COLORS[course.level] ?? LEVEL_COLORS.beginner}`}>{course.level}</span>
                    <span className="text-xs text-slate-500 truncate ml-2">{course.category}</span>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">{course.title}</h3>
                  </Link>
                  {course.instructor && <p className="text-slate-400 text-xs">{course.instructor}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-700">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{course.averageRating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrollmentCount?.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.durationHours}h</span>
                  </div>
                  <button
                    onClick={() => !isEnrolled && handleEnroll(course.id)}
                    disabled={isEnrolled || enrolling === course.id}
                    className={`mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                      isEnrolled
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
                    }`}>
                    {enrolling === course.id ? "Enrolling..." : isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
