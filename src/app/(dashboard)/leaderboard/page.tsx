"use client";
import { useState, useEffect } from "react";
import { Trophy, Star, Flame, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { leaderboardApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { TableRowSkeleton } from "@/components/Skeleton";


interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  points: number;
  streak: number;
}

const RANK_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];
const AVATAR_GRADIENTS = ["from-violet-600 to-indigo-600", "from-blue-600 to-cyan-600", "from-emerald-600 to-teal-600", "from-orange-600 to-red-600", "from-pink-600 to-rose-600"];
const BADGES = ["🏆", "🥈", "🥉"];

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const data = await leaderboardApi.top(50);
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeaderboard(); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="pb-20 lg:pb-0">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold mb-4">
            <Trophy className="w-4 h-4" /> Championship League
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Leaderboard</h1>
          <p className="text-slate-400">Earn points by completing courses and passing assessments. Top learners win prizes.</p>
        </div>

        {/* Refresh */}
        <div className="flex justify-center mb-2">
          <button onClick={loadLeaderboard} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh rankings
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-2 mt-4">
            {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && entries.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold text-slate-400">Leaderboard is empty</p>
            <p className="text-sm mt-2">Complete courses and pass assessments to earn points and claim your spot!</p>
          </div>
        )}

        {/* Top 3 podium */}
        {!loading && top3.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">
            {[top3[1], top3[0], top3[2]].map((entry, i) => {
              const heights = ["h-32", "h-40", "h-28"];
              const podiumPositions = [2, 1, 3];
              const borders = ["border-slate-300", "border-yellow-400", "border-amber-600"];
              return entry ? (
                <div key={entry.rank} className="flex flex-col items-center gap-3">
                  <div className="text-2xl">{BADGES[i === 1 ? 0 : i === 0 ? 1 : 2]}</div>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[(entry.rank - 1) % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold border-2 ${borders[i]}`}>
                    {initials(entry.name)}
                  </div>
                  <p className="text-white font-semibold text-sm text-center">{entry.name.split(" ")[0]}</p>
                  <p className="text-indigo-400 font-bold text-sm">{entry.points.toLocaleString()} pts</p>
                  <div className={`${heights[i]} w-24 rounded-t-xl flex items-center justify-center text-2xl font-extrabold border border-white/10 ${i === 1 ? "bg-gradient-to-t from-yellow-600/40 to-yellow-400/20 text-yellow-400" : i === 0 ? "bg-gradient-to-t from-slate-600/40 to-slate-400/20 text-slate-300" : "bg-gradient-to-t from-amber-700/40 to-amber-500/20 text-amber-600"}`}>
                    {podiumPositions[i]}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Rest of list */}
        {!loading && rest.length > 0 && (
          <div className="space-y-2">
            {rest.map((entry) => {
              const isYou = entry.userId === user?.id;
              return (
                <div key={entry.rank}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${isYou ? "bg-indigo-600/20 border-indigo-500/50" : "bg-slate-800/50 border-slate-700 hover:border-slate-600"}`}>
                  <span className={`text-lg font-bold w-6 text-center text-slate-500`}>{entry.rank}</span>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[(entry.rank - 1) % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {initials(entry.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm truncate">{entry.name}</p>
                      {isYou && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">You</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{entry.streak} day streak</span>
                    </div>
                  </div>
                  <p className="text-indigo-400 font-bold text-sm shrink-0">{entry.points.toLocaleString()} pts</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Point guide */}
        <div className="mt-10 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />How to Earn Points</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{action:"Complete a Lesson", pts:"+10"},{action:"Pass an Assessment", pts:"+50"},{action:"Complete a Course", pts:"+200"},{action:"Daily Streak", pts:"+5/day"}].map(g=>(
              <div key={g.action} className="bg-slate-900 rounded-xl p-3 text-center">
                <p className="text-indigo-400 font-extrabold text-xl">{g.pts}</p>
                <p className="text-slate-400 text-xs mt-1">{g.action}</p>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
