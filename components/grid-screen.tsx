"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { getUsers } from "@/lib/auth-store"

export function GridScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [users, setUsers] = useState<string[]>([])

  useEffect(() => {
    setUsers(getUsers().map(user => user.username))
  }, [])

  const filteredUsers = users.filter(user => user.toLowerCase().includes(searchQuery.toLowerCase()))

  if (selectedUser) return <UserProfile username={selectedUser} onBack={() => setSelectedUser(null)} />

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-10" placeholder="Поиск людей..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1">
            {filteredUsers.map(username => (
              <button key={username} onClick={() => setSelectedUser(username)}
                className="h-[50px] rounded bg-primary/90 hover:bg-primary text-primary-foreground text-[10px] font-medium overflow-hidden px-1">
                {username}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
          Пока нет участников. Создайте первый профиль и станьте первым человеком на карте.
        </div>
      )}
    </div>
  )
}
