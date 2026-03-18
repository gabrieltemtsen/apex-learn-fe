"use client";
import { useState } from "react";
import { Plus, BookOpen, Users, Star, Eye, Pencil, BarChart3, Video, FileText, HelpCircle, Upload, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const MY_COURSES = [
  { id: "1", title: "AI Fundamentals for Public Servants", status: "published", enrollments: 1240, rating: 4.8, reviews: 328, lessons: 9, thumbnail: "from-violet-600 to-indigo-600" },
  { id: "2", title: "Machine Learning in Government", status: "draft", enrollments: 0, rating: 0, reviews: 0, lessons: 4, thumbnail: "from-blue-600 to-cyan-600" },
];

type ModalStep = "details" | "curriculum" | "publish";

export default function InstructorPage() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ModalStep>("details");
  const [courseForm, setCourseForm] = useState({ title: "", category: "", level: "beginner", description: "" });

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Instructor Studio</h1>
            <p className="text-slate-400 mt-1">Create and manage your courses</p>
          </div>
          <button onClick={() => { setShowModal(true); setStep("details"); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all active:scale-95">
            <Plus className="w-4 h-4" />New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label:"Total Students", value:"1,240", icon:Users, color:"text-indigo-400" },
            { label:"Published Courses", value:"1", icon:BookOpen, color:"text-emerald-400" },
            { label:"Avg. Rating", value:"4.8", icon:Star, color:"text-yellow-400" },
            { label:"Total Revenue", value:"₦240k", icon:BarChart3, color:"text-purple-400" },
          ].map(s=>(
            <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg">My Courses</h2>
          {MY_COURSES.map(course => (
            <div key={course.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-5">
              <div className={`w-20 h-16 rounded-xl bg-gradient-to-br ${course.thumbnail} flex items-center justify-center shrink-0`}>
                <BookOpen className="w-8 h-8 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm truncate">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${course.status === "published" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{course.enrollments} students</span>
                  {course.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400"/>{course.rating} ({course.reviews})</span>}
                  <span className="flex items-center gap-1"><Video className="w-3 h-3"/>{course.lessons} lessons</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition-colors"><Eye className="w-3.5 h-3.5"/>Preview</button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"><Pencil className="w-3.5 h-3.5"/>Edit</button>
              </div>
            </div>
          ))}
        </div>

        {/* AI tools card */}
        <div className="mt-10 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-2">✨ AI Course Builder</h3>
          <p className="text-slate-300 text-sm mb-4">Let Gemini AI generate a full course outline, quiz questions, and lesson summaries from your topic in seconds.</p>
          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
              <HelpCircle className="w-4 h-4"/>Generate Quiz
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all">
              <FileText className="w-4 h-4"/>Generate Outline
            </button>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-white font-bold text-xl">Create New Course</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {(["details","curriculum","publish"] as ModalStep[]).map((s,i)=>(
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${step===s?"bg-indigo-600 text-white":i<["details","curriculum","publish"].indexOf(step)?"bg-emerald-600 text-white":"bg-slate-700 text-slate-400"}`}>{i+1}</div>
                        <span className={`text-xs capitalize ${step===s?"text-indigo-400":"text-slate-500"}`}>{s}</span>
                        {i<2&&<div className="w-4 h-px bg-slate-700"/>}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-white"/></button>
              </div>
              <div className="p-6 space-y-4">
                {step === "details" && (
                  <>
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Course Title *</label>
                      <input value={courseForm.title} onChange={e=>setCourseForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Introduction to Cybersecurity"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block">Category</label>
                        <select value={courseForm.category} onChange={e=>setCourseForm(f=>({...f,category:e.target.value}))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
                          {["Artificial Intelligence","Compliance","Security","Management","Finance","Strategy"].map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block">Level</label>
                        <select value={courseForm.level} onChange={e=>setCourseForm(f=>({...f,level:e.target.value}))}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 capitalize">
                          {["beginner","intermediate","advanced"].map(l=><option key={l} value={l} className="capitalize">{l}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Description</label>
                      <textarea value={courseForm.description} onChange={e=>setCourseForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="What will learners achieve?"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"/>
                    </div>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500"/>
                      <p className="text-slate-400 text-sm">Upload course thumbnail</p>
                      <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </>
                )}
                {step === "curriculum" && (
                  <div className="text-center py-8 text-slate-400">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                    <p>Curriculum builder — add lessons, videos, and quizzes</p>
                    <p className="text-sm mt-2 text-slate-500">Full curriculum builder in next sprint</p>
                  </div>
                )}
                {step === "publish" && (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-indigo-400 opacity-60"/>
                    <p className="text-white font-semibold">Ready to publish?</p>
                    <p className="text-sm mt-2">Your course will be reviewed and made available to learners.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 p-6 border-t border-slate-800">
                <button onClick={()=>setShowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={()=>{if(step==="details")setStep("curriculum");else if(step==="curriculum")setStep("publish");else setShowModal(false);}}
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
