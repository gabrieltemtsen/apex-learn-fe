import Link from 'next/link';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  instructor?: { firstName: string; lastName: string };
  averageRating: number;
  enrollmentCount: number;
  durationHours: number;
  level: string;
  category?: string;
}

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function CourseCard({
  title, slug, description, thumbnailUrl, instructor,
  averageRating, enrollmentCount, durationHours, level, category,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`} className="group block">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-indigo-600/30 to-violet-600/30 relative overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-indigo-400/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${levelColors[level] || levelColors.beginner} capitalize`}>
              {level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {category && (
            <p className="text-indigo-400 text-xs font-medium uppercase tracking-wide mb-2">{category}</p>
          )}
          <h3 className="text-white font-semibold text-base leading-tight mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">{description}</p>

          {instructor && (
            <p className="text-slate-500 text-xs mb-3">
              by <span className="text-slate-400">{instructor.firstName} {instructor.lastName}</span>
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-slate-300">{averageRating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {enrollmentCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {durationHours}h
            </span>
          </div>

          <button className="mt-4 w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg py-2 text-sm font-medium transition-all duration-200">
            View Course
          </button>
        </div>
      </div>
    </Link>
  );
}
