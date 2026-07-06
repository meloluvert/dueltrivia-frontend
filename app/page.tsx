"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getTriviaQuestions, getUsersQuestions, createQuestion } from "@/lib/api"
import type { IQuestion } from "@/types/question"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { DialogQuiz } from "../components/DialogQuiz"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"
import QuestionCard from "@/components/QuestionCard"
import { deleteQuestion } from "@/lib/api"

export default function Home() {
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [openQuiz, setOpenQuiz] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const [userQuestions, setUserQuestions] = useState<IQuestion[]>([])

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getUsersQuestions()
        .then((data) => setUserQuestions(data))
        .catch((error) => console.error(error))
    }
  }, [user])

  async function handleStartQuiz() {
    try {
      setLoading(true)

      const data = await getTriviaQuestions();
      const userQuestions = await getUsersQuestions();

      if (userQuestions.length > 0) {
        const randomQuestion =
          userQuestions[Math.floor(Math.random() * userQuestions.length)];
        data.pop()
        data.push(randomQuestion);
        data.sort(() => Math.random() - 0.5);
      }

      setQuestions(data);
      setOpenQuiz(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  function handleCreateQuestion() {
    setUserQuestions((prev) => [
      ...prev,
      {
        statement: "",
        category: "",
        difficulty: "",
        correct_answer: "",
        incorrect_answers: [""],
      },
    ]);
  }

  return (
    <div className="flex flex-col items-center justify-center text-white ">
      <div className="flex flex-col items-center justify-center pt-9">
        <h1 className="text-5xl font-bold">
          Bem-vindo{user ? `, ${user.name}` : ""}!
        </h1>

        <p className="mb-4 text-3xl">
          Vamos testar seu conhecimento!
        </p>

        {user ? (
          <>
            <Button onClick={handleStartQuiz} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Buscando questões..." : "Buscar Quiz"}
            </Button>

            {questions.length > 0 && (
              <DialogQuiz
                questions={questions}
                open={openQuiz}
                onOpenChange={setOpenQuiz}
              />
            )}
          </>
        ) : (
          <Button onClick={() => setOpenRegister(true)}>
            Buscar Quiz
          </Button>
        )}

        <Dialog open={openRegister} onOpenChange={setOpenRegister}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                Opa! Parece que você não está logado.
              </DialogTitle>

              <DialogDescription>
                Cadastre-se para continuar!
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full" variant="outline">
                  Já tenho conta!
                </Button>
              </Link>
              <Link href="/cadastro" className="w-full">
                <Button className="w-full" variant="outline">
                  Vou criar uma conta!
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
      {user && (
        <div className="flex flex-col items-center justify-center gap-3 mt-2">
          <p className="mb-1">Mude as perguntas públicas!</p>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {userQuestions.map((question, index) => (
              <QuestionCard
                key={question.id ?? `new-${index}`}
                question={question}
                onDelete={(question) => {
                  console.log("Deleting question:", question);
                  setUserQuestions((prev) =>
                    prev.filter((q) => q !== question)
                  );
                }}
                onCreated={(oldQuestion, newQuestion) => {
                  setUserQuestions((prev) =>
                    prev.map((q) => (q === oldQuestion ? newQuestion : q))
                  );
                }}
              />
            ))}
            <Button
              className="h-4 w-4 p-7 flex flex-col bg-white items-center justify-center gap-2"
              onClick={handleCreateQuestion}
            >
              <span className="text-4xl text-">+</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}