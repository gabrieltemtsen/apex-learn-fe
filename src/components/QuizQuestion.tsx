interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showResult?: boolean;
  correctAnswer?: string;
  explanation?: string;
}

export default function QuizQuestion({
  questionNumber, totalQuestions, question, options,
  selectedAnswer, onSelectAnswer, showResult, correctAnswer, explanation,
}: QuizQuestionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-slate-500 text-sm mb-2">Question {questionNumber} of {totalQuestions}</p>
      <h3 className="text-white text-lg font-semibold mb-6">{question}</h3>
      <div className="space-y-3">
        {options.map((option) => {
          let className = 'w-full text-left px-4 py-3 rounded-xl border transition-all ';
          if (showResult && correctAnswer) {
            if (option === correctAnswer) {
              className += 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
            } else if (option === selectedAnswer && option !== correctAnswer) {
              className += 'bg-red-500/10 border-red-500 text-red-400';
            } else {
              className += 'bg-[#1e293b] border-[#334155] text-slate-400';
            }
          } else if (option === selectedAnswer) {
            className += 'bg-indigo-500/10 border-indigo-500 text-indigo-300';
          } else {
            className += 'bg-[#1e293b] border-[#334155] text-slate-300 hover:border-indigo-500/50 hover:text-white';
          }

          return (
            <button
              key={option}
              onClick={() => !showResult && onSelectAnswer(option)}
              disabled={showResult}
              className={className}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showResult && explanation && (
        <div className="mt-4 p-4 bg-[#1e293b] border border-[#334155] rounded-xl">
          <p className="text-slate-400 text-sm"><span className="text-indigo-400 font-medium">Explanation: </span>{explanation}</p>
        </div>
      )}
    </div>
  );
}
