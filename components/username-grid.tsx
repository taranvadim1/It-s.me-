"use client"

import { useState, useEffect } from "react"

interface UsernameGridProps {
  users: string[]
  onSelectUser: (username: string) => void
}

export function UsernameGrid({ users, onSelectUser }: UsernameGridProps) {
  const [colors, setColors] = useState<Record<string, string>>({})

  // Генерация случайных цветов для каждого пользователя
  useEffect(() => {
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
    users.forEach((user) => {
      // Используем хеш от имени пользователя для выбора цвета, чтобы он был постоянным
      const colorIndex = user.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorOptions.length
      newColors[user] = colorOptions[colorIndex]
    })

    setColors(newColors)
  }, [users])

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-1">
        {users.map((username) => (
          <button
            key={username}
            onClick={() => onSelectUser(username)}
            className={`${colors[username] || "bg-primary"} hover:opacity-90 transition-opacity rounded flex items-center justify-center w-[50px] h-[50px] overflow-hidden`}
          >
            <span className="text-[10px] text-white font-medium px-1 text-center truncate">{username}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

