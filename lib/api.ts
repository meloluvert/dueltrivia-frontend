import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
import type { IQuestion, IQuestionsResponse } from "@/types/question";
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@token-trivia");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function getTriviaQuestions(): Promise<IQuestion[]> {
  const { data } = await api.get<IQuestionsResponse>("/trivia");
  return data.questions;
}

export async function getUsersQuestions(): Promise<IQuestion[]> {
  const { data } = await api.get<IQuestionsResponse>("/questions");
  return data.questions;
}

export async function createQuestion(question: IQuestion): Promise<{ question: IQuestion }> {
  const { data } = await api.post<{ question: IQuestion }>("/questions", question);
  return data;
}

export async function updateQuestion(id: number, question: IQuestion): Promise<{ question: IQuestion }> {
  console.log(id, question)
  const { data } = await api.put<{ question: IQuestion }>("/questions/" + id, question);
  return data;
}

export async function deleteQuestion(id: number): Promise<{ question: IQuestion }> {
  const { data } = await api.delete<{ question: IQuestion }>("/questions/" + id);
  return data;
}




