import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";
import type { Questions } from "../../types";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "../store/useQuestionsStore";
export default function Question({ info }: { info: Questions }) {
  const selectedAnswer = useQuestionStore((state) => state.selectedAnswer)
  const handleOptionClick = (id: string, index: number) => {

    selectedAnswer(id, index)

  };
  const getColorAnswer = (info: Questions, index: number) => {

    const { userSelectedAnswer, correctAnswer } = info
    console.log(userSelectedAnswer)
    if (userSelectedAnswer == undefined) return "bg-transparent"
    if (index !== correctAnswer && userSelectedAnswer !== index) return "bg-transparent"
    if (index == correctAnswer) return "bg-green-500"
    if (index == userSelectedAnswer) return "bg-red-500"

    return "bg-transparent"
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-pretty leading-relaxed">
          {info.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {info.options.map((option, index) => (
          <Button
            disabled={info.userSelectedAnswer !== undefined}
            key={index}
            onClick={() => handleOptionClick(info.id, index)}
            variant="outline"
            className={cn(`w-full justify-start text-left h-auto py-3 px-4 `, getColorAnswer(info, index))}

          >
            <span className="font-medium mr-3">
              {String.fromCharCode(65 + index)}.
            </span>

            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
