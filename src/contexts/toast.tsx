"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "bg-emerald-900/90 border-emerald-500/50 text-emerald-300",
  error:   "bg-red-900/90 border-red-500/50 text-red-300",
  warning: "bg-yellow-900/90 border-yellow-500/50 text-yellow-300",
  info:    "bg-indigo-900/90 border-indigo-500/50 text-indigo-300",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = ICONS[toast.type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl max-w-sm w-full transition-all duration-300 ${STYLES[toast.type]} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info", duration?: number) => {
    const id = `toast-${++counter.current}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }]); // max 5 at once
  }, []);

  const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const error   = useCallback((msg: string) => toast(msg, "error"),   [toast]);
  const warning = useCallback((msg: string) => toast(msg, "warning"), [toast]);
  const info    = useCallback((msg: string) => toast(msg, "info"),    [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
