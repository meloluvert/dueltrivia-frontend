import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { IQuestion } from "@/types/question"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type DialogQuizProps = {
    questions: IQuestion[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DialogQuiz({ questions, open, onOpenChange }: DialogQuizProps) {
    const [atual, setAtual] = useState(0)
    const [respostas, setRespostas] = useState<Record<number, { resposta: string; marcada: boolean }>>({})
    const [scoreText, setScoreText] = useState<string | null>(null)
    const [enviado, setEnviado] = useState(false)
    useEffect(() => {
        if (open) {
            setAtual(0)
            setRespostas({})
            setEnviado(false)
            setScoreText(null)
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

    function proximo() {
        if (atual < perguntasAleatorias.length - 1)
            setAtual(atual + 1); setScoreText(null)
    }
    function anterior() {
        if (atual > 0) setAtual(atual - 1);
        setScoreText(null)
    }

    function decode(text: string) {
        const textarea = document.createElement("textarea")
        textarea.innerHTML = text
        return textarea.value
    }
    function handleEnviar() {
        let acertos = 0;
        setEnviado(true)
        perguntasAleatorias.forEach((pergunta, index) => {
            if (respostas[index]?.resposta === pergunta.correct_answer) {
                acertos++;
            }
        });

        const porcentagem = Math.round((acertos / perguntasAleatorias.length) * 100);

        setScoreText(`Você acertou ${acertos} de ${perguntasAleatorias.length} perguntas (${porcentagem}%).`);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black text-white">
                <DialogHeader>
                    <DialogTitle>Pergunta {atual + 1} de {perguntasAleatorias.length}</DialogTitle>
                </DialogHeader>
                {scoreText ? (
                    <div className="mt-4">
                        <p>{scoreText}</p>
                    </div>
                ) : (
                    <>
                        <p>{`${decode(questao.category)} | ${decode(questao.difficulty)}`}</p>
                        <h2 className="my-6 text-lg">{decode(questao.question || questao.statement || "")}</h2>

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
                    </>)}

                <DialogFooter className="mt-6 flex justify-between">
                    <div className="flex gap-2">
                        <DialogClose>Cancelar</DialogClose>

                        {!enviado && (
                            <>
                                <Button onClick={anterior} disabled={atual === 0}>
                                    Anterior
                                </Button>

                                {atual < perguntasAleatorias.length - 1 ? (
                                    <Button onClick={proximo}>Próximo</Button>
                                ) : (
                                    <Button onClick={handleEnviar}>Enviar</Button>
                                )}

                                <Button
                                    onClick={handleMarcar}
                                    disabled={!respostas[atual] || respostas[atual].marcada}
                                >
                                    Marcar
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}