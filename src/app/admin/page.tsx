"use client";
import { useState } from "react";
import { Users, BookOpen, TrendingUp, DollarSign, BarChart3, Settings, Building2, Plus, Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

const STATS = [
  { label: "Total Users", value: "12,450", change: "+8.2%", up: true, icon: Users, color: "from-indigo-500 to-violet-500" },
  { label: "Active Courses", value: "52", change: "+3", up: true, icon: BookOpen, color: "from-emerald-500 to-teal-500" },
  { label: "Total Enrollments", value: "48,300", change: "+12.5%", up: true, icon: TrendingUp, color: "from-orange-500 to-amber-500" },
  { label: "Monthly Revenue", value: "₦4.2M", change: "+18.3%", up: true, icon: DollarSign, color: "from-pink-500 to-rose-500" },
];

const TENANTS = [
  { id: "1", name: "NITDA Academy", slug: "nitda", users: 4200, courses: 18, plan: "white_label", status: "active" },
  { id: "2", name: "NUC Staff Training", slug: "nuc", users: 1800, courses: 9, plan: "saas", status: "active" },
  { id: "3", name: "Galaxy Backbone LMS", slug: "galaxy", users: 2100, courses: 12, plan: "saas", status: "active" },
  { id: "4", name: "NASENI Institute", slug: "naseni", users: 900, courses: 6, plan: "saas", status: "trialing" },
];

const RECENT_ENROLLMENTS = [
  { user: "Bayo Akintola", course: "AI Fundamentals", tenant: "NITDA Academy", date: "2026-03-18" },
  { user: "Ngozi Idowu", course: "NDPR Compliance", tenant: "NUC Staff Training", date: "2026-03-17" },
  { user: "Emeka Eze", course: "Cybersecurity Essentials", tenant: "Galaxy Backbone LMS", date: "2026-03-17" },
  { user: "Kemi Okafor", course: "Project Management", tenant: "NITDA Academy", date: "2026-03-16" },
];

type TabId = "overview"|"tenants"|"courses"|"users"|"analytics";

export default function AdminPage() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <span className="text-xl font-extrabold text-white">Apex<span className="text-indigo-400">Learn</span>™</span>
          <p className="text-slate-500 text-xs mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {([
            {id:"overview",label:"Overview",icon:BarChart3},
            {id:"tenants",label:"Tenants",icon:Building2},
            {id:"courses",label:"Courses",icon:BookOpen},
            {id:"users",label:"Users",icon:Users},
            {id:"analytics",label:"Analytics",icon:TrendingUp},
          ] as {id:TabId;label:string;icon:React.ElementType}[]).map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab===id?"bg-indigo-600 text-white":"text-slate-400 hover:text-white hover:bg-slate-800"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Settings className="w-4 h-4" />Settings
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1">Platform Overview</h1>
              <p className="text-slate-400 text-sm">ApexLearn super admin dashboard</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map(s=>(
                <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
                  <p className={`text-xs font-semibold mt-2 ${s.up?"text-emerald-400":"text-red-400"}`}>{s.change} this month</p>
                </div>
              ))}
            </div>

            {/* Recent enrollments */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-bold">Recent Enrollments</h2>
                <button className="text-indigo-400 text-sm hover:text-indigo-300">View all</button>
              </div>
              <div className="divide-y divide-slate-700/50">
                {RECENT_ENROLLMENTS.map((e,i)=>(
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">{e.user[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{e.user}</p>
                      <p className="text-slate-400 text-xs">{e.course} · {e.tenant}</p>
                    </div>
                    <p className="text-slate-500 text-xs shrink-0">{e.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tenants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Tenants</h1>
                <p className="text-slate-400 text-sm">{TENANTS.length} active tenants</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all">
                <Plus className="w-4 h-4" />New Tenant
              </button>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-800/80">
                  <tr>
                    {["Name","Plan","Users","Courses","Status","Actions"].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {TENANTS.map(t=>(
                    <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-slate-500 text-xs">{t.slug}.apexlearn.ng</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold border capitalize ${t.plan==="white_label"?"bg-purple-500/20 text-purple-400 border-purple-500/30":"bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{t.plan.replace("_"," ")}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{t.users.toLocaleString()}</td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{t.courses}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${t.status==="active"?"text-emerald-400":"text-yellow-400"}`}>
                          {t.status==="active"?<CheckCircle className="w-3 h-3"/>:<XCircle className="w-3 h-3"/>}{t.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5"/></button>
                          <button className="p-1.5 rounded-lg bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                          <button className="p-1.5 rounded-lg bg-slate-700 text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
            <div className="grid grid-cols-3 gap-4">
              {[{label:"Avg. Completion Rate",val:"73%",note:"Up from 68% last month"},{label:"Avg. Assessment Score",val:"81%",note:"Industry avg: 74%"},{label:"Learner Retention",val:"89%",note:"30-day retention rate"}].map(m=>(
                <div key={m.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-extrabold text-indigo-400 mb-2">{m.val}</p>
                  <p className="text-white font-semibold text-sm">{m.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{m.note}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Top Performing Tenants</h3>
              <div className="space-y-3">
                {TENANTS.map((t,i)=>(
                  <div key={t.id} className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm w-4">{i+1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 text-sm">{t.name}</span>
                        <span className="text-indigo-400 text-sm font-semibold">{85-i*5}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div style={{width:`${85-i*5}%`}} className="h-full bg-indigo-500 rounded-full"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(tab === "courses" || tab === "users") && (
          <div className="text-center py-24 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Full {tab} management coming in next sprint</p>
          </div>
        )}
      </main>
    </div>
  );
}
