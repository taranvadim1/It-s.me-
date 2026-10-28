"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserProfile } from "@/components/user-profile"

type GridScreenProps = {}

export function GridScreen({}: GridScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [users, setUsers] = useState<string[]>([])
  const [colors, setColors] = useState<Record<string, string>>({})

  // Генерация большого количества пользователей для демонстрации
  useEffect(() => {
    const generateUsers = () => {
      const prefixes = [
        "user",
        "dev",
        "design",
        "art",
        "tech",
        "web",
        "photo",
        "music",
        "travel",
        "food",
        "game",
        "code",
      ]
      const suffixes = ["pro", "master", "guru", "ninja", "lover", "fan", "star", "expert", "geek", "buff", "addict"]
      const numbers = ["", "1", "2", "3", "42", "007", "99", "123", "2023"]

      const generatedUsers: string[] = []

      for (let i = 0; i < 200; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        const number = numbers[Math.floor(Math.random() * numbers.length)]
        const username = `${prefix}_${suffix}${number}`

        if (!generatedUsers.includes(username)) {
          generatedUsers.push(username)
        }
      }

      return generatedUsers
    }

    const generatedUsers = generateUsers()
    setUsers(generatedUsers)

    // Генерация цветов
    const colorOptions = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-emerald-500",
      "bg-sky-500",
      "bg-violet-500",
      "bg-fuchsia-500",
      "bg-rose-500",
    ]

    const newColors: Record<string, string> = {}
    generatedUsers.forEach((user) => {
      const colorIndex = user.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorOptions.length
      newColors[user] = colorOptions[colorIndex]
    })

    setColors(newColors)
  }, [])

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = searchQuery
    ? users.filter((user) => user.toLowerCase().includes(searchQuery.toLowerCase()))
    : users

  return (
    <div className="flex-1 flex flex-col">
      {selectedUser ? (
        <UserProfile username={selectedUser} onBack={() => setSelectedUser(null)} />
      ) : (
        <>
          <div className="p-4 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-10"
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-[1px] auto-rows-[20px]">
                {filteredUsers.map((username) => {
                  // Определение размера ячейки на основе длины имени пользователя
                  const length = username.length
                  const colSpan = length <= 6 ? 1 : length <= 10 ? 2 : 3
                  const rowSpan = length <= 8 ? 1 : 2

                  return (
                    <button
                      key={username}
                      onClick={() => setSelectedUser(username)}
                      className={`col-span-${colSpan} row-span-${rowSpan} ${colors[username]} hover:opacity-90 transition-opacity flex items-center justify-center text-[10px] text-white font-medium overflow-hidden`}
                      style={{
                        gridColumn: `span ${colSpan} / span ${colSpan}`,
                        gridRow: `span ${rowSpan} / span ${rowSpan}`,
                      }}
                    >
                      {username}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">Пользователи не найдены</div>
          )}
        </>
      )}
    </div>
  )
}

