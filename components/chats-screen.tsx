"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("")

  // Имитация списка чатов
  const chats = [
    { id: "1", username: "john_doe", name: "Джон Доу", lastMessage: "Привет, как дела?", time: "10:30", unread: 2 },
    {
      id: "2",
      username: "jane_smith",
      name: "Джейн Смит",
      lastMessage: "Спасибо за информацию!",
      time: "Вчера",
      unread: 0,
    },
    {
      id: "3",
      username: "alex_dev",
      name: "Алекс Разработчик",
      lastMessage: "Когда будет готов проект?",
      time: "Пн",
      unread: 1,
    },
    {
      id: "4",
      username: "maria_design",
      name: "Мария Дизайнер",
      lastMessage: "Отправила макеты на почту",
      time: "25 фев",
      unread: 0,
    },
  ]

  const filteredChats = searchQuery
    ? chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold mb-4">Сообщения</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10"
            placeholder="Поиск в сообщениях..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1">
        {filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat) => (
              <Link href={`/chat/${chat.username}`} key={chat.id}>
                <div className="flex items-center p-4 hover:bg-secondary transition-colors">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=48&width=48&text=${chat.username.charAt(0).toUpperCase()}`}
                        alt={chat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{chat.name}</span>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">Сообщения не найдены</div>
        )}
      </div>
    </div>
  )
}

