import Question from "./Question";
import Score from "./Score";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuestionStore } from "../store/useQuestionsStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Game() {
  const questions = useQuestionStore((state) => state.questions);
  const currentQuestion = useQuestionStore((state) => state.currentQuestion);
  const nextQuestion = useQuestionStore((state) => state.goNextQuestion);
  const previusQuestion = useQuestionStore((state) => state.goPreviusQuestion);
  const isGameComplete = useQuestionStore((state) => state.isGameComplete);
  const questionInfo = questions[currentQuestion];

  // Show Score component when game is complete
  if (isGameComplete) {
    return <Score />;
  }

  const progressPercentage =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with progress */}
        <header className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Quiz</h1>
            <p className="text-purple-200">Lol</p>
          </div>

          {/* Progress indicator */}
          <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-purple-200">
                  Progreso
                </span>
                <span className="text-sm font-bold text-white">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              {/* Custom progress bar using div */}
              <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Main content area */}
        <main className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 shadow-2xl">
            <CardContent className="p-8">
              <Question info={questionInfo} />
            </CardContent>
          </Card>
        </main>

        {/* Navigation controls */}
        <footer>
          <div className="flex justify-between items-center gap-4">
            <Button
              onClick={previusQuestion}
              disabled={isFirstQuestion}
              variant="outline"
              size="lg"
              className="bg-purple-600/20 border-purple-400/30 text-purple-200 hover:bg-purple-600/30 hover:text-white disabled:opacity/50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-purple-200 text-sm">Question</span>
              <span className="text-white font-bold text-lg">
                {currentQuestion + 1}
              </span>
              <span className="text-purple-200 text-sm">
                of {questions.length}
              </span>
            </div>

            <Button
              onClick={nextQuestion}
              disabled={isLastQuestion}
              variant="outline"
              size="lg"
              className="bg-purple-600/20 border-purple-400/30 text-purple-200 hover:bg-purple-600/30 hover:text-white disabled:opacity/50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
