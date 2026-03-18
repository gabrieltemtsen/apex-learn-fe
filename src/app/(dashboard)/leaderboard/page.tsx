"use client";
import { useState } from "react";
import { Trophy, Medal, Star, Flame, BookOpen, CheckCircle } from "lucide-react";


const MOCK_ENTRIES = [
  { rank: 1, name: "Amaka Osei", avatar: "AO", points: 12480, coursesCompleted: 18, assessmentsPassed: 34, streak: 42, badge: "🏆" },
  { rank: 2, name: "Tunde Adeyemi", avatar: "TA", points: 11200, coursesCompleted: 15, assessmentsPassed: 28, streak: 38, badge: "🥈" },
  { rank: 3, name: "Chioma Nwosu", avatar: "CN", points: 10850, coursesCompleted: 14, assessmentsPassed: 26, streak: 35, badge: "🥉" },
  { rank: 4, name: "Emeka Eze", avatar: "EE", points: 9400, coursesCompleted: 13, assessmentsPassed: 22, streak: 28, badge: null },
  { rank: 5, name: "Ngozi Idowu", avatar: "NI", points: 8760, coursesCompleted: 11, assessmentsPassed: 20, streak: 21, badge: null },
  { rank: 6, name: "Bayo Akintola", avatar: "BA", points: 7900, coursesCompleted: 10, assessmentsPassed: 18, streak: 17, badge: null },
  { rank: 7, name: "Kemi Okafor", avatar: "KO", points: 7200, coursesCompleted: 9, assessmentsPassed: 16, streak: 15, badge: null },
  { rank: 8, name: "Gabriel Temtsen", avatar: "GT", points: 6800, coursesCompleted: 8, assessmentsPassed: 14, streak: 12, badge: null, isYou: true },
  { rank: 9, name: "Seun Adebayo", avatar: "SA", points: 5400, coursesCompleted: 7, assessmentsPassed: 12, streak: 9, badge: null },
  { rank: 10, name: "Ifunanya Obi", avatar: "IO", points: 4800, coursesCompleted: 6, assessmentsPassed: 10, streak: 7, badge: null },
];

const RANK_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];
const AVATAR_GRADIENTS = ["from-violet-600 to-indigo-600", "from-blue-600 to-cyan-600", "from-emerald-600 to-teal-600", "from-orange-600 to-red-600", "from-pink-600 to-rose-600"];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"weekly"|"monthly"|"all_time">("all_time");

  const top3 = MOCK_ENTRIES.slice(0, 3);
  const rest = MOCK_ENTRIES.slice(3);

  return (
    <div className="pb-20 lg:pb-0">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold mb-4">
            <Trophy className="w-4 h-4" /> Championship League
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Leaderboard</h1>
          <p className="text-slate-400">Earn points by completing courses and passing assessments. Top learners win prizes.</p>
        </div>

        {/* Period tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 flex gap-1">
            {(["weekly","monthly","all_time"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${period===p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {p.replace("_"," ")}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            const heights = ["h-32", "h-40", "h-28"];
            const podiumPositions = [2, 1, 3];
            return entry ? (
              <div key={entry.rank} className="flex flex-col items-center gap-3">
                <div className="text-2xl">{entry.badge}</div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[entry.rank-1] || AVATAR_GRADIENTS[0]} flex items-center justify-center text-white font-bold border-2 ${entry.rank===1?"border-yellow-400":entry.rank===2?"border-slate-300":"border-amber-600"}`}>
                  {entry.avatar}
                </div>
                <p className="text-white font-semibold text-sm text-center">{entry.name.split(" ")[0]}</p>
                <p className="text-indigo-400 font-bold text-sm">{entry.points.toLocaleString()} pts</p>
                <div className={`${heights[i]} w-24 rounded-t-xl flex items-center justify-center text-2xl font-extrabold border border-white/10 ${i===1?"bg-gradient-to-t from-yellow-600/40 to-yellow-400/20 text-yellow-400":i===0?"bg-gradient-to-t from-slate-600/40 to-slate-400/20 text-slate-300":"bg-gradient-to-t from-amber-700/40 to-amber-500/20 text-amber-600"}`}>
                  {podiumPositions[i]}
                </div>
              </div>
            ) : null;
          })}
        </div>

        {/* Rest of list */}
        <div className="space-y-2">
          {rest.map((entry, i) => (
            <div key={entry.rank}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${entry.isYou ? "bg-indigo-600/20 border-indigo-500/50" : "bg-slate-800/50 border-slate-700 hover:border-slate-600"}`}>
              <span className={`text-lg font-bold w-6 text-center ${i < 3 ? RANK_COLORS[i] : "text-slate-500"}`}>{entry.rank}</span>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[(entry.rank-1)%AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm truncate">{entry.name}</p>
                  {entry.isYou && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">You</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{entry.coursesCompleted} courses</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{entry.assessmentsPassed} passed</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{entry.streak} day streak</span>
                </div>
              </div>
              <p className="text-indigo-400 font-bold text-sm shrink-0">{entry.points.toLocaleString()} pts</p>
            </div>
          ))}
        </div>

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
