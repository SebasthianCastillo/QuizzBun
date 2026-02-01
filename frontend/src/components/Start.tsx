import { Button } from "@/components/ui/button";
import { useQuestionStore } from "../store/useQuestionsStore";
import { Input } from "@/components/ui/input"
import {useState} from "react"
export default function Start() {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const handleClick = () => {
    if (value.trim().length < 2) return;
    setCurrentUser(value.trim());
    fetchQuestions(); 
  };
  const setCurrentUser = useQuestionStore((state) => state.setCurrentUser);
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
  <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl">
    
    {/* Header */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white">
        Quiz Lolsete
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
       🚀
      </p>
    </div>

    {/* Form */}
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nombre..."
        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
      />

      <Button
        onClick={handleClick}
        className="w-full text-base font-semibold"
      >
        Iniciar Quiz
      </Button>
    </div>

 
  </div>
</div>

  );
}
