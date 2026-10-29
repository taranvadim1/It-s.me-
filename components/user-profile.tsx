"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, MessageSquare, UserPlus, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { addFriend, removeFriend, isFriend } from "@/lib/friends-store"
import { getUserByUsername, type AppUser } from "@/lib/auth-store"

interface UserProfileProps {
  username: string
  onBack: () => void
}

export function UserProfile({ username, onBack }: UserProfileProps) {
  const router = useRouter()
  const [userData, setUserData] = useState<AppUser | null>(null)
  const [isFriendState, setIsFriendState] = useState(false)

  useEffect(() => {
    setUserData(getUserByUsername(username))
    setIsFriendState(isFriend(username))
  }, [username])

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-semibold">Пользователь не найден</h2>
        <Button onClick={onBack}>Вернуться к карте</Button>
      </div>
    )
  }

  const handleFriendClick = () => {
    if (isFriendState) removeFriend(username)
    else addFriend(username, userData.name)
    setIsFriendState(!isFriendState)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-2 font-medium">Профиль</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center mb-4 text-5xl font-bold text-white">
          {userData.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-[24px] font-medium mb-1">{userData.name}</h2>
        <p className="text-sm text-muted-foreground mb-3">@{userData.username}</p>
        <p className="text-[16px] text-muted-foreground text-center mb-6 max-w-md">{userData.description}</p>

        {userData.links.length > 0 && (
          <div className="w-full max-w-md space-y-3 mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {userData.links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border rounded-2xl w-24 h-24 p-2 transition-transform hover:scale-105 hover:bg-muted">
                  <ExternalLink className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center truncate max-w-full">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-md flex flex-col gap-3">
          <Button variant={isFriendState ? "secondary" : "default"} onClick={handleFriendClick}>
            {isFriendState ? <><UserCheck className="mr-2 h-4 w-4" />В друзьях</> : <><UserPlus className="mr-2 h-4 w-4" />Добавить в друзья</>}
          </Button>
          <Button onClick={() => router.push(`/chat/${username}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />Написать сообщение
          </Button>
        </div>
      </div>
    </div>
  )
}
