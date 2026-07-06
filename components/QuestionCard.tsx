"use client";

import { useState } from "react";
import type { IQuestion } from "@/types/question";
import { updateQuestion } from "@/lib/api";
import { toast } from "sonner"
import { createQuestion, deleteQuestion } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type QuestionCardProps = {
  question: IQuestion;
  onDelete: (question: IQuestion) => void;
  onCreated: (oldQuestion: IQuestion, newQuestion: IQuestion) => void;
};
export default function QuestionCard({ question, onDelete, onCreated }: QuestionCardProps) {
  const [form, setForm] = useState<IQuestion>({
    ...question,
    statement: question.statement ?? "",
    incorrect_answers: [...question.incorrect_answers],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDelete, setOpenDelete] = useState(false);

  function validar() {
    const newErrors: Record<string, string> = {};

    if (!form.statement?.trim())
      newErrors.statement = "Informe a pergunta.";

    if (!form.category.trim())
      newErrors.category = "Informe a categoria.";

    if (!form.difficulty.trim())
      newErrors.difficulty = "Informe a dificuldade.";

    if (!form.correct_answer.trim())
      newErrors.correct_answer = "Informe a resposta correta.";

    const incorrect = form.incorrect_answers.filter((a) => a.trim());

    if (incorrect.length < 1)
      newErrors.incorrect_answers =
        "A pergunta precisa de pelo menos uma resposta incorreta.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function atualizarIncorreto(index: number, value: string) {
    const answers = [...form.incorrect_answers];
    answers[index] = value;

    setForm({
      ...form,
      incorrect_answers: answers,
    });
  }

  function adicionarIncorreto() {
    if (form.incorrect_answers.length >= 3) return;

    setForm({
      ...form,
      incorrect_answers: [...form.incorrect_answers, ""],
    });
  }

  function removeIncorrect(index: number) {
    if (form.incorrect_answers.length === 1) return;

    const updatedAnswers = form.incorrect_answers.filter((valor, i) => i !== index);

    setForm({
      ...form,
      incorrect_answers: updatedAnswers,
    });
  }
  async function handleSave() {
    if (!validar()) return;

    setLoading(true);

    try {
      if (form.id) {
        await updateQuestion(form.id, form);

        toast.success("Pergunta atualizada!");
      } else {
        const { question } = await createQuestion(form);

        setForm(question);

        onCreated(form, question);

        toast.success("Pergunta criada!");
      }
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete() {
    try {
      setLoading(true);

      if (form.id) {
        await deleteQuestion(form.id);
      }

      onDelete(question); //objeto original para excluir no vetor

      toast.success("Pergunta removida.");
    } catch {
      toast.error("Erro ao excluir.");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  }

  return (
    <Card className=" pt-0 max-w-md">
      <CardHeader className="bg-blue-500">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="bg-blue-500 border-0 my-3  flex-1 border-b-2 border-white">
            <input
              value={form.statement}
              onChange={(e) =>
                setForm({
                  ...form,
                  statement: e.target.value,
                })
              }
              placeholder="Pergunta"
              className="w-full outline-none"
            />

          </CardTitle>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setOpenDelete(true)}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        </div>

        {errors.statement && (
          <p className="text-sm text-red-500">{errors.statement}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Categoria</Label>

          <Input
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          />

          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <Label>Dificuldade</Label>

          <Input
            value={form.difficulty}
            onChange={(e) =>
              setForm({
                ...form,
                difficulty: e.target.value,
              })
            }
          />

          {errors.difficulty && (
            <p className="text-sm text-red-500">{errors.difficulty}</p>
          )}
        </div>

        <div>
          <Label>Resposta correta</Label>

          <Input
            value={form.correct_answer}
            onChange={(e) =>
              setForm({
                ...form,
                correct_answer: e.target.value,
              })
            }
            className="border-green-600"
          />

          {errors.correct_answer && (
            <p className="text-sm text-red-500">
              {errors.correct_answer}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Respostas incorretas</Label>

          {form.incorrect_answers.map((answer, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={answer}
                onChange={(e) =>
                  atualizarIncorreto(index, e.target.value)
                }
                placeholder={`Resposta incorreta ${index + 1}`}
              />

              <Button
                size="icon"
                className={'bg-red-700'}
                onClick={() => removeIncorrect(index)}
                disabled={form.incorrect_answers.length === 1}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          ))}

          {form.incorrect_answers.length < 3 && (
            <Button
              variant="outline"
              type="button"
              onClick={adicionarIncorreto}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar resposta incorreta
            </Button>
          )}

          {errors.incorrect_answers && (
            <p className="text-sm text-red-500">
              {errors.incorrect_answers}
            </p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>

        </div>
      </CardContent>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir pergunta?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A pergunta será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}