interface BadgeProps {
  label: string;
  icon?: string;
  earned?: boolean;
  description?: string;
}

export default function Badge({ label, icon = '🏆', earned = true, description }: BadgeProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${earned ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-[#1e293b] border-[#334155] text-slate-500 opacity-50'}`}>
      <span className="text-3xl">{icon}</span>
      <span className="text-xs font-medium text-center">{label}</span>
      {description && <span className="text-xs text-slate-500 text-center">{description}</span>}
    </div>
  );
}
