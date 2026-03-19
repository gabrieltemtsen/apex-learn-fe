import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-xl">Apex<span className="text-indigo-400">Learn</span>™</span>
        </Link>

        {/* 404 */}
        <div className="text-[120px] font-extrabold leading-none bg-gradient-to-b from-indigo-400 to-indigo-900 bg-clip-text text-transparent select-none">
          404
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
          <p className="text-slate-400 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold transition-all"
          >
            <Search className="w-4 h-4" /> Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
