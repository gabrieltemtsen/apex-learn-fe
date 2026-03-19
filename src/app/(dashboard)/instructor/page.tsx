"use client";
import { useState, useEffect } from "react";
import {
  BookOpen, Users, Star, BarChart3, Plus, Eye, Pencil, Trash2,
  CheckCircle, XCircle, Loader2, X, ChevronRight, Youtube, FileText
} from "lucide-react";
import Link from "next/link";
import { coursesApi, lessonsApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/contexts/toast";
import { CourseCardSkeleton } from "@/components/Skeleton";

interface Course {
  id: string;
  title: string;
  slug: string;
  category?: string;
  level: string;
  isPublished: boolean;
  enrollmentCount: number;
  averageRating: number;
  durationHours?: number;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  videoUrl?: string;
  order: number;
  isPublished: boolean;
  durationSeconds: number;
}

type ModalView = "course" | "lessons" | null;

const CATEGORIES = ["Artificial Intelligence", "Cybersecurity", "Data Science", "Leadership", "Finance", "Compliance", "Management", "Strategy", "Other"];

export default function InstructorPage() {
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();

  // Courses list
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState<ModalView>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Course form
  const [form, setForm] = useState({
    title: "", description: "", category: "Artificial Intelligence",
    level: "beginner", durationHours: "", tags: "",
  });

  // Lesson form
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonForm, setLessonForm] = useState({
    title: "", type: "video", videoUrl: "", content: "", durationSeconds: "", isFree: false,
  });
  const [addingLesson, setAddingLesson] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  async function loadCourses() {
    setLoading(true);
    try {
      const data = await coursesApi.mine();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      // If mine endpoint fails, try filtering by instructorId
      try {
        if (user?.id) {
          const data = await coursesApi.list({});
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch { setCourses([]); }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCourses(); }, []);

  async function handleCreateCourse() {
    if (!form.title || !form.description) {
      toastError("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const created = await coursesApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        level: form.level,
        durationHours: form.durationHours ? parseFloat(form.durationHours) : undefined,
        tags: form.tags || undefined,
      });
      setCourses(prev => [created, ...prev]);
      success(`"${created.title}" created! Now add lessons.`);
      setActiveCourseId(created.id);
      setModal("lessons");
      setForm({ title: "", description: "", category: "Artificial Intelligence", level: "beginner", durationHours: "", tags: "" });
    } catch (err: any) {
      toastError(err?.response?.data?.message ?? "Failed to create course.");
    } finally {
      setSaving(false);
    }
  }

  async function openLessonsModal(courseId: string) {
    setActiveCourseId(courseId);
    setModal("lessons");
    setShowLessonForm(false);
    try {
      const data = await lessonsApi.getByCourse(courseId);
      setLessons(Array.isArray(data) ? data : []);
    } catch {
      setLessons([]);
    }
  }

  async function handleAddLesson() {
    if (!activeCourseId || !lessonForm.title) {
      toastError("Lesson title is required.");
      return;
    }
    setAddingLesson(true);
    try {
      const created = await lessonsApi.create({
        courseId: activeCourseId,
        title: lessonForm.title,
        type: lessonForm.type as any,
        videoUrl: lessonForm.videoUrl || undefined,
        content: lessonForm.content || undefined,
        durationSeconds: lessonForm.durationSeconds ? parseInt(lessonForm.durationSeconds) : undefined,
        order: lessons.length,
        isFree: lessonForm.isFree,
      });
      setLessons(prev => [...prev, created as Lesson]);
      success("Lesson added!");
      setLessonForm({ title: "", type: "video", videoUrl: "", content: "", durationSeconds: "", isFree: false });
      setShowLessonForm(false);
    } catch (err: any) {
      toastError(err?.response?.data?.message ?? "Failed to add lesson.");
    } finally {
      setAddingLesson(false);
    }
  }

  async function handlePublish(courseId: string) {
    try {
      await coursesApi.publish(courseId);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isPublished: true } : c));
      success("Course published! Learners can now enroll.");
    } catch {
      toastError("Failed to publish course.");
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    try {
      await lessonsApi.remove(lessonId);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      success("Lesson deleted.");
    } catch {
      toastError("Failed to delete lesson.");
    }
  }

  function closeModal() {
    setModal(null);
    setActiveCourseId(null);
    setLessons([]);
    setShowLessonForm(false);
  }

  const stats = [
    { label: "Total Students", value: courses.reduce((s, c) => s + (c.enrollmentCount || 0), 0).toLocaleString(), icon: Users, color: "text-indigo-400" },
    { label: "Published Courses", value: courses.filter(c => c.isPublished).length, icon: BookOpen, color: "text-emerald-400" },
    { label: "Avg. Rating", value: courses.length > 0 ? (courses.reduce((s, c) => s + (c.averageRating || 0), 0) / courses.length).toFixed(1) : "—", icon: Star, color: "text-yellow-400" },
    { label: "Draft Courses", value: courses.filter(c => !c.isPublished).length, icon: BarChart3, color: "text-purple-400" },
  ];

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Course Studio</h1>
          <p className="text-slate-400 mt-1">Create and manage your courses</p>
        </div>
        <button
          onClick={() => { setModal("course"); setForm({ title: "", description: "", category: "Artificial Intelligence", level: "beginner", durationHours: "", tags: "" }); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Courses list */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">My Courses</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 font-semibold">No courses yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "New Course" to create your first one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-white font-semibold text-sm truncate">{course.title}</p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold ${
                      course.isPublished
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}>{course.isPublished ? "Published" : "Draft"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrollmentCount} enrolled</span>
                    {course.averageRating > 0 && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" />{course.averageRating.toFixed(1)}</span>}
                    <span className="capitalize">{course.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openLessonsModal(course.id)} title="Manage Lessons"
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <Link href={`/courses/${course.slug}`} title="Preview"
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                  {!course.isPublished && (
                    <button onClick={() => handlePublish(course.id)} title="Publish"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors">
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Course Modal ─────────────────────────────────────────────── */}
      {modal === "course" && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-white font-bold text-lg">Create New Course</h2>
                <button onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Course Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Introduction to Cybersecurity"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Level</label>
                    <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="What will learners achieve by completing this course?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Duration (hours)</label>
                    <input
                      type="number" min="0" step="0.5"
                      value={form.durationHours}
                      onChange={e => setForm(f => ({ ...f, durationHours: e.target.value }))}
                      placeholder="e.g. 8"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block font-semibold">Tags (comma-separated)</label>
                    <input
                      value={form.tags}
                      onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      placeholder="AI, government, Nigeria"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-slate-800">
                <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={saving || !form.title || !form.description}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <>Create & Add Lessons <ChevronRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Lessons Modal ───────────────────────────────────────────────────── */}
      {modal === "lessons" && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-white font-bold text-lg">Manage Lessons</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""} added</p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                {/* Existing lessons */}
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="flex items-center gap-3 bg-slate-800 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-500 text-sm w-5 shrink-0 text-center">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{lesson.title}</p>
                      <p className="text-slate-500 text-xs capitalize">{lesson.type}{lesson.videoUrl ? " · YouTube" : ""}</p>
                    </div>
                    <button onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add lesson form */}
                {showLessonForm ? (
                  <div className="bg-slate-800/60 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block font-semibold">Lesson Title *</label>
                      <input
                        value={lessonForm.title}
                        onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Introduction to AI"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block font-semibold">Type</label>
                        <select value={lessonForm.type} onChange={e => setLessonForm(f => ({ ...f, type: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                          <option value="video">Video</option>
                          <option value="text">Text</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block font-semibold">Duration (seconds)</label>
                        <input
                          type="number" min="0"
                          value={lessonForm.durationSeconds}
                          onChange={e => setLessonForm(f => ({ ...f, durationSeconds: e.target.value }))}
                          placeholder="e.g. 600"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {lessonForm.type === "video" && (
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block font-semibold flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5 text-red-400" /> YouTube URL
                        </label>
                        <input
                          value={lessonForm.videoUrl}
                          onChange={e => setLessonForm(f => ({ ...f, videoUrl: e.target.value }))}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}

                    {lessonForm.type === "text" && (
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block font-semibold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Lesson Content
                        </label>
                        <textarea
                          value={lessonForm.content}
                          onChange={e => setLessonForm(f => ({ ...f, content: e.target.value }))}
                          rows={4}
                          placeholder="Write the lesson content here..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isFree"
                        checked={lessonForm.isFree}
                        onChange={e => setLessonForm(f => ({ ...f, isFree: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="isFree" className="text-slate-400 text-xs cursor-pointer">Free preview (visible without enrollment)</label>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setShowLessonForm(false)}
                        className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleAddLesson}
                        disabled={addingLesson || !lessonForm.title}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                      >
                        {addingLesson ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Add Lesson"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLessonForm(true)}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                )}
              </div>

              <div className="p-6 border-t border-slate-800">
                <button onClick={closeModal} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Done — {lessons.length} Lesson{lessons.length !== 1 ? "s" : ""} Saved
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
