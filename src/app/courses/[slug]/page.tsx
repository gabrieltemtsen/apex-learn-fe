"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, Users, Clock, BookOpen, Play, CheckCircle, Lock, Award, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const MOCK_CURRICULUM = [
  { section: "Introduction", lessons: [
    { id: "l1", title: "Welcome & Course Overview", duration: "5:30", type: "video", isFree: true },
    { id: "l2", title: "What is Artificial Intelligence?", duration: "12:45", type: "video", isFree: true },
    { id: "l3", title: "AI in the Nigerian Context", duration: "8:20", type: "video", isFree: false },
  ]},
  { section: "Foundations of AI", lessons: [
    { id: "l4", title: "Machine Learning Basics", duration: "18:00", type: "video", isFree: false },
    { id: "l5", title: "Deep Learning Explained", duration: "22:10", type: "video", isFree: false },
    { id: "l6", title: "Section Quiz", duration: "10 questions", type: "quiz", isFree: false },
  ]},
  { section: "AI for Government", lessons: [
    { id: "l7", title: "Use Cases in Public Sector", duration: "15:30", type: "video", isFree: false },
    { id: "l8", title: "Policy & Ethical Considerations", duration: "20:00", type: "video", isFree: false },
    { id: "l9", title: "Final Assessment", duration: "20 questions", type: "quiz", isFree: false },
  ]},
];

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [enrolled, setEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview"|"curriculum"|"instructor"|"reviews">("overview");

  const toggleSection = (i: number) => setExpandedSections(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <div className="bg-slate-900 border-b border-slate-800 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-4 inline-block">Artificial Intelligence</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                AI Fundamentals for Public Servants
              </h1>
              <p className="text-slate-300 text-lg mb-6">Master the essentials of Artificial Intelligence and apply them in government and public sector contexts. Built with the TTF™ methodology.</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-semibold">4.8</span> (328 reviews)</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />1,240 students</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />12 hours</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />9 lessons</span>
              </div>
              <p className="text-slate-400 text-sm mt-3">Instructor: <span className="text-white font-semibold">Dr. Amaka Obi</span></p>
            </div>

            {/* Enroll card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 h-fit lg:sticky lg:top-24">
              <div className="h-40 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/50" />
              </div>
              {!enrolled ? (
                <>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-white">Free</p>
                    <p className="text-slate-400 text-sm mt-1">Included in your plan</p>
                  </div>
                  <button onClick={() => setEnrolled(true)}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all active:scale-95">
                    Enroll Now
                  </button>
                  <p className="text-slate-500 text-xs text-center">30-day money-back guarantee</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold"><CheckCircle className="w-5 h-5" /> Enrolled!</div>
                  <Link href={`/courses/${slug}/learn`}
                    className="block w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-all">
                    Continue Learning →
                  </Link>
                </>
              )}
              <div className="space-y-2 pt-2 text-sm text-slate-400">
                {["12 hours of video content", "9 lessons + 2 quizzes", "AI-generated assessments", "Certificate of completion", "Lifetime access"].map(f => (
                  <div key={f} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:col-span-2">
          <div className="flex gap-1 mb-8 border-b border-slate-800">
            {(["overview","curriculum","instructor","reviews"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${activeTab===tab ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-4">What you&apos;ll learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Understand core AI concepts and terminology", "Apply AI in public sector workflows", "Evaluate AI tools for government use", "Understand ethical AI considerations", "Navigate NDPR and data privacy rules", "Build AI-ready skills for your career"].map(item => (
                    <div key={item} className="flex items-start gap-2 text-slate-300 text-sm"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{item}</div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-3">The TTF™ Methodology</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[{phase:"01",label:"TEST",desc:"Diagnostic assessment identifies your knowledge gaps before training begins."}, {phase:"02",label:"TRAIN",desc:"Adaptive content delivery tailored to your pace and learning style."}, {phase:"03",label:"FUN",desc:"Badges, streaks, and leaderboards keep you engaged and motivated."}].map(p => (
                    <div key={p.phase} className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                      <p className="text-indigo-400 text-xs font-bold mb-1">PHASE {p.phase}</p>
                      <p className="text-white font-bold mb-2">{p.label}</p>
                      <p className="text-slate-400 text-xs">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="space-y-3">
              {MOCK_CURRICULUM.map((section, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                  <button onClick={() => toggleSection(i)} className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{section.section}</span>
                      <span className="text-slate-500 text-sm">{section.lessons.length} lessons</span>
                    </div>
                    {expandedSections.includes(i) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {expandedSections.includes(i) && (
                    <div className="border-t border-slate-700 divide-y divide-slate-700/50">
                      {section.lessons.map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            {lesson.isFree ? <Play className="w-4 h-4 text-indigo-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                            <span className={`text-sm ${lesson.isFree ? "text-white" : "text-slate-400"}`}>{lesson.title}</span>
                            {lesson.isFree && <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Preview</span>}
                          </div>
                          <span className="text-slate-500 text-xs">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">AO</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Dr. Amaka Obi</h3>
                  <p className="text-slate-400 text-sm">AI Research Scientist & Policy Advisor</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />4.8 Rating</span>
                    <span>3 Courses</span>
                    <span>5,200+ Students</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">Dr. Amaka Obi is a leading AI researcher with 15 years of experience in machine learning and public policy. She has advised NITDA and multiple federal ministries on AI adoption strategy and digital transformation.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="text-center">
                  <p className="text-6xl font-extrabold text-white">4.8</p>
                  <div className="flex gap-0.5 justify-center mt-2">{[1,2,3,4,5].map(s=><Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400"/>)}</div>
                  <p className="text-slate-400 text-sm mt-1">328 reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[{stars:5,pct:72},{stars:4,pct:18},{stars:3,pct:7},{stars:2,pct:2},{stars:1,pct:1}].map(r=>(
                    <div key={r.stars} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 w-3">{r.stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div style={{width:`${r.pct}%`}} className="h-full bg-yellow-400 rounded-full"/></div>
                      <span className="text-slate-400 w-6">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {[{name:"Bayo A.",text:"Excellent course! Very practical and well-structured. The AI quiz generation is impressive.",stars:5},{name:"Ngozi I.",text:"Great content, learned a lot about AI in the public sector context. Highly recommended.",stars:5},{name:"Emeka C.",text:"Good course overall. Would love more hands-on exercises in the advanced sections.",stars:4}].map((r,i)=>(
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">{r.name[0]}</div>
                    <div>
                      <p className="text-white text-sm font-semibold">{r.name}</p>
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} className={`w-3 h-3 ${s<=r.stars?"text-yellow-400 fill-yellow-400":"text-slate-600"}`}/>)}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
