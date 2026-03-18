import { Award, ExternalLink, QrCode } from 'lucide-react';

interface CertificateCardProps {
  certificateNumber: string;
  courseName: string;
  issuedAt: string;
  qrCodeData: string;
  tenantName?: string;
}

export default function CertificateCard({ certificateNumber, courseName, issuedAt, qrCodeData, tenantName }: CertificateCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#334155] rounded-2xl overflow-hidden">
      {/* Certificate header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-white" />
          <span className="text-white font-semibold text-sm">Certificate of Completion</span>
        </div>
        {tenantName && <span className="text-indigo-200 text-xs">{tenantName}</span>}
      </div>

      {/* Certificate body */}
      <div className="p-5">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-2">{courseName}</h3>
        <p className="text-slate-400 text-xs mb-4">
          Issued on {new Date(issuedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs mb-1">Certificate ID</p>
            <p className="text-indigo-400 text-xs font-mono">{certificateNumber}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/certificates/verify/${certificateNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-[#334155] px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Verify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
