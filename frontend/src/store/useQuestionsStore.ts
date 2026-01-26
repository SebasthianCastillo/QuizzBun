import { create } from "zustand";
import type { Questions } from ".././../types";

interface questionStore {
  questions: Questions[];
  currentQuestion: number;
  name: string;
  setCurrentUser: (name: string) => void;
  clearName: () => void;
  fetchQuestions: () => Promise<void>;
}

export const useQuestionStore = create<questionStore>((set) => {
  return {
    questions: [],
    currentQuestion: 0,
    name: "",
    setCurrentUser: (name) => set({ name }),
    clearName: () => set({ name: "" }),
    fetchQuestions: async () => {
      try {
        const response = await fetch("http://localhost:5173/data.json");
        if (!response.ok) throw "error fetching data";
        const questions = await response.json();
        set({ questions });
      } catch (error) {
        console.log("error:" + error);
      }
    },
  };
});
