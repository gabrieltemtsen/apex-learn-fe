"use client";
import { useEffect, useState } from "react";
import {
  Camera,
  Save,
  Loader2,
  CheckCircle,
  BookOpen,
  Trophy,
  Award,
  Flame,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/contexts/toast";
import { useClerk, useUser } from "@clerk/nextjs";

type DbUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  bio?: string;
  jobTitle?: string;
  streak?: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded } = useUser();
  const { success, error: toastError } = useToast();

  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingProfile(true);
        const { data } = await api.get("/users/me/profile");
        if (!cancelled) setDbUser(data);
      } catch {
        if (!cancelled) setDbUser(null);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    jobTitle: "",
  });

  // Sync form when profile loads
  useEffect(() => {
    if (!dbUser) return;
    setForm({
      firstName: dbUser.firstName ?? "",
      lastName: dbUser.lastName ?? "",
      bio: dbUser.bio ?? "",
      jobTitle: dbUser.jobTitle ?? "",
    });
  }, [dbUser?.id]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!dbUser?.id) {
      const msg = "Your profile is still loading. Please wait a moment and try again.";
      setError(msg);
      toastError(msg);
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const { data } = await api.patch(`/users/${dbUser.id}`, form);
      setDbUser((prev) => (prev ? { ...prev, ...data } : prev));
      setSaved(true);
      success("Profile updated successfully!");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to update profile";
      setError(msg);
      toastError(msg);
    } finally {
      setSaving(false);
    }
  }

  const STATS = [
    { label: "Enrolled Courses", value: "4", icon: BookOpen, color: "text-indigo-400" },
    { label: "Courses Completed", value: "1", icon: Trophy, color: "text-emerald-400" },
    { label: "Certificates", value: "1", icon: Award, color: "text-yellow-400" },
    { label: "Day Streak", value: `${dbUser?.streak ?? 0}`, icon: Flame, color: "text-orange-400" },
  ];

  const displayEmail = dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || "";
  const displayRole = dbUser?.role || (clerkUser?.publicMetadata?.role as string | undefined) || "learner";

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your personal information</p>
      </div>

      {/* Avatar card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-white font-bold text-lg">
            {form.firstName} {form.lastName}
          </p>
          <p className="text-slate-400 text-sm">{displayEmail}</p>
          <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 capitalize">
            {displayRole}
          </span>
          {(loadingProfile || !isLoaded) && (
            <p className="text-slate-500 text-xs mt-2">Loading profile…</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 bg-red-900/20 text-red-400 hover:bg-red-900/40 text-sm font-semibold transition-all shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
        <div className="hidden"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
            <p className="text-xl font-extrabold text-white">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-5">Edit Profile</h2>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">First Name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Job Title</label>
            <input
              value={form.jobTitle}
              onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
              placeholder="e.g. Senior Policy Analyst"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell others about yourself..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Email (read-only)</label>
            <input
              value={displayEmail}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm disabled:opacity-60 transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
