'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Award, Clock, Zap, LayoutDashboard, GraduationCap,
  Search, FileCheck, Trophy, ScrollText, Settings, ChevronRight, Play,
  TrendingUp, Users
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatsCard from '@/components/StatsCard';
import ProgressBar from '@/components/ProgressBar';
import CertificateCard from '@/components/CertificateCard';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: GraduationCap, label: 'My Courses', href: '/courses' },
  { icon: Search, label: 'Explore', href: '/courses' },
  { icon: FileCheck, label: 'Assessments', href: '/assessments' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: Award, label: 'Certificates', href: '/certificates' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrRes, certRes] = await Promise.all([
          api.get('/enrollments/my'),
          api.get('/certificates/my'),
        ]);
        setEnrollments(enrRes.data);
        setCertificates(certRes.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const inProgress = enrollments.filter((e) => e.status === 'active');
  const completed = enrollments.filter((e) => e.status === 'completed');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f172a] flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col fixed h-full">
          <div className="p-6 border-b border-[#334155]">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">ApexLearn™</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#334155]'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          {user && (
            <div className="p-4 border-t border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-500 text-xs capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-slate-400">Continue your learning journey</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Enrolled Courses" value={enrollments.length} icon={BookOpen} color="indigo" />
            <StatsCard title="Completed" value={completed.length} icon={Award} color="emerald" />
            <StatsCard title="Points Earned" value={user?.points || 0} icon={Zap} color="violet" />
            <StatsCard title="Day Streak" value={`${user?.streak || 0} 🔥`} icon={TrendingUp} color="yellow" />
          </div>

          {/* Continue Learning */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Continue Learning</h2>
              <Link href="/courses" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => <div key={i} className="h-40 bg-[#1e293b] rounded-2xl animate-pulse" />)}
              </div>
            ) : inProgress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgress.slice(0, 4).map((enrollment) => (
                  <div key={enrollment.id} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-indigo-500/40 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm mb-1">{enrollment.course?.title || 'Course'}</p>
                        <p className="text-slate-500 text-xs">
                          by {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                        </p>
                      </div>
                      <Link
                        href={`/courses/${enrollment.course?.slug}/learn`}
                        className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors ml-3"
                      >
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </Link>
                    </div>
                    <ProgressBar value={enrollment.progressPercent} size="sm" showPercent={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#1e293b] border border-[#334155] rounded-2xl">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No courses yet. Start learning today!</p>
                <Link href="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">My Certificates</h2>
                <Link href="/certificates" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.slice(0, 2).map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    certificateNumber={cert.certificateNumber}
                    courseName={cert.course?.title || 'Course'}
                    issuedAt={cert.issuedAt}
                    qrCodeData={cert.qrCodeData}
                    tenantName={cert.tenant?.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Browse Courses', href: '/courses', icon: Search, color: 'indigo' },
                { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: 'violet' },
                { label: 'My Certificates', href: '/certificates', icon: Award, color: 'emerald' },
                { label: 'Assessments', href: '/assessments', icon: FileCheck, color: 'yellow' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-indigo-500/40 transition-colors text-center group"
                >
                  <action.icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
                  <p className="text-slate-300 text-sm font-medium">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
