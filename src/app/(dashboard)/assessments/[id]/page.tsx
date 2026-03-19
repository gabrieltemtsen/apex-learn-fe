"use client";
import { useState, useEffect, useRef, use } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, AlertTriangle, Loader2, Brain } from "lucide-react";
import Link from "next/link";
import { assessmentsApi } from "@/lib/api";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

interface Assessment {
  id: string;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passScore: number;
  type: string;
  questions: Question[];
}

interface AttemptResult {
  score: number;
  passed: boolean;
  timeTakenSeconds: number;
}

type Phase = "loading" | "error" | "intro" | "quiz" | "submitting" | "results";

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [phase, setPhase] = useState<Phase>("loading");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Quiz state
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const startTimeRef = useRef<number>(0);

  // Results
  const [result, setResult] = useState<AttemptResult | null>(null);

  // Load assessment
  useEffect(() => {
    (async () => {
      try {
        const data = await assessmentsApi.get(id);
        setAssessment(data);
        setTimeLeft((data.timeLimitMinutes ?? 20) * 60);
        setPhase("intro");
      } catch {
        setErrorMsg("Assessment not found or you don't have access.");
        setPhase("error");
      }
    })();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "quiz") return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function startQuiz() {
    startTimeRef.current = Date.now();
    setPhase("quiz");
  }

  function handleNext() {
    if (selected && assessment) {
      setAnswers(prev => ({ ...prev, [assessment.questions[current].id]: selected }));
    }
    setSelected(null);
    if (assessment && current < assessment.questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      handleSubmit(false);
    }
  }

  async function handleSubmit(timeExpired = false) {
    if (!assessment) return;

    // Capture final answer if time expired mid-question
    const finalAnswers = timeExpired && selected
      ? { ...answers, [assessment.questions[current].id]: selected }
      : answers;

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    setPhase("submitting");

    try {
      const res = await assessmentsApi.submit(id, finalAnswers, timeTakenSeconds);
      setResult(res);
    } catch {
      // Fallback: compute locally if submit fails
      const qs = assessment.questions;
      let correct = 0;
      for (const q of qs) {
        if (finalAnswers[q.id] === q.correctAnswer) correct++;
      }
      const score = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
      setResult({ score, passed: score >= assessment.passScore, timeTakenSeconds });
    }
    setPhase("results");
  }

  function retry() {
    if (!assessment) return;
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft((assessment.timeLimitMinutes ?? 20) * 60);
    setResult(null);
    setPhase("intro");
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
        <p className="text-slate-400">Loading assessment…</p>
      </div>
    </div>
  );

  // ── Error ───────────────────────────────────────────────────────────────────
  if (phase === "error") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <XCircle className="w-14 h-14 text-red-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">Oops</h1>
        <p className="text-slate-400">{errorMsg}</p>
        <Link href="/courses" className="inline-block px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all">
          Back to Courses
        </Link>
      </div>
    </div>
  );

  if (!assessment) return null;
  const q = assessment.questions[current];

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            {assessment.type.replace("_", " ")}
          </span>
          <h1 className="text-2xl font-bold text-white leading-snug">{assessment.title}</h1>
          {assessment.description && (
            <p className="text-slate-400 text-sm mt-2">{assessment.description}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Questions", val: assessment.questions.length },
            { label: "Time Limit", val: `${assessment.timeLimitMinutes ?? 20} min` },
            { label: "Pass Score", val: `${assessment.passScore}%` },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 rounded-xl p-3">
              <p className="text-white font-bold text-xl">{s.val}</p>
              <p className="text-slate-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-slate-400 text-sm space-y-1.5 bg-slate-900 rounded-xl p-4">
          <p>• Timer starts when you click Begin and cannot be paused.</p>
          <p>• Each question has one correct answer.</p>
          <p>• You&apos;ll see explanations for every question after submission.</p>
          <p>• Passing earns you +50 points toward the leaderboard.</p>
          {assessment.passScore >= 70 && <p>• A certificate is issued upon passing this course&apos;s final exam.</p>}
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all active:scale-95"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );

  // ── Submitting ──────────────────────────────────────────────────────────────
  if (phase === "submitting") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
        <p className="text-slate-400">Grading your answers…</p>
      </div>
    </div>
  );

  // ── Results ─────────────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const scorePercent = Math.round(result.score);
    const passed = result.passed;
    const mins2 = Math.floor(result.timeTakenSeconds / 60);
    const secs2 = result.timeTakenSeconds % 60;

    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full space-y-6">
          {/* Score card */}
          <div className={`rounded-2xl border p-8 text-center ${passed ? "bg-emerald-900/20 border-emerald-500/30" : "bg-red-900/20 border-red-500/30"}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
              {passed
                ? <CheckCircle className="w-10 h-10 text-emerald-400" />
                : <XCircle className="w-10 h-10 text-red-400" />
              }
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {passed ? "Congratulations!" : "Keep Practicing"}
            </h1>
            <p className="text-slate-300 mb-6">
              {passed ? "You passed the assessment! +50 points added." : `You need ${assessment.passScore}% to pass. Keep going!`}
            </p>
            <div className="text-6xl font-extrabold mb-2" style={{ color: passed ? "#10b981" : "#ef4444" }}>
              {scorePercent}%
            </div>
            <p className="text-slate-400 text-sm">
              Time taken: {mins2}m {String(secs2).padStart(2, "0")}s
            </p>

            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              {passed && (
                <Link href="/certificates" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all">
                  View Certificate
                </Link>
              )}
              <button
                onClick={retry}
                className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
              >
                {passed ? "Retake" : "Try Again"}
              </button>
              <Link href="/courses" className="px-6 py-3 rounded-xl bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 text-indigo-300 font-semibold transition-all">
                Back to Courses
              </Link>
            </div>
          </div>

          {/* Answer review */}
          <div className="space-y-3">
            <h2 className="text-white font-bold text-lg">Answer Review</h2>
            {assessment.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`bg-slate-800 border rounded-xl p-4 ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-slate-500 text-sm font-bold shrink-0 mt-0.5">Q{i + 1}</span>
                    <p className="text-white text-sm font-medium flex-1">{q.question}</p>
                    {isCorrect
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    }
                  </div>
                  {!isCorrect && userAnswer && (
                    <p className="text-red-400 text-xs mb-1 ml-8">Your answer: {userAnswer}</p>
                  )}
                  {!isCorrect && !userAnswer && (
                    <p className="text-slate-500 text-xs mb-1 ml-8">Not answered (time expired)</p>
                  )}
                  <p className="text-emerald-400 text-xs mb-2 ml-8">✓ Correct: {q.correctAnswer}</p>
                  {q.explanation && (
                    <p className="text-slate-400 text-xs bg-slate-900 rounded-lg p-2 ml-8">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Sticky header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-white font-bold text-sm truncate max-w-xs">{assessment.title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Q{current + 1}/{assessment.questions.length}</span>
          {assessment.timeLimitMinutes && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${timeLeft < 120 ? "bg-red-900/40 text-red-400 border border-red-500/40 animate-pulse" : "bg-slate-800 text-slate-300"}`}>
              <Clock className="w-3.5 h-3.5" />
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div
          style={{ width: `${((current + 1) / assessment.questions.length) * 100}%` }}
          className="h-full bg-indigo-500 transition-all duration-300"
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-6">
          {/* Question difficulty badge */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
              q.difficulty === "hard" ? "text-red-400 border-red-500/40 bg-red-500/10"
              : q.difficulty === "easy" ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
              : "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
            }`}>
              {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
            </span>
            <span className="text-slate-500 text-xs">Question {current + 1} of {assessment.questions.length}</span>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white text-xl font-bold mb-6 leading-snug">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, optIdx) => {
                const optLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      selected === opt
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected === opt ? "border-indigo-400 bg-indigo-500/30 text-indigo-300" : "border-slate-600 text-slate-500"
                    }`}>
                      {optLabel}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {assessment.questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < current ? "bg-indigo-500" : i === current ? "bg-indigo-400 w-4" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {current < assessment.questions.length - 1 ? "Next" : "Submit"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Warning when time < 2 min */}
          {timeLeft < 120 && timeLeft > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Less than 2 minutes remaining!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
