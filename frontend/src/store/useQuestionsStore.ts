import { create } from "zustand";
import type { Questions } from ".././../types";

// Environment variables
const DATA_URL = import.meta.env.VITE_DATA_URL || 'http://localhost:5173';

interface questionStore {
  questions: Questions[];
  currentQuestion: number;
  name: string;
  isGameComplete: boolean;
  setCurrentUser: (name: string) => void;
  clearName: () => void;
  fetchQuestions: () => Promise<void>;
  selectedAnswer: (id: string, index: number) => void;
  goNextQuestion: () => void;
  goPreviusQuestion: () => void;
  resetGame: () => void;
}

export const useQuestionStore = create<questionStore>((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,
    name: "",
    isGameComplete: false,
    setCurrentUser: (name) => set({ name }),
    clearName: () => set({ name: "" }),
    fetchQuestions: async () => {
      try {
        const response = await fetch(`${DATA_URL}`);
        if (!response.ok) throw "error fetching data";
        const questions = await response.json();
        set({ questions });
      } catch (error) {
        console.log("error:" + error);
      }
    },
    selectedAnswer: (id: string, index: number) => {
      const { questions, currentQuestion } = get();
      // clonar objeto
      const newQuestion = structuredClone(questions);
      //encontrar index de pregunta
      const questionIndex = newQuestion.findIndex((q) => q.id == id);
      //devolver pregunta actual
      const questionInfo = newQuestion[questionIndex];
      //encontrar pregunta correcta - compare selected index with correct answer
      const isCorrectAnswer = questionInfo.correctAnswer === index;
      //cambiar info en la copia de la pregunta
      newQuestion[questionIndex] = {
        ...questionInfo,
        isCorrectAnswer,
        userSelectedAnswer: index,
      };
      set({ questions: newQuestion });

      // Check if this is the last question
      if (currentQuestion === questions.length - 1) {
        set({ isGameComplete: true });

      }
    },
    goNextQuestion: () => {
      const { questions, currentQuestion } = get();
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length)
        set({ currentQuestion: nextQuestion });
    },
    goPreviusQuestion: () => {
      const { currentQuestion } = get();
      const previusQuestion = currentQuestion - 1;
      if (previusQuestion >= 0) set({ currentQuestion: previusQuestion });
    },
    resetGame: () => {
      set({
        currentQuestion: 0,
        isGameComplete: false,
        questions: get().questions.map((q) => ({
          ...q,
          userSelectedAnswer: undefined,
          isCorrectAnswer: undefined,
        })),
      });
    },
  };
});
