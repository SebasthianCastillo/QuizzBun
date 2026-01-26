import { Button } from "@/components/ui/button";
import { useQuestionStore } from "../store/useQuestionsStore";
import { Input } from "@/components/ui/input"
import {useState} from "react"
export default function Start() {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const handleClick = () => {
    // if (value.trim().length < 2) return;
    setCurrentUser(value.trim());
    fetchQuestions(); 
  };
  const setCurrentUser = useQuestionStore((state) => state.setCurrentUser);
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
  
     <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter name"
        />
      <Button variant="outline" onClick={handleClick}>
        Button
      </Button>
    </div>
  );
}
