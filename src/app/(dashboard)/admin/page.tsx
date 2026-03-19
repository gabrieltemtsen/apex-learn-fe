"use client";
import { useState, useEffect } from "react";
import { Users, BookOpen, TrendingUp, DollarSign, Plus, Eye, Pencil, Trash2, CheckCircle, XCircle, Award, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/api";
import { TableRowSkeleton } from "@/components/Skeleton";

const STATS = [
  { label: "Total Learners", value: "12,450", change: "+8.2%", up: true, icon: Users, color: "from-indigo-500 to-violet-500" },
  { label: "Active Courses", value: "52", change: "+3", up: true, icon: BookOpen, color: "from-emerald-500 to-teal-500" },
  { label: "Certificates Issued", value: "3,840", change: "+12.5%", up: true, icon: Award, color: "from-orange-500 to-amber-500" },
  { label: "Platform Revenue", value: "₦4.2M", change: "+18.3%", up: true, icon: DollarSign, color: "from-pink-500 to-rose-500" },
];

const COURSES = [
  { id: "1", title: "AI Fundamentals for Public Servants", category: "Artificial Intelligence", level: "beginner", enrollments: 1240, status: "published" },
  { id: "2", title: "Data Governance & NDPR Compliance", category: "Compliance", level: "intermediate", enrollments: 876, status: "published" },
  { id: "3", title: "Cybersecurity Essentials for Enterprises", category: "Security", level: "intermediate", enrollments: 2100, status: "published" },
  { id: "4", title: "Project Management Professional (PMP Prep)", category: "Management", level: "advanced", enrollments: 654, status: "draft" },
  { id: "5", title: "Public Financial Management", category: "Finance", level: "intermediate", enrollments: 432, status: "published" },
  { id: "6", title: "Digital Transformation Strategy", category: "Strategy", level: "advanced", enrollments: 789, status: "draft" },
];

const USERS = [
  { id: "1", name: "Bayo Akintola", email: "bayo@nitda.gov.ng", role: "learner", enrollments: 4, joined: "2026-01-10" },
  { id: "2", name: "Ngozi Idowu", email: "ngozi@nuc.edu.ng", role: "learner", enrollments: 2, joined: "2026-01-22" },
  { id: "3", name: "Emeka Eze", email: "emeka@galaxy.gov.ng", role: "learner", enrollments: 7, joined: "2026-02-03" },
  { id: "4", name: "Kemi Okafor", email: "kemi@apex.ng", role: "admin", enrollments: 0, joined: "2025-12-01" },
  { id: "5", name: "Tunde Adeyemi", email: "tunde@naseni.gov.ng", role: "learner", enrollments: 3, joined: "2026-02-18" },
];

type TabId = "courses" | "users" | "analytics";

interface RealUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  points?: number;
}

const ROLE_OPTIONS = ["learner", "facilitator", "admin", "tenant_admin", "super_admin"];
const ROLE_COLORS: Record<string, string> = {
  learner: "bg-slate-700 text-slate-300",
  facilitator: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  admin: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  tenant_admin: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  super_admin: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export default function AdminPage() {
  const [tab, setTab] = useState<TabId>("courses");
  const [courses, setCourses] = useState(COURSES);

  // Real users state
  const [users, setUsers] = useState<RealUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [promoteError, setPromoteError] = useState("");

  async function loadUsers() {
    setUsersLoading(true);
    setPromoteError("");
    try {
      const data = await adminApi.users();
      setUsers(Array.isArray(data) ? data : data.users ?? []);
      setUsersLoaded(true);
    } catch {
      setPromoteError("Failed to load users. Make sure you have admin access.");
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "users" && !usersLoaded) loadUsers();
  }, [tab]);

  async function handlePromote(userId: string, role: string) {
    setPromotingId(userId);
    setPromoteError("");
    try {
      await adminApi.promoteUser(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch {
      setPromoteError("Failed to change role. Only super admins can assign super_admin.");
    } finally {
      setPromotingId(null);
    }
  }

  function togglePublish(id: string) {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "published" ? "draft" : "published" } : c
    ));
  }

  return (
    <div className="pb-20 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Course Management</h1>
          <p className="text-slate-400 mt-1">Platform admin panel</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all">
          <Plus className="w-4 h-4" />Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            <p className={`text-xs font-semibold mt-2 ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change} this month</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1 w-fit">
        {(["courses", "users", "analytics"] as TabId[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Courses Tab */}
      {tab === "courses" && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-white font-bold">All Courses</h2>
            <span className="text-slate-500 text-sm">{courses.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-slate-800/80">
                <tr>
                  {["Title", "Category", "Level", "Enrollments", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold text-sm">{c.title}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">{c.category}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 rounded-full capitalize font-semibold bg-slate-700 text-slate-300">{c.level}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{c.enrollments.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1 text-xs font-semibold w-fit ${c.status === "published" ? "text-emerald-400" : "text-yellow-400"}`}>
                        {c.status === "published" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg bg-slate-700 text-slate-400 hover:text-white transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => togglePublish(c.id)}
                          className={`p-1.5 rounded-lg bg-slate-700 transition-colors text-xs font-semibold px-2 ${c.status === "published" ? "text-yellow-400 hover:text-yellow-300" : "text-emerald-400 hover:text-emerald-300"}`}
                          title={c.status === "published" ? "Unpublish" : "Publish"}>
                          {c.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-700 text-red-400 hover:text-red-300 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-4">
          {promoteError && (
            <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
              {promoteError}
              <button onClick={() => setPromoteError("")} className="text-red-400 hover:text-red-300 ml-2">✕</button>
            </div>
          )}

          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> User Management
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Change roles to grant/revoke admin access</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">{users.length} users</span>
                <button onClick={loadUsers} disabled={usersLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors disabled:opacity-50">
                  <RefreshCw className={`w-3 h-3 ${usersLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-800/80">
                  <tr>
                    {["User", "Email", "Role", "Points", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {usersLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={6} className="px-2 py-1"><TableRowSkeleton cols={6} /></td></tr>
                    ))
                    : users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">
                              {u.firstName[0]}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{u.firstName} {u.lastName}</p>
                              <span className={`text-xs ${u.isActive ? "text-emerald-500" : "text-red-500"}`}>
                                {u.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-sm">{u.email}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${ROLE_COLORS[u.role] ?? "bg-slate-700 text-slate-300"}`}>
                            {u.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-300 text-sm">{(u.points ?? 0).toLocaleString()}</td>
                        <td className="px-5 py-4 text-slate-500 text-sm">
                          {new Date(u.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {promotingId === u.id
                              ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                              : (
                                <select
                                  value={u.role}
                                  onChange={e => handlePromote(u.id, e.target.value)}
                                  className="text-xs bg-slate-700 border border-slate-600 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                                >
                                  {ROLE_OPTIONS.map(r => (
                                    <option key={r} value={r}>{r.replace("_", " ")}</option>
                                  ))}
                                </select>
                              )
                            }
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                  {!usersLoading && users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
                        No users found. Make sure you&apos;re logged in as admin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to create first admin */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> First-time Admin Setup
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              To create the first super admin, call{" "}
              <code className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded text-xs">
                POST /auth/seed-admin
              </code>{" "}
              with <code className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded text-xs">secret</code>,{" "}
              <code className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded text-xs">email</code>, and{" "}
              <code className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded text-xs">password</code>.{" "}
              Set <code className="bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded text-xs">ADMIN_SEED_SECRET</code> in Railway env vars.
              Once you&apos;re a super admin, use the role dropdown above to promote other users.
            </p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Avg. Completion Rate", val: "73%", note: "Up from 68% last month", color: "text-indigo-400" },
              { label: "Avg. Assessment Score", val: "81%", note: "Industry avg: 74%", color: "text-emerald-400" },
              { label: "Active Learners (30d)", val: "8,240", note: "66% of total learners", color: "text-orange-400" },
            ].map(m => (
              <div key={m.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
                <p className={`text-4xl font-extrabold ${m.color} mb-2`}>{m.val}</p>
                <p className="text-white font-semibold text-sm">{m.label}</p>
                <p className="text-slate-500 text-xs mt-1">{m.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Top Courses by Enrollment</h3>
            <div className="space-y-4">
              {COURSES.filter(c => c.status === "published").sort((a, b) => b.enrollments - a.enrollments).slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center gap-4">
                  <span className="text-slate-500 text-sm w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300 text-sm truncate">{c.title}</span>
                      <span className="text-indigo-400 text-sm font-semibold shrink-0 ml-2">{c.enrollments.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div style={{ width: `${Math.round((c.enrollments / 2100) * 100)}%` }} className="h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
