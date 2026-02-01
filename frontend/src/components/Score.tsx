import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";
import { useQuestionStore } from "../store/useQuestionsStore";
import { Trophy, Target, RotateCcw } from "lucide-react";
import { useEffect } from "react"

export default function Score() {
    const questions = useQuestionStore((state) => state.questions);
    const name = useQuestionStore((state) => state.name);
    const resetGame = useQuestionStore((state) => state.resetGame);

    const correctAnswers = questions.filter((q) => q.isCorrectAnswer).length;
    const totalQuestions = questions.length;
    const scorePercentage =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    useEffect(() => {



    }, [])



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
                            {name ? `Great job, ${name}!` : "Great job!"}
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
                </Card>
            </div>
        </div>
    );
}
