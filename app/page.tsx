"use client"

import { useState } from "react"
import questions from '@/lib/questions.json'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { DialogQuiz } from "./components/ModalGame"

export default function Home() {
  const [open, setOpen] = useState(false)
  const user =1;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold ">Bem-vindo, nome!</h1>
      <p className="text-lg mb-4">Vamos testar seu conhecimento!</p>
      {user ?
        <DialogQuiz questions={questions} />
        :
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => setOpen(true)}
        >
          Começar Quiz!



        </Button>
      }


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Opa! Parece que você ainda não tem uma conta</DialogTitle>
            <DialogDescription>
              Cadastre-se para continuar!
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            {/* <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Nome</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </Field>
            </FieldGroup> */}

            <DialogFooter>
              <Link href="/cadastro"><Button type="submit" variant={'outline'}>Cadastre-se!</Button></Link>
            </DialogFooter>


          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

