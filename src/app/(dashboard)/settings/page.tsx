"use client";
import { useState } from "react";
import { Bell, Shield, Globe, Save, Loader2, CheckCircle, Moon, Mail } from "lucide-react";

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-all ${checked ? "bg-indigo-600" : "bg-slate-700"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${checked ? "left-6" : "left-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    leaderboardAlerts: false,
    weeklyDigest: true,
    twoFactorAuth: false,
    publicProfile: true,
    showProgress: true,
    language: "en",
    timezone: "Africa/Lagos",
  });

  function set(key: keyof typeof settings, val: boolean | string) {
    setSettings(s => ({ ...s, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h2 className="text-white font-bold">Notifications</h2>
        </div>
        {[
          { key: "emailNotifications", label: "Email notifications", desc: "Receive emails for important updates" },
          { key: "courseUpdates", label: "Course updates", desc: "When instructors add new content" },
          { key: "leaderboardAlerts", label: "Leaderboard alerts", desc: "When your rank changes" },
          { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of your learning progress every Monday" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
            <div>
              <p className="text-white text-sm font-semibold">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
            <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => set(key as any, v)} />
          </div>
        ))}
      </div>

      {/* Privacy */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-white font-bold">Privacy & Security</h2>
        </div>
        {[
          { key: "publicProfile", label: "Public profile", desc: "Allow others to view your profile" },
          { key: "showProgress", label: "Show progress publicly", desc: "Display your course progress on leaderboard" },
          { key: "twoFactorAuth", label: "Two-factor authentication", desc: "Extra layer of security for your account" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
            <div>
              <p className="text-white text-sm font-semibold">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
            <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => set(key as any, v)} />
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <h2 className="text-white font-bold">Preferences</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Language</label>
            <select value={settings.language} onChange={e => set("language", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
              <option value="en">English</option>
              <option value="yo">Yoruba</option>
              <option value="ig">Igbo</option>
              <option value="ha">Hausa</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Timezone</label>
            <select value={settings.timezone} onChange={e => set("timezone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500">
              <option value="Africa/Lagos">WAT (Lagos, UTC+1)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">GMT (London)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-2">Danger Zone</h2>
        <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-400 text-sm font-semibold hover:bg-red-900/30 transition-colors">
          Delete Account
        </button>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-60 transition-all">
        {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : saved ? <CheckCircle className="w-4 h-4"/> : <Save className="w-4 h-4"/>}
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
