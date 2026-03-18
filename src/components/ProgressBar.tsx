interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'indigo' | 'emerald' | 'violet' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  yellow: 'bg-yellow-500',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'indigo',
  size = 'md',
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-slate-400">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-white">{percent}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#334155] rounded-full ${sizeMap[size]} overflow-hidden`}>
        <div
          className={`${colorMap[color]} ${sizeMap[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
