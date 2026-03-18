import { Trophy } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  user: { firstName: string; lastName: string; avatarUrl?: string };
  points: number;
  coursesCompleted: number;
  assessmentsPassed: number;
  isCurrentUser?: boolean;
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

export default function LeaderboardRow({ rank, user, points, coursesCompleted, assessmentsPassed, isCurrentUser }: LeaderboardRowProps) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${isCurrentUser ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[#1e293b] border-[#334155] hover:border-[#475569]'}`}>
      {/* Rank */}
      <div className="w-8 text-center">
        {rank <= 3 ? (
          <Trophy className={`w-5 h-5 mx-auto ${rankColors[rank]}`} />
        ) : (
          <span className="text-slate-500 font-bold text-sm">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
        ) : (
          `${user.firstName[0]}${user.lastName[0]}`
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-indigo-300' : 'text-white'}`}>
          {user.firstName} {user.lastName}
          {isCurrentUser && <span className="ml-2 text-xs text-indigo-400">(You)</span>}
        </p>
        <p className="text-slate-500 text-xs">{coursesCompleted} courses · {assessmentsPassed} assessments</p>
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <p className="text-white font-bold">{points.toLocaleString()}</p>
        <p className="text-slate-500 text-xs">points</p>
      </div>
    </div>
  );
}
