"use client";
import { useState } from "react";
import { BookOpen, Users, Star, BarChart3, Plus, Eye, Pencil, Trash2, CheckCircle, XCircle, HelpCircle, FileText } from "lucide-react";

const MY_COURSES = [
  { id: "1", title: "AI Fundamentals for Public Servants", students: 240, rating: 4.8, status: "published", thumbnail: "from-violet-600 to-indigo-600" },
  { id: "2", title: "Data Governance & NDPR Compliance", students: 87, rating: 4.5, status: "draft", thumbnail: "from-blue-600 to-cyan-600" },
];

const STEPS = ["details", "curriculum", "publish"];

export default function InstructorPage() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("details");

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Course Studio</h1>
          <p className="text-slate-400 mt-1">Create and manage platform courses</p>
        </div>
        <button onClick={() => { setShowModal(true); setStep("details"); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all">
          <Plus className="w-4 h-4" />New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: "1,240", icon: Users, color: "text-indigo-400" },
          { label: "Published Courses", value: "1", icon: BookOpen, color: "text-emerald-400" },
          { label: "Avg. Rating", value: "4.8", icon: Star, color: "text-yellow-400" },
          { label: "Total Revenue", value: "₦240k", icon: BarChart3, color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="space-y-4 mb-8">
        <h2 className="text-white font-bold text-lg">My Courses</h2>
        {MY_COURSES.map(course => (
          <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-20 h-14 rounded-xl bg-gradient-to-br ${course.thumbnail} flex items-center justify-center shrink-0`}>
              <BookOpen className="w-7 h-7 text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-sm truncate">{course.title}</p>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-semibold ${
                  course.status === "published" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}>{course.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students} students</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" />{course.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"><Eye className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"><Pencil className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Tools */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">✨ AI Course Builder</h3>
        <p className="text-slate-300 text-sm mb-4">Let Gemini AI generate a full course outline, quiz questions, and lesson summaries from your topic in seconds.</p>
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
            <HelpCircle className="w-4 h-4" />Generate Quiz
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all">
            <FileText className="w-4 h-4" />Generate Outline
          </button>
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-white font-bold text-lg">Create New Course</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${STEPS.indexOf(step) >= i ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400"}`}>{i + 1}</div>
                        <span className={`text-xs capitalize ${step === s ? "text-white font-semibold" : "text-slate-500"}`}>{s}</span>
                        {i < 2 && <div className="w-4 h-px bg-slate-700" />}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><XCircle className="w-5 h-5" /></button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4">
                {step === "details" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Course Title *</label>
                      <input placeholder="e.g. Introduction to Cybersecurity" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                          <option>Cybersecurity</option><option>AI & Data</option><option>Leadership</option><option>Finance</option><option>Compliance</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs mb-1.5 block">Level</label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Description</label>
                      <textarea rows={3} placeholder="What will learners achieve?" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none" />
                    </div>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <p className="text-slate-400 text-sm">Drop thumbnail image here or <span className="text-indigo-400">browse</span></p>
                    </div>
                  </div>
                )}
                {step === "curriculum" && (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Curriculum builder coming soon.</p>
                    <p className="text-xs mt-1 text-slate-500">Use AI to generate an outline first.</p>
                  </div>
                )}
                {step === "publish" && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-14 h-14 mx-auto mb-4 text-emerald-400" />
                    <p className="text-white font-bold text-lg">Ready to Publish?</p>
                    <p className="text-slate-400 text-sm mt-2">Your course will be reviewed and published within 24 hours.</p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 p-6 border-t border-slate-800">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={() => { if (step === "details") setStep("curriculum"); else if (step === "curriculum") setStep("publish"); else setShowModal(false); }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
                  {step === "publish" ? "Publish Course" : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
