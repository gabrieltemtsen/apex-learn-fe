'use client';
import { CheckCircle2, Circle, Play, FileText, HelpCircle, Video } from 'lucide-react';
import { clsx } from 'clsx';

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationSeconds: number;
  completed?: boolean;
  isFree?: boolean;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
}

const typeIcons: Record<string, any> = {
  video: Video,
  text: FileText,
  quiz: HelpCircle,
  live: Play,
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LessonSidebar({ lessons, currentLessonId, onSelectLesson }: LessonSidebarProps) {
  return (
    <div className="w-72 bg-[#1e293b] border-r border-[#334155] h-full overflow-y-auto">
      <div className="p-4 border-b border-[#334155]">
        <h2 className="text-white font-semibold text-sm">Course Curriculum</h2>
        <p className="text-slate-500 text-xs mt-1">{lessons.length} lessons</p>
      </div>
      <div className="p-2">
        {lessons.map((lesson) => {
          const Icon = typeIcons[lesson.type] || Video;
          const isActive = lesson.id === currentLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={clsx(
                'w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 transition-colors mb-1',
                isActive ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-[#334155]',
              )}
            >
              {lesson.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', isActive ? 'text-indigo-400' : 'text-slate-500')} />
              )}
              <div className="flex-1 min-w-0">
                <p className={clsx('text-sm font-medium leading-tight truncate', isActive ? 'text-indigo-300' : 'text-slate-300')}>
                  {lesson.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Icon className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-500 text-xs">{formatDuration(lesson.durationSeconds)}</span>
                  {lesson.isFree && <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Free</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
