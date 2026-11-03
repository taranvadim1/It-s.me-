"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  UserPlus,
  UserCheck,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  id: string
  username: string
  name: string
  description: string | null
  avatar: string | null
  links: { title: string; url: string }[] | null
}

type FriendStatus = "none" | "pending" | "accepted"

interface UserProfileProps {
  username: string
  onBack: () => void
}

export function UserProfile({ username, onBack }: UserProfileProps) {
  const router = useRouter()
  const supabase = createClient()

  const [userData, setUserData] = useState<Profile | null>(null)
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none")
  const [loading, setLoading] = useState(true)
  const [friendLoading, setFriendLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, name, description, avatar, links")
        .eq("username", username)
        .maybeSingle()

      if (profileError) {
        console.error("Ошибка загрузки профиля:", profileError)
        alert(`Ошибка загрузки профиля: ${profileError.message}`)
        setUserData(null)
        setLoading(false)
        return
      }

      if (!profile) {
        setUserData(null)
        setLoading(false)
        return
      }

      setUserData(profile as Profile)

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser || currentUser.id === profile.id) {
        setFriendStatus("none")
        setLoading(false)
        return
      }

      const { data: friendship, error: friendshipError } = await supabase
        .from("friendships")
        .select("id, requester_id, addressee_id, status")
        .or(
          `and(requester_id.eq.${currentUser.id},addressee_id.eq.${profile.id}),and(requester_id.eq.${profile.id},addressee_id.eq.${currentUser.id})`
        )
        .maybeSingle()

      if (friendshipError) {
        console.error("Ошибка загрузки связи:", friendshipError)
        setFriendStatus("none")
      } else if (friendship?.status === "accepted") {
        setFriendStatus("accepted")
      } else if (friendship?.status === "pending") {
        setFriendStatus("pending")
      } else {
        setFriendStatus("none")
      }

      setLoading(false)
    }

    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <p className="text-muted-foreground">Загружаем профиль...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-semibold">Пользователь не найден</h2>
        <Button onClick={onBack}>Вернуться к карте</Button>
      </div>
    )
  }

  const handleFriendClick = async () => {
    setFriendLoading(true)

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      alert("Для добавления в друзья необходимо войти в аккаунт.")
      setFriendLoading(false)
      return
    }

    if (currentUser.id === userData.id) {
      setFriendLoading(false)
      return
    }

    if (friendStatus === "none") {
      const { error } = await supabase.from("friendships").insert({
        requester_id: currentUser.id,
        addressee_id: userData.id,
        status: "pending",
      })

      if (error) {
        console.error("Ошибка отправки запроса:", error)
        alert(`Не удалось отправить запрос: ${error.message}`)
      } else {
        setFriendStatus("pending")
      }
    } else {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .or(
          `and(requester_id.eq.${currentUser.id},addressee_id.eq.${userData.id}),and(requester_id.eq.${userData.id},addressee_id.eq.${currentUser.id})`
        )

      if (error) {
        console.error("Ошибка удаления связи:", error)
        alert(`Не удалось удалить связь: ${error.message}`)
      } else {
        setFriendStatus("none")
      }
    }

    setFriendLoading(false)
  }

  const links = userData.links ?? []

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="ml-2 font-medium">Профиль</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center mb-4 text-5xl font-bold text-white overflow-hidden">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            userData.name.charAt(0).toUpperCase()
          )}
        </div>

        <h2 className="text-[24px] font-medium mb-1">
          {userData.name}
        </h2>

        <p className="text-sm text-muted-foreground mb-3">
          @{userData.username}
        </p>

        <p className="text-[16px] text-muted-foreground text-center mb-6 max-w-md">
          {userData.description || ""}
        </p>

        {links.length > 0 && (
          <div className="w-full max-w-md space-y-3 mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center border rounded-2xl w-24 h-24 p-2 transition-transform hover:scale-105 hover:bg-muted"
                >
                  <ExternalLink className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center truncate max-w-full">
                    {link.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-md flex flex-col gap-3">
          <Button
            variant={friendStatus === "accepted" ? "secondary" : "default"}
            onClick={handleFriendClick}
            disabled={friendLoading}
          >
            {friendStatus === "accepted" ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                В друзьях
              </>
            ) : friendStatus === "pending" ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Запрос отправлен
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Добавить в друзья
              </>
            )}
          </Button>

          <Button onClick={() => router.push(`/chat/${username}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Написать сообщение
          </Button>
        </div>
      </div>
    </div>
  )
}