import Question from "./Question";

import { useQuestionStore } from "../store/useQuestionsStore";
export default function Game() {
  const questions = useQuestionStore((state) => state.questions);
  const currentQuestion = useQuestionStore((state) => state.currentQuestion);
  const questionInfo = questions[currentQuestion];
  return <Question info={questionInfo} />;
}
