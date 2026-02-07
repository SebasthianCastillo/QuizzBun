import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionStore } from "../store/useQuestionsStore";
import { Trophy, Target, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Score() {
  const questions = useQuestionStore((state) => state.questions);
  const name = useQuestionStore((state) => state.name);
  const resetGame = useQuestionStore((state) => state.resetGame);
  const correctAnswers = questions.filter((q) => q.isCorrectAnswer).length;
  const totalQuestions = questions.length;
  const scorePercentage =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const [scores, setScores] = useState<
    Array<{ id: number; name: string; score: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/getScore`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch scores");
      }

      const data = await res.json();
      setScores(data);
      console.log("Scores fetched:", data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
            <CardTitle className="text-4xl font-bold text-white mb-2">
              Quiz Completado
            </CardTitle>
            <p className="text-xl text-purple-200">
              {name ? `Jugador, ${name}!` : "Jugador"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <p className="text-sm text-purple-300 mt-2">
                {scorePercentage.toFixed(0)}% Correct
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">
                  {correctAnswers}
                </p>
                <p className="text-sm text-green-200">Correctas</p>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-400">
                  {totalQuestions - correctAnswers}
                </p>
                <p className="text-sm text-red-200">Incorrectas</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Volver a jugar
              </Button>
            </div>
          </CardContent>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Previous Scores</h3>
            {loading ? (
              <p className="text-purple-200">Loading scores...</p>
            ) : scores.length > 0 ? (
              <div className="space-y-2">
                {scores.map((score: { id: number; name: string; score: string }) => (
                  <div key={score.id} className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-white font-medium">{score.name}</span>
                    <span className="text-purple-200">{score.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-200">No scores yet. Be the first!</p>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
