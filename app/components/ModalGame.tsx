import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DialogQuiz({ questions, open, onOpenChange }: Props) {
    const [atual, setAtual] = useState(0)
    const [respostas, setRespostas] = useState<Record<number, { resposta: string; marcada: boolean }>>({})

    // Resetar estados quando o Dialog abrir
    useEffect(() => {
        if (open) {
            setAtual(0)
            setRespostas({})
        }
    }, [open])

    const perguntasAleatorias = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions, open])

    const mapaOpcoes = useMemo(() => {
        return perguntasAleatorias.map((q) =>
            [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5)
        )
    }, [perguntasAleatorias])

    const questao = perguntasAleatorias[atual]
    const opcoes = mapaOpcoes[atual]

    function handleSelecionar(opcao: string) {
        setRespostas((anteriores) => ({
            ...anteriores,
            [atual]: { resposta: opcao, marcada: false },
        }))
    }

    function handleMarcar() {
        if (!respostas[atual]) return
        setRespostas((anteriores) => ({
            ...anteriores,
            [atual]: { ...anteriores[atual], marcada: true },
        }))
    }

    function proximo() { if (atual < perguntasAleatorias.length - 1) setAtual(atual + 1) }
    function anterior() { if (atual > 0) setAtual(atual - 1) }

    function decode(text: string) {
        const textarea = document.createElement("textarea")
        textarea.innerHTML = text
        return textarea.value
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black text-white">
                <DialogHeader>
                    <DialogTitle>Pergunta {atual + 1} de {perguntasAleatorias.length}</DialogTitle>
                </DialogHeader>

                <p>{`${decode(questao.category)} | ${decode(questao.difficulty)}`}</p>
                <h2 className="my-6 text-lg">{decode(questao.question)}</h2>

                <div className="space-y-2">
                    {opcoes.map((opcao) => {
                        const respostaAtual = respostas[atual]
                        const estaSelecionada = respostaAtual?.resposta === opcao
                        const estaMarcada = respostaAtual?.marcada
                        const estaCorreta = opcao === questao.correct_answer

                        let classeBorda = "border-gray-500"
                        if (estaMarcada) {
                            if (estaCorreta) classeBorda = "border-green-500 bg-green-900/20"
                            else if (estaSelecionada) classeBorda = "border-red-500 bg-red-900/20"
                        } else if (estaSelecionada) {
                            classeBorda = "border-yellow-500"
                        }

                        return (
                            <Button
                                key={opcao}
                                disabled={estaMarcada}
                                className={`w-full justify-start border-2 bg-black text-white hover:border-white hover:bg-black ${classeBorda}`}
                                onClick={() => handleSelecionar(opcao)}
                            >
                                {decode(opcao)}
                            </Button>
                        )
                    })}
                </div>

                <DialogFooter className="mt-6 flex justify-between">
                    {/* <DialogClose>Cancelar</DialogClose> */}
                    <div className="flex gap-2">
                        <Button ><DialogClose>Cancelar</DialogClose></Button>
                        <Button onClick={anterior} disabled={atual === 0}>Anterior</Button>
                        {atual < perguntasAleatorias.length - 1 ? (
                            <Button onClick={proximo}>Próximo</Button>
                        ) : (
                            <Button onClick={() => console.log(respostas)}>Enviar</Button>
                        )}
                        <Button onClick={handleMarcar} disabled={!respostas[atual] || respostas[atual].marcada}>
                            Marcar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}