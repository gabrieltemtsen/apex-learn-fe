"use client";
import { useState, useEffect, use } from "react";
import {
  CheckCircle, Circle, Play, FileText, HelpCircle,
  ChevronLeft, ChevronRight, Menu, X, Loader2, Lock, BookOpen
} from "lucide-react";
import Link from "next/link";
import { coursesApi, lessonsApi, progressApi } from "@/lib/api";
import { useToast } from "@/contexts/toast";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: "video" | "text" | "quiz" | "live";
  videoUrl?: string;
  content?: string;
  durationSeconds: number;
  order: number;
  isPublished: boolean;
  isFree: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface ProgressItem {
  lessonId: string;
}

// Extract YouTube video ID from any YouTube URL
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function formatDuration(seconds: number) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TYPE_ICONS = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
  live: BookOpen,
};

export default function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { success, error: toastError } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = await coursesApi.getBySlug(slug);
        setCourse(c);

        const [lsns, prog] = await Promise.all([
          lessonsApi.getByCourse(c.id),
          progressApi.getCourseProgress(c.id).catch(() => []),
        ]);

        const published = (lsns as Lesson[]).filter(l => l.isPublished || l.isFree);
        setLessons(published);

        const done = new Set<string>(
          (prog as ProgressItem[]).map((p) => p.lessonId)
        );
        setCompletedIds(done);

        // Start from first incomplete lesson
        const firstIncomplete = published.find(l => !done.has(l.id));
        setCurrentId(firstIncomplete?.id ?? published[0]?.id ?? null);
      } catch {
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const currentLesson = lessons.find(l => l.id === currentId) ?? null;
  const currentIdx = lessons.findIndex(l => l.id === currentId);
  const prevLesson = lessons[currentIdx - 1];
  const nextLesson = lessons[currentIdx + 1];
  const progress = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0;

  async function handleMarkComplete() {
    if (!currentLesson || !course || completedIds.has(currentLesson.id) || marking) return;
    setMarking(true);
    try {
      await progressApi.markComplete(currentLesson.id, course.id);
      setCompletedIds(prev => new Set([...prev, currentLesson.id]));
      success("Lesson marked complete! +10 points");
      if (nextLesson) setTimeout(() => setCurrentId(nextLesson.id), 800);
    } catch {
      toastError("Could not save progress. Please try again.");
    } finally {
      setMarking(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
        <p className="text-slate-400">Loading course…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-red-400">{error}</p>
        <Link href="/my-courses" className="inline-block px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
          Back to My Courses
        </Link>
      </div>
    </div>
  );

  if (!currentLesson) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <BookOpen className="w-14 h-14 text-slate-600 mx-auto" />
        <h2 className="text-white font-bold text-xl">No lessons yet</h2>
        <p className="text-slate-400 text-sm">The instructor hasn't published any lessons for this course yet.</p>
        <Link href="/my-courses" className="inline-block px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
          Back to My Courses
        </Link>
      </div>
    </div>
  );

  const ytId = currentLesson.videoUrl ? getYouTubeId(currentLesson.videoUrl) : null;
  const isCompleted = completedIds.has(currentLesson.id);
  const TypeIcon = TYPE_ICONS[currentLesson.type] ?? Play;

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <Link
          href={`/courses/${slug}`}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm shrink-0"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{currentLesson.title}</p>
          <p className="text-slate-500 text-xs truncate">{course?.title}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-500" />
            </div>
            <span className="text-slate-400 text-xs">{progress}%</span>
          </div>
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {/* Video / Content area */}
          <div className="bg-black w-full" style={{ aspectRatio: "16/9", maxHeight: "65vh" }}>
            {currentLesson.type === "video" && ytId ? (
              <iframe
                key={ytId}
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : currentLesson.type === "video" && currentLesson.videoUrl ? (
              <video
                key={currentLesson.videoUrl}
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full"
                onEnded={handleMarkComplete}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <TypeIcon className="w-10 h-10 text-white/60" />
                  </div>
                  <p className="text-white/60 text-sm capitalize">{currentLesson.type} lesson</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson body */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${
                    currentLesson.type === "video" ? "text-indigo-400 border-indigo-500/40 bg-indigo-500/10"
                    : currentLesson.type === "quiz" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
                    : "text-slate-400 border-slate-600 bg-slate-700/50"
                  }`}>
                    {currentLesson.type}
                  </span>
                  {currentLesson.durationSeconds > 0 && (
                    <span className="text-xs text-slate-500">{formatDuration(currentLesson.durationSeconds)}</span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-white">{currentLesson.title}</h1>
                {currentLesson.description && (
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">{currentLesson.description}</p>
                )}
              </div>

              {/* Mark complete button */}
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted || marking}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isCompleted
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
                }`}
              >
                {marking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCompleted ? (
                  <><CheckCircle className="w-4 h-4" /> Completed</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Mark Complete</>
                )}
              </button>
            </div>

            {/* Text content (for text-type lessons) */}
            {currentLesson.type === "text" && currentLesson.content && (
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {currentLesson.content}
                </div>
              </div>
            )}

            {/* Quiz redirect */}
            {currentLesson.type === "quiz" && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-yellow-400 mx-auto" />
                <h3 className="text-white font-bold">Quiz Lesson</h3>
                <p className="text-slate-400 text-sm">This lesson has an interactive quiz. Complete it to earn points and progress.</p>
                <Link
                  href={`/assessments/${currentLesson.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-semibold transition-all"
                >
                  <HelpCircle className="w-4 h-4" /> Start Quiz
                </Link>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => prevLesson && setCurrentId(prevLesson.id)}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-slate-500 text-xs">
                {currentIdx + 1} / {lessons.length}
              </span>

              <button
                onClick={() => nextLesson && setCurrentId(nextLesson.id)}
                disabled={!nextLesson}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        {sidebarOpen && (
          <aside className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto flex-shrink-0 hidden lg:block">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-white font-bold text-sm">Course Content</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div style={{ width: `${progress}%` }} className="h-full bg-indigo-500 rounded-full" />
                </div>
                <span className="text-slate-400 text-xs shrink-0">{completedIds.size}/{lessons.length}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {lessons.map((lesson, idx) => {
                const done = completedIds.has(lesson.id);
                const active = lesson.id === currentId;
                const Icon = TYPE_ICONS[lesson.type] ?? Play;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentId(lesson.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      active ? "bg-indigo-600/20 border-r-2 border-indigo-500" : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 ${done ? "text-emerald-400" : active ? "text-indigo-400" : "text-slate-600"}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${active ? "text-white" : done ? "text-slate-400" : "text-slate-300"}`}>
                        {idx + 1}. {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Icon className="w-3 h-3 text-slate-600" />
                        <span className="text-slate-600 text-xs capitalize">{lesson.type}</span>
                        {lesson.durationSeconds > 0 && (
                          <span className="text-slate-600 text-xs">{formatDuration(lesson.durationSeconds)}</span>
                        )}
                        {lesson.isFree && (
                          <span className="text-emerald-500 text-xs font-semibold">Free</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
