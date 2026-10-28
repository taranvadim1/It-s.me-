"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, MessageSquare, UserPlus, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { addFriend, removeFriend, isFriend } from "@/lib/friends-store"

interface UserProfileProps {
  username: string
  onBack: () => void
}

export function UserProfile({ username, onBack }: UserProfileProps) {
  const router = useRouter()
  const [isFriendState, setIsFriendState] = useState(false)

  // Проверяем, является ли пользователь другом при загрузке компонента
  useEffect(() => {
    setIsFriendState(isFriend(username))
  }, [username])

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
              : username === "tech_guru"
                ? "Технический Гуру"
                : username
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
    description:
      "Фрилансер, специализирующийся на веб-разработке и дизайне. Создаю красивые и функциональные сайты для малого и среднего бизнеса.",
    links: [
      { title: "Портфолио", url: "https://portfolio.example.com" },
      { title: "GitHub", url: "https://github.com/example" },
      { title: "LinkedIn", url: "https://linkedin.com/in/example" },
    ],
  }

  const handleMessageClick = () => {
    router.push(`/chat/${username}`)
  }

  const handleFriendClick = () => {
    if (isFriendState) {
      removeFriend(username)
    } else {
      addFriend(username, userData.name)
    }
    setIsFriendState(!isFriendState)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-2 font-medium">Профиль</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-4">
          <img
            src={`/placeholder.svg?height=200&width=200&text=${username.charAt(0).toUpperCase()}`}
            alt={userData.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="font-roboto text-[24px] text-black font-medium mb-2">{userData.name}</h2>

        <p className="font-roboto text-[16px] text-[#666666] text-center mb-6 max-w-md">{userData.description}</p>

        <div className="w-full max-w-md space-y-3 mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            {userData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center bg-[#007BFF] text-white rounded-full w-20 h-20 p-2 transition-transform hover:scale-105"
              >
                <ExternalLink className="h-5 w-5 mb-1" />
                <span className="text-xs text-center">{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md flex flex-col gap-3">
          <Button
            className={
              isFriendState ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-blue-500 hover:bg-blue-600 text-white"
            }
            onClick={handleFriendClick}
          >
            {isFriendState ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />В друзьях
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Добавить в друзья
              </>
            )}
          </Button>

          <Button className="bg-[#28A745] hover:bg-[#218838] text-white" onClick={handleMessageClick}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Написать сообщение
          </Button>
        </div>
      </div>
    </div>
  )
}

