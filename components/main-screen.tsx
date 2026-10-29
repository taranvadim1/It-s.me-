"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UsernameGrid } from "@/components/username-grid"
import { getUsers, type AppUser } from "@/lib/auth-store"

export function MainScreen({ onSelectUser }: { onSelectUser:(username:string)=>void }) {
  const [query,setQuery]=useState(""); const [users,setUsers]=useState<AppUser[]>([])
  useEffect(()=>setUsers(getUsers()),[])
  const filtered=users.filter(u=>u.username.toLowerCase().includes(query.toLowerCase())||u.name.toLowerCase().includes(query.toLowerCase()))
  return <div className="flex-1 flex flex-col"><div className="p-4 sticky top-0 bg-white z-10"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9 h-10" placeholder="Поиск людей..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div>{filtered.length?<UsernameGrid users={filtered.map(u=>u.username)} onSelectUser={onSelectUser}/>:<div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">Пока нет участников. Создайте первый профиль и станьте первым человеком на карте.</div>}</div>
}
