"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UsernameGrid } from "@/components/username-grid"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  username: string
  name: string
}

export function MainScreen({
  onSelectUser,
}: {
  onSelectUser: (username: string) => void
}) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("profiles")
        .select("username, name")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Ошибка загрузки профилей:", error)
        alert(`Ошибка загрузки профилей: ${error.message}`)
        setUsers([])
      } else {
        setUsers((data as Profile[] | null) ?? [])
      }

      setLoading(false)
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9 h-10"
            placeholder="Поиск людей..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
          Загружаем участников...
        </div>
      ) : filteredUsers.length > 0 ? (
        <UsernameGrid
          users={filteredUsers.map((user) => user.username)}
          onSelectUser={onSelectUser}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
          Пока нет участников. Создайте первый профиль и станьте первым человеком на карте.
        </div>
      )}
    </div>
  )
}