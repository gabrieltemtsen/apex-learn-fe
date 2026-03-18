"use client";
import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

const MOCK_QUIZ = {
  title: "AI Fundamentals — Final Assessment",
  timeLimitMinutes: 20,
  passScore: 70,
  questions: [
    { id: "q1", question: "Which of the following best describes Machine Learning?", options: ["A type of robot that can walk", "A subset of AI that enables systems to learn from data", "A programming language for AI", "A database management system"], correctAnswer: "A subset of AI that enables systems to learn from data", explanation: "Machine Learning (ML) is a subset of AI that gives systems the ability to automatically learn and improve from experience without being explicitly programmed." },
    { id: "q2", question: "What does NDPR stand for in Nigeria?", options: ["National Data Protection Regulation", "Nigerian Digital Privacy Rights", "National Digital Policy Reform", "Nigerian Data Processing Rules"], correctAnswer: "National Data Protection Regulation", explanation: "NDPR stands for the Nigeria Data Protection Regulation, which is the primary data privacy law in Nigeria, enacted in 2019." },
    { id: "q3", question: "Which government agency is responsible for AI policy in Nigeria?", options: ["CBN", "EFCC", "NITDA", "CAC"], correctAnswer: "NITDA", explanation: "NITDA (National Information Technology Development Agency) is responsible for developing and regulating IT in Nigeria, including AI policy." },
    { id: "q4", question: "What is Deep Learning?", options: ["Learning that happens underground", "A subset of ML using neural networks with many layers", "Learning from deep books", "A type of database query"], correctAnswer: "A subset of ML using neural networks with many layers", explanation: "Deep Learning is a subset of Machine Learning that uses neural networks with many layers (hence 'deep') to analyze various factors of data." },
    { id: "q5", question: "Which of the following is an example of AI in the public sector?", options: ["Manual filing of documents", "Predictive analytics for tax compliance", "Traditional classroom teaching", "Paper-based voting systems"], correctAnswer: "Predictive analytics for tax compliance", explanation: "Predictive analytics uses AI/ML to forecast outcomes — in this case, identifying potential tax compliance issues before they arise." },
  ],
};

type Phase = "intro" | "quiz" | "results";

export default function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(MOCK_QUIZ.timeLimitMinutes * 60);

  useEffect(() => {
    if (phase !== "quiz") return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setPhase("results"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const q = MOCK_QUIZ.questions[current];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  function handleNext() {
    if (selected) setAnswers(prev => ({ ...prev, [q.id]: selected }));
    setSelected(null);
    if (current < MOCK_QUIZ.questions.length - 1) setCurrent(c => c + 1);
    else setPhase("results");
  }

  const score = MOCK_QUIZ.questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const scorePercent = Math.round((score / MOCK_QUIZ.questions.length) * 100);
  const passed = scorePercent >= MOCK_QUIZ.passScore;

  if (phase === "intro") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">{MOCK_QUIZ.title}</h1>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[{label:"Questions", val:MOCK_QUIZ.questions.length},{label:"Time Limit", val:`${MOCK_QUIZ.timeLimitMinutes} min`},{label:"Pass Score", val:`${MOCK_QUIZ.passScore}%`}].map(s=>(
            <div key={s.label} className="bg-slate-900 rounded-xl p-3">
              <p className="text-white font-bold text-xl">{s.val}</p>
              <p className="text-slate-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="text-slate-400 text-sm space-y-1 text-left bg-slate-900 rounded-xl p-4">
          <p>• Once started, the timer cannot be paused.</p>
          <p>• Each question has one correct answer.</p>
          <p>• You can review your answers after submission.</p>
          <p>• A certificate is issued upon passing.</p>
        </div>
        <button onClick={() => setPhase("quiz")} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all active:scale-95">
          Start Assessment
        </button>
      </div>
    </div>
  );

  if (phase === "results") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full space-y-6">
        {/* Score card */}
        <div className={`rounded-2xl border p-8 text-center ${passed ? "bg-emerald-900/20 border-emerald-500/30" : "bg-red-900/20 border-red-500/30"}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
            {passed ? <CheckCircle className="w-10 h-10 text-emerald-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">{passed ? "Congratulations!" : "Keep Practicing"}</h1>
          <p className="text-slate-300 mb-6">{passed ? "You passed the assessment!" : `You need ${MOCK_QUIZ.passScore}% to pass. Try again!`}</p>
          <div className="text-6xl font-extrabold mb-2" style={{color: passed ? "#10b981" : "#ef4444"}}>{scorePercent}%</div>
          <p className="text-slate-400">{score} / {MOCK_QUIZ.questions.length} correct</p>
          <div className="flex gap-3 justify-center mt-6">
            {passed && <Link href="/certificates" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all">View Certificate</Link>}
            <button onClick={() => { setPhase("intro"); setCurrent(0); setAnswers({}); setSelected(null); setTimeLeft(MOCK_QUIZ.timeLimitMinutes * 60); }}
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all">
              {passed ? "Retake" : "Try Again"}
            </button>
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Review Answers</h2>
          {MOCK_QUIZ.questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`bg-slate-800 border rounded-xl p-4 ${isCorrect ? "border-emerald-500/30" : "border-red-500/30"}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-slate-500 text-sm font-bold shrink-0">Q{i+1}</span>
                  <p className="text-white text-sm font-medium">{q.question}</p>
                  {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                </div>
                {!isCorrect && userAnswer && <p className="text-red-400 text-xs mb-1">Your answer: {userAnswer}</p>}
                <p className="text-emerald-400 text-xs mb-2">Correct: {q.correctAnswer}</p>
                <p className="text-slate-400 text-xs bg-slate-900 rounded-lg p-2">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-white font-bold text-sm truncate max-w-xs">{MOCK_QUIZ.title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Q{current+1}/{MOCK_QUIZ.questions.length}</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${timeLeft < 120 ? "bg-red-900/40 text-red-400 border border-red-500/40" : "bg-slate-800 text-slate-300"}`}>
            <Clock className="w-3.5 h-3.5" />
            {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800"><div style={{width:`${((current+1)/MOCK_QUIZ.questions.length)*100}%`}} className="h-full bg-indigo-500 transition-all" /></div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8">
            <p className="text-indigo-400 text-xs font-semibold mb-4">Question {current+1} of {MOCK_QUIZ.questions.length}</p>
            <h2 className="text-white text-xl font-bold mb-6 leading-snug">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt) => (
                <button key={opt} onClick={() => setSelected(opt)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${selected === opt ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleNext} disabled={!selected}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {current < MOCK_QUIZ.questions.length - 1 ? "Next" : "Submit"} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
