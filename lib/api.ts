import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@token-trivia");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export type Question = {
  id?:number
statement?: string;

  question?: string;
  difficulty: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type QuestionsResponse = {
  questions: Question[];
};

export async function getTriviaQuestions(): Promise<Question[]> {
  const { data } = await api.get<QuestionsResponse>("/trivia");
  return data.questions;
}

export async function getUsersQuestions(): Promise<Question[]> {
  const { data } = await api.get<QuestionsResponse>("/questions");
  return data.questions;
}

export async function createQuestion(question:Question): Promise<{question:Question}> {
  const { data } = await api.post<{question:Question}>("/questions", question);
  return data;
}

export async function updateQuestion(id:number,question:Question): Promise<{question:Question}> {
  console.log(id, question)
  const { data } = await api.put<{question:Question}>("/questions/" + id, question);
  return data;
}
export async function deleteQuestion(id:number): Promise<{question:Question}> {
  const { data } = await api.delete<{question:Question}>("/questions/" + id);
  return data;
}




