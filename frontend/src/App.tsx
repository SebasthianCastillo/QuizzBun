import "./App.css";
import Game from "./components/Game";
import Start from "./components/Start";
import { useQuestionStore } from "./store/useQuestionsStore";

function App() {
  const questions = useQuestionStore((state) => state.questions);
  return (
    <>
      {questions.length === 0 && <Start />}
      {questions.length > 0 && <Game />}
    </>
  );
}

export default App
