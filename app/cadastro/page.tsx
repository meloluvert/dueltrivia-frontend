"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function Cadastro() {
  const { signUp } = useAuth()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [senhaConfirm, setSenhaConfirm] = useState("")

  const isEmailValid = useMemo(() => {
    const e = email.trim().toLowerCase()
    return e.includes("@") && e.includes(".")
  }, [email])

  function validar() {
    const n = nome.trim()
    if (n.length < 3) {
      toast.error("Nome inválido (mínimo 3 caracteres).")
      return false
    }

    if (!isEmailValid) {
      toast.error("Email inválido.")
      return false
    }

    if (senha.length < 4) {
      toast.error("Senha inválida (mínimo 6 caracteres).")
      return false
    }

    if (senha !== senhaConfirm) {
      toast.error("As senhas não conferem.")
      return false
    }

    return true
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">cadastre-se!</h1>

      <form
        className="bg-black p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault()
          if (!validar()) return
          signUp({ name: nome, email, password: senha })

          toast.success("Cadastro validado com sucesso!")
          setNome("")
          setEmail("")
          setSenha("")
          setSenhaConfirm("")
        }}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-lg text-white font-bold mb-2">
            Nome de usuário
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 border rounded"
            placeholder="Digite seu nome de usuário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-lg text-white font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-lg text-white font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block text-lg text-white font-bold mb-2">
            Confirmar senha
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="w-full px-3 py-2 border rounded"
            placeholder="Digite novamente sua senha"
            value={senhaConfirm}
            onChange={(e) => setSenhaConfirm(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}

