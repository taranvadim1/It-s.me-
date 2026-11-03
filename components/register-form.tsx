"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function RegisterForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim().toLowerCase()

    if (password !== confirm) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      setError("Никнейм может содержать только латинские буквы, цифры и _")
      return
    }

    if (normalizedUsername.length < 3) {
      setError("Никнейм должен содержать минимум 3 символа")
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalizedUsername)
      .maybeSingle()

    if (profileCheckError) {
      setLoading(false)
      setError("Не удалось проверить доступность никнейма")
      return
    }

    if (existingProfile) {
      setLoading(false)
      setError("Этот никнейм уже занят")
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          username: normalizedUsername,
          name: normalizedUsername,
          description: "Мой профиль на it's.me",
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      if (
        signUpError.message.toLowerCase().includes("username") ||
        signUpError.message.toLowerCase().includes("duplicate")
      ) {
        setError("Этот никнейм уже занят")
      } else {
        setError(signUpError.message)
      }
      return
    }

    router.push("/profile")
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">it's.me</h1>
        <p className="text-muted-foreground mt-2">
          Создайте свою цифровую визитку
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Никнейм</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Это ваш уникальный адрес в Карте человечества
          </p>
        </div>

        <div className="space-y-2">
          <Label>Пароль</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Повторите пароль</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Создание..." : "Создать профиль"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:underline"
        >
          Войти
        </Link>
      </p>
    </div>
  )
}