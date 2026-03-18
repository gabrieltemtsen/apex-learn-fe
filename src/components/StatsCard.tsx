import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'emerald' | 'violet' | 'yellow';
}

const colorMap = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
};

export default function StatsCard({ title, value, icon: Icon, change, changeType = 'neutral', color = 'indigo' }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {change && (
        <p className={`text-sm ${changeType === 'up' ? 'text-emerald-400' : changeType === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
        </p>
      )}
    </div>
  );
}
