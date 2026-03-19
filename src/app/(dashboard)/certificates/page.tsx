"use client";
import { useEffect, useState } from "react";
import { Award, Download, Share2, QrCode, CheckCircle, RefreshCw } from "lucide-react";
import { certificatesApi } from "@/lib/api";
import { CertificateCardSkeleton } from "@/components/Skeleton";

interface Certificate {
  id: string;
  certificateNumber: string;
  qrCodeData: string;
  issuedAt: string;
  pdfUrl?: string;
  course?: {
    id: string;
    title: string;
    category?: string;
    instructor?: { firstName: string; lastName: string };
  };
  user?: { firstName: string; lastName: string };
}

const CERT_GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-rose-600 to-pink-600",
  "from-amber-600 to-orange-600",
];

function getGradient(index: number) {
  return CERT_GRADIENTS[index % CERT_GRADIENTS.length];
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copying, setCopying] = useState<string | null>(null);

  async function loadCerts() {
    setLoading(true);
    setError("");
    try {
      const data = await certificatesApi.mine();
      setCerts(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCerts(); }, []);

  async function handleShare(cert: Certificate) {
    const url = cert.qrCodeData;
    if (navigator.share) {
      navigator.share({ title: `My ApexLearn Certificate`, url }).catch(() => {});
    } else {
      setCopying(cert.id);
      await navigator.clipboard.writeText(url).catch(() => {});
      setTimeout(() => setCopying(null), 2000);
    }
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3">My Certificates</h1>
          <p className="text-slate-400">Your earned certificates — QR-verified and ready for sharing.</p>
        </div>
        <button
          onClick={loadCerts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500/50 transition-colors text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <CertificateCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && certs.length === 0 && (
        <div className="text-center py-24 text-slate-500">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-semibold text-slate-400">No certificates yet</p>
          <p className="text-sm mt-2">Complete a course to earn your first certificate.</p>
        </div>
      )}

      {/* Certificate grid */}
      {!loading && certs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certs.map((cert, idx) => {
            const gradient = getGradient(idx);
            const recipientName = cert.user
              ? `${cert.user.firstName} ${cert.user.lastName}`
              : "Learner";
            const courseTitle = cert.course?.title ?? "Course Completion";
            const instructorName = cert.course?.instructor
              ? `${cert.course.instructor.firstName} ${cert.course.instructor.lastName}`
              : "Expert Instructor";
            const category = cert.course?.category ?? "Learning";
            const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "long", year: "numeric",
            });

            return (
              <div
                key={cert.id}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all"
              >
                {/* Certificate design */}
                <div className={`bg-gradient-to-br ${gradient} p-8 relative`}>
                  {/* Corner ornament */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  {/* Border lines */}
                  <div className="absolute inset-3 border border-white/20 rounded-xl pointer-events-none" />

                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
                    Certificate of Completion
                  </p>
                  <h2 className="text-white font-extrabold text-xl leading-tight mb-3">
                    {courseTitle}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Issued to <span className="font-bold text-white">{recipientName}</span>
                  </p>
                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <p className="text-white/60 text-xs">Instructor</p>
                      <p className="text-white text-sm font-semibold">{instructorName}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-xs">Issued by</p>
                      <p className="text-white text-sm font-semibold">ApexLearn™</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Date</p>
                      <p className="text-white text-sm font-semibold">{issuedDate}</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                      <QrCode className="w-9 h-9 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>QR Verified</span>
                    <span className="ml-auto text-slate-500 text-xs font-mono truncate max-w-[180px]">
                      {cert.certificateNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Instructor: <span className="text-slate-300">{instructorName}</span>
                    {" · "}
                    Category: <span className="text-slate-300">{category}</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <a
                      href={certificatesApi.downloadUrl(cert.certificateNumber)}
                      download={`ApexLearn-Certificate-${cert.certificateNumber}.pdf`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                    <button
                      onClick={() => handleShare(cert)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {copying === cert.id ? "Copied!" : "Share"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification info */}
      <div className="mt-12 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-indigo-400" />
          Certificate Verification
        </h3>
        <p className="text-slate-400 text-sm">
          All ApexLearn certificates are QR-verified. Employers and institutions can scan the QR code
          or visit{" "}
          <span className="text-indigo-400">verify.apexlearn.ng/[certificate-number]</span> to
          instantly confirm authenticity.
        </p>
      </div>
    </div>
  );
}
