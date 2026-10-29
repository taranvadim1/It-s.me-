"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth-store"

export function LoginForm(){const router=useRouter();const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[error,setError]=useState("");const submit=(e:React.FormEvent)=>{e.preventDefault();const r=loginUser(email,password);if(!r.ok){setError(r.error||"Ошибка входа");return}router.push("/profile")};return <div className="w-full max-w-md space-y-6"><div className="text-center"><h1 className="text-3xl font-bold">it’s.me</h1><p className="text-muted-foreground mt-2">Войдите в свою цифровую визитку</p></div><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div><div className="space-y-2"><Label>Пароль</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>{error&&<p className="text-sm text-red-500">{error}</p>}<Button type="submit" className="w-full">Войти</Button></form><p className="text-center text-sm text-muted-foreground">Нет аккаунта? <Link href="/auth/register" className="text-primary hover:underline">Создать профиль</Link></p></div>}
