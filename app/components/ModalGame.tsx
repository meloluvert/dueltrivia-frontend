import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export type Question = {
    type: string
    difficulty: string
    category: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

type Props = {
    questions: Question[]
}

export function DialogQuiz({ questions }: Props) {
    const [current, setCurrent] = useState(0)
    const [respostas, setAnswers] = useState<Record<number, { resposta: string; marcada: boolean }>>({})

    const shuffledQuestions = useMemo(() => {
        return [...questions].sort(() => Math.random() - 0.5)
    }, [questions])

    const question = shuffledQuestions[current]

    const options = useMemo(() => {
        return [
            question.correct_answer,
            ...question.incorrect_answers,
        ].sort(() => Math.random() - 0.5)
    }, [question])

    function handleAnswer(answer: string) {
        setAnswers((prev) => ({
            ...prev,
            [current]: { resposta: answer, marcada: false },
        }))
    }

    function proximo() {
        if (current < shuffledQuestions.length - 1) {
            setCurrent(current + 1)
        }
    }

    function anterior() {
        if (current > 0) {
            setCurrent(current - 1)
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log(respostas)
    }
    function handleMarcar() {
        if (!respostas[current]) return

        setAnswers((prev) => ({
            ...prev,
            [current]: {
                ...prev[current],
                marcada: true,
            },
        }))
    }



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'}>Iniciar Quiz</Button>
            </DialogTrigger>

            <DialogContent className={'bg-black'}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            Pergunta {current + 1} de {shuffledQuestions.length}
                        </DialogTitle>
                    </DialogHeader>

                    <h2 className="my-6 text-lg">{question.question}</h2>

                    <div className="space-y-2">
                        {options.map((option) => {
                            const marcada = respostas[current]?.marcada
                            const resposta = respostas[current]?.resposta

                            let cor = "border-gray-300"

                            if (!marcada && resposta === option) {
                                cor = "border-yellow-500"
                            }

                            if (marcada) {
                                if (option === question.correct_answer) {
                                    cor = "border-green-500"
                                } else if (resposta === option) {
                                    cor = "border-red-500"
                                }
                            }

                            return (

                                <Button
                                    key={option}
                                    type="button"
                                    variant={
                                        respostas[current]?.resposta === option ? "default" : "outline"
                                    }
                                    disabled={respostas[current]?.marcada}
                                    className={`w-full justify-start border-2 ${cor}`}

                                    onClick={() => handleAnswer(option)}
                                >
                                    {option}
                                </Button>
                            )
                        })}
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="ghost">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={anterior}
                            disabled={current === 0}
                        >
                            Anterior
                        </Button>

                        {current < shuffledQuestions.length - 1 ? (
                            <Button
                                type="button"
                                onClick={proximo}
                            >
                                Próximo
                            </Button>
                        ) : (
                            <Button type="submit">
                                Enviar
                            </Button>
                        )}

                        <Button
                            onClick={handleMarcar}>
                            Marcar
                        </Button>


                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}