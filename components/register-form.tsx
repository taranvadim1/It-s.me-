"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/auth-store"

export function RegisterForm() {
  const router = useRouter()
  const [email,setEmail]=useState(""); const [username,setUsername]=useState(""); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [error,setError]=useState("")
  const submit=(e:React.FormEvent)=>{e.preventDefault();setError("");if(password!==confirm){setError("Пароли не совпадают");return}if(password.length<6){setError("Пароль должен содержать минимум 6 символов");return}if(!/^[a-zA-Z0-9_]+$/.test(username)){setError("Никнейм: только латинские буквы, цифры и _");return}const r=registerUser({email,username,name:username,description:"Мой профиль на it’s.me",links:[],createdAt:new Date().toISOString()},password);if(!r.ok){setError(r.error||"Не удалось зарегистрироваться");return}router.push("/profile")}
  return <div className="w-full max-w-md space-y-6"><div className="text-center"><h1 className="text-3xl font-bold">it’s.me</h1><p className="text-muted-foreground mt-2">Создайте свою цифровую визитку</p></div><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="space-y-2"><Label>Никнейм</Label><Input value={username} onChange={e=>setUsername(e.target.value)} required /><p className="text-xs text-muted-foreground">Это ваш уникальный адрес в Карте человечества</p></div><div className="space-y-2"><Label>Пароль</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div><div className="space-y-2"><Label>Повторите пароль</Label><Input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required /></div>{error&&<p className="text-sm text-red-500">{error}</p>}<Button type="submit" className="w-full">Создать профиль</Button></form><p className="text-center text-sm text-muted-foreground">Уже есть аккаунт? <Link href="/auth/login" className="text-primary hover:underline">Войти</Link></p></div>
}
