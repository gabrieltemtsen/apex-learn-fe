"use client";
import { useState } from "react";
import { Search, Filter, Star, Users, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const MOCK_COURSES = [
  { id: "1", slug: "ai-fundamentals", title: "AI Fundamentals for Public Servants", instructor: "Dr. Amaka Obi", category: "Artificial Intelligence", level: "beginner", durationHours: 12, thumbnailUrl: null, enrollmentCount: 1240, averageRating: 4.8, reviewCount: 328, tags: ["AI", "Government", "Digital"] },
  { id: "2", slug: "data-governance", title: "Data Governance & NDPR Compliance", instructor: "Engr. Tunde Adeyemi", category: "Compliance", level: "intermediate", durationHours: 8, thumbnailUrl: null, enrollmentCount: 876, averageRating: 4.7, reviewCount: 201, tags: ["NDPR", "Data", "Compliance"] },
  { id: "3", slug: "cybersecurity-essentials", title: "Cybersecurity Essentials for Enterprises", instructor: "Mrs. Chioma Nwosu", category: "Security", level: "intermediate", durationHours: 16, thumbnailUrl: null, enrollmentCount: 2100, averageRating: 4.9, reviewCount: 512, tags: ["Security", "Enterprise"] },
  { id: "4", slug: "project-management", title: "Project Management Professional (PMP Prep)", instructor: "Mr. Emeka Eze", category: "Management", level: "advanced", durationHours: 20, thumbnailUrl: null, enrollmentCount: 654, averageRating: 4.6, reviewCount: 178, tags: ["PMP", "Management"] },
  { id: "5", slug: "financial-management", title: "Public Financial Management", instructor: "Dr. Ngozi Adichie", category: "Finance", level: "intermediate", durationHours: 10, thumbnailUrl: null, enrollmentCount: 432, averageRating: 4.5, reviewCount: 95, tags: ["Finance", "Government"] },
  { id: "6", slug: "digital-transformation", title: "Digital Transformation Strategy", instructor: "Prof. Bola Tinubu-Watts", category: "Strategy", level: "advanced", durationHours: 14, thumbnailUrl: null, enrollmentCount: 789, averageRating: 4.7, reviewCount: 234, tags: ["Digital", "Strategy"] },
];

const CATEGORIES = ["All", "Artificial Intelligence", "Compliance", "Security", "Management", "Finance", "Strategy"];
const LEVELS = ["All Levels", "beginner", "intermediate", "advanced"];

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  advanced: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Artificial Intelligence": "from-violet-600 to-indigo-600",
  "Compliance": "from-blue-600 to-cyan-600",
  "Security": "from-red-600 to-orange-600",
  "Management": "from-amber-600 to-yellow-600",
  "Finance": "from-emerald-600 to-teal-600",
  "Strategy": "from-pink-600 to-rose-600",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");

  const filtered = MOCK_COURSES.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLevel = level === "All Levels" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">Explore Courses</h1>
          <p className="text-slate-400 text-lg">50+ expert-led courses for government, enterprise, and professional development.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 capitalize">
              {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
            </select>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6">{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <Link key={course.id} href={`/courses/${course.slug}`}
              className="group bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200">
              {/* Thumbnail */}
              <div className={`h-44 bg-gradient-to-br ${CATEGORY_COLORS[course.category] || "from-indigo-600 to-violet-600"} flex items-center justify-center p-6`}>
                <BookOpen className="w-16 h-16 text-white/60" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-semibold ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
                  <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">{course.category}</span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{course.instructor}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{course.averageRating} ({course.reviewCount})</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrollmentCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.durationHours}h</span>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <span className="inline-block w-full text-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">View Course</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No courses match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
