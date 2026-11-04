"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Home, MessageSquare, User, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface BottomNavigationProps {
  activeItem: "home" | "chats" | "friends" | "profile"
}

export function BottomNavigation({ activeItem }: BottomNavigationProps) {
  const supabase = useMemo(() => createClient(), [])
  const [userId, setUserId] = useState<string | null>(null)
  const [requestCount, setRequestCount] = useState(0)

  const loadRequestCount = useCallback(async (currentUserId: string) => {
    const { count, error } = await supabase
      .from("friendships")
      .select("id", { count: "exact", head: true })
      .eq("addressee_id", currentUserId)
      .eq("status", "pending")

    if (error) {
      console.error("Ошибка загрузки количества заявок:", error)
      return
    }

    setRequestCount(count ?? 0)
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (mounted) {
        setUserId(user?.id ?? null)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUserId(session?.user?.id ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (!userId) {
      setRequestCount(0)
      return
    }

    loadRequestCount(userId)

    const channel = supabase
      .channel(`friend-requests-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `addressee_id=eq.${userId}`,
        },
        () => {
          loadRequestCount(userId)
        }
      )
      .subscribe()

    const interval = window.setInterval(() => {
      loadRequestCount(userId)
    }, 15000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadRequestCount(userId)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, loadRequestCount])

  return (
    <div className="sticky bottom-0 bg-white border-t flex justify-around py-2">
      <Link
        href="/"
        className={`flex flex-col items-center p-2 ${activeItem === "home" ? "text-primary" : "text-muted-foreground"}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Главная</span>
      </Link>

      <Link
        href="/chats"
        className={`flex flex-col items-center p-2 ${activeItem === "chats" ? "text-primary" : "text-muted-foreground"}`}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs mt-1">Чаты</span>
      </Link>

      <Link
        href="/friends"
        className={`flex flex-col items-center p-2 ${activeItem === "friends" ? "text-primary" : "text-muted-foreground"}`}
      >
        <span className="relative">
          <Users className="h-6 w-6" />
          {requestCount > 0 && (
            <span
              className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
              aria-label={`${requestCount} входящих заявок в друзья`}
            >
              {requestCount > 9 ? "9+" : requestCount}
            </span>
          )}
        </span>
        <span className="text-xs mt-1">Друзья</span>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center p-2 ${activeItem === "profile" ? "text-primary" : "text-muted-foreground"}`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Профиль</span>
      </Link>
    </div>
  )
}
