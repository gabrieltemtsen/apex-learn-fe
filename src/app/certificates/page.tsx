"use client";
import { Award, Download, Share2, QrCode, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const MOCK_CERTS = [
  { id: "1", courseTitle: "AI Fundamentals for Public Servants", certificateNumber: "APX-2026-AI-001234", issuedAt: "2026-02-14", instructorName: "Dr. Amaka Obi", category: "Artificial Intelligence", gradient: "from-violet-600 to-indigo-600" },
  { id: "2", courseTitle: "Data Governance & NDPR Compliance", certificateNumber: "APX-2026-DG-005678", issuedAt: "2026-01-28", instructorName: "Engr. Tunde Adeyemi", category: "Compliance", gradient: "from-blue-600 to-cyan-600" },
];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">My Certificates</h1>
          <p className="text-slate-400">Your earned certificates — QR-verified and ready for sharing.</p>
        </div>

        {MOCK_CERTS.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold text-slate-400">No certificates yet</p>
            <p className="text-sm mt-2">Complete a course to earn your first certificate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_CERTS.map(cert => (
              <div key={cert.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all">
                {/* Certificate design */}
                <div className={`bg-gradient-to-br ${cert.gradient} p-8 relative`}>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Certificate of Completion</p>
                  <h2 className="text-white font-extrabold text-xl leading-tight mb-3">{cert.courseTitle}</h2>
                  <p className="text-white/80 text-sm">Issued to <span className="font-bold text-white">Gabriel Temtsen</span></p>
                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <p className="text-white/60 text-xs">Issued by</p>
                      <p className="text-white text-sm font-semibold">ApexLearn™</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Date</p>
                      <p className="text-white text-sm font-semibold">{new Date(cert.issuedAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})}</p>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>QR Verified</span>
                    <span className="ml-auto text-slate-500 text-xs font-mono">{cert.certificateNumber}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Instructor: <span className="text-slate-300">{cert.instructorName}</span> · Category: <span className="text-slate-300">{cert.category}</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition-colors">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verification info */}
        <div className="mt-12 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2"><QrCode className="w-5 h-5 text-indigo-400" />Certificate Verification</h3>
          <p className="text-slate-400 text-sm">All ApexLearn certificates are QR-verified. Employers and institutions can scan the QR code or visit <span className="text-indigo-400">verify.apexlearn.ng/[certificate-number]</span> to instantly confirm authenticity.</p>
        </div>
      </div>
    </div>
  );
}
