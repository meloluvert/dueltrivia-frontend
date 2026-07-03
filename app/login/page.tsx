"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  function validar() {
    const e = email.trim().toLowerCase()
    if (!e.includes("@") || !e.includes(".")) {
      toast.error("Email inválido.")
      return false
    }

    if (senha.length < 6) {
      toast.error("Senha inválida (mínimo 6 caracteres).")
      return false
    }

    return true
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Entre no sistema!</h1>

      <form
        className="bg-black p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault()
          if (!validar()) return

          toast.success("Login validado com sucesso!")
          setEmail("")
          setSenha("")
        }}
      >
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

