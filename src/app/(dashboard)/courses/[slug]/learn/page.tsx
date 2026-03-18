"use client";
import { useState } from "react";
import { CheckCircle, Circle, Play, FileText, HelpCircle, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const CURRICULUM = [
  { section: "Introduction", lessons: [
    { id: "l1", title: "Welcome & Course Overview", duration: "5:30", type: "video", completed: true },
    { id: "l2", title: "What is Artificial Intelligence?", duration: "12:45", type: "video", completed: true },
    { id: "l3", title: "AI in the Nigerian Context", duration: "8:20", type: "video", completed: false },
  ]},
  { section: "Foundations of AI", lessons: [
    { id: "l4", title: "Machine Learning Basics", duration: "18:00", type: "video", completed: false },
    { id: "l5", title: "Deep Learning Explained", duration: "22:10", type: "video", completed: false },
    { id: "l6", title: "Section Quiz", duration: "10 questions", type: "quiz", completed: false },
  ]},
  { section: "AI for Government", lessons: [
    { id: "l7", title: "Use Cases in Public Sector", duration: "15:30", type: "video", completed: false },
    { id: "l8", title: "Policy & Ethical Considerations", duration: "20:00", type: "video", completed: false },
    { id: "l9", title: "Final Assessment", duration: "20 questions", type: "quiz", completed: false },
  ]},
];

const ALL_LESSONS = CURRICULUM.flatMap(s => s.lessons);

export default function LearnPage() {
  const { slug } = useParams<{ slug: string }>();
  const [currentLessonId, setCurrentLessonId] = useState("l3");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>(["l1", "l2"]);

  const currentIdx = ALL_LESSONS.findIndex(l => l.id === currentLessonId);
  const currentLesson = ALL_LESSONS[currentIdx];
  const prevLesson = ALL_LESSONS[currentIdx - 1];
  const nextLesson = ALL_LESSONS[currentIdx + 1];
  const progress = Math.round((completedLessons.length / ALL_LESSONS.length) * 100);

  const TypeIcon = currentLesson?.type === "video" ? Play : currentLesson?.type === "quiz" ? HelpCircle : FileText;

  function markComplete(id: string) {
    if (!completedLessons.includes(id)) setCompletedLessons(p => [...p, id]);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <Link href={`/courses/${slug}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Course
        </Link>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm truncate">{currentLesson?.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div style={{width:`${progress}%`}} className="h-full bg-indigo-500 rounded-full transition-all" />
            </div>
            <span className="text-slate-400 text-xs">{progress}%</span>
          </div>
          <button onClick={() => setSidebarOpen(s => !s)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video area */}
          <div className="bg-black aspect-video w-full max-h-[65vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                <TypeIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-white/60 text-sm">
                {currentLesson?.type === "video" ? "Click to play video" : currentLesson?.type === "quiz" ? "Interactive quiz" : "Reading content"}
              </p>
              <p className="text-white/40 text-xs mt-1">{currentLesson?.title}</p>
            </div>
          </div>

          {/* Lesson info */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{currentLesson?.title}</h1>
                <p className="text-slate-400 text-sm">Duration: {currentLesson?.duration}</p>
              </div>
              <button
                onClick={() => markComplete(currentLessonId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${completedLessons.includes(currentLessonId) ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
                <CheckCircle className="w-4 h-4" />
                {completedLessons.includes(currentLessonId) ? "Completed" : "Mark Complete"}
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-3">Lesson Notes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                In this lesson, we explore how Artificial Intelligence is being applied in the Nigerian context — from NITDA&apos;s National AI Policy to practical implementations in revenue services and public administration. Understanding the local context is critical for any AI practitioner working in the public sector.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)} disabled={!prevLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={() => { markComplete(currentLessonId); nextLesson && setCurrentLessonId(nextLesson.id); }} disabled={!nextLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto hidden lg:block">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-white font-bold">Course Content</h3>
              <p className="text-slate-400 text-xs mt-1">{completedLessons.length}/{ALL_LESSONS.length} completed</p>
            </div>
            {CURRICULUM.map((section, si) => (
              <div key={si}>
                <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800">
                  <p className="text-slate-300 text-xs font-semibold uppercase tracking-wide">{section.section}</p>
                </div>
                {section.lessons.map(lesson => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;
                  const LIcon = lesson.type === "video" ? Play : lesson.type === "quiz" ? HelpCircle : FileText;
                  return (
                    <button key={lesson.id} onClick={() => setCurrentLessonId(lesson.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-800/50 transition-colors ${isCurrent ? "bg-indigo-600/20 border-l-2 border-l-indigo-500" : "hover:bg-slate-800"}`}>
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug truncate ${isCurrent ? "text-indigo-300" : isCompleted ? "text-slate-400" : "text-slate-300"}`}>{lesson.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <LIcon className="w-3 h-3 text-slate-500" />
                          <span className="text-slate-500 text-xs">{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
