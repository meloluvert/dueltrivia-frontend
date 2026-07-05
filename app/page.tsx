"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getQuestions, Question } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { DialogQuiz } from "./components/ModalGame"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [openQuiz, setOpenQuiz] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)

  const { user } = useAuth()

  async function handleStartQuiz() {
    try {
      setLoading(true)

      const data = await getQuestions()

      setQuestions(data)
      setOpenQuiz(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-white">
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
                Vou criar uma!
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}