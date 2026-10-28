"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatScreenProps {
  username: string
}

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: Date
}

export function ChatScreen({ username }: ChatScreenProps) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Имитация данных пользователя
  const userData = {
    name:
      username === "john_doe"
        ? "Джон Доу"
        : username === "jane_smith"
          ? "Джейн Смит"
          : username === "alex_dev"
            ? "Алекс Разработчик"
            : username === "maria_design"
              ? "Мария Дизайнер"
              : username
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
  }

  // Имитация загрузки истории сообщений
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        text: `Привет! Я ${userData.name}. Чем могу помочь?`,
        sender: "other",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        text: "Здравствуйте! Хотел узнать о ваших услугах.",
        sender: "user",
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: "3",
        text: "Конечно! Я специализируюсь на веб-разработке и дизайне. Какой проект вас интересует?",
        sender: "other",
        timestamp: new Date(Date.now() - 3400000),
      },
    ]

    setMessages(initialMessages)
  }, [username, userData.name])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // Ограничение на 1000 символов
    if (newMessage.length > 1000) {
      alert("Сообщение не может быть длиннее 1000 символов")
      return
    }

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Имитация ответа от собеседника
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Спасибо за сообщение! Я отвечу вам в ближайшее время.",
        sender: "other",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, replyMsg])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center ml-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={`/placeholder.svg?height=32&width=32&text=${username.charAt(0).toUpperCase()}`}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-2 font-medium">{userData.name}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user" ? "bg-[#F5F5F5] text-black ml-auto" : "bg-white border text-black"
              }`}
            >
              <p className="break-words">{message.text}</p>
              <div className="text-xs text-muted-foreground text-right mt-1">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex items-center">
          <Input
            className="flex-1 h-10"
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            maxLength={1000}
          />
          <Button className="ml-2 h-10 w-10 p-0" onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

