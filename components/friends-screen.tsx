"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Profile {
  id: string
  username: string
  name: string
  avatar: string | null
}

interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: "pending" | "accepted"
  created_at: string
}

interface FriendItem {
  friendshipId: string
  userId: string
  username: string
  name: string
  avatar: string | null
}

interface FriendRequest extends FriendItem {
  createdAt: string
}

export function FriendsScreen() {
  const router = useRouter()
  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)

  const [friendToRemove, setFriendToRemove] = useState<FriendItem | null>(null)
  const [removingFriend, setRemovingFriend] = useState(false)

  const loadFriendsData = async () => {
    setLoading(true)

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      setFriends([])
      setFriendRequests([])
      setLoading(false)
      return
    }

    const { data: friendships, error: friendshipsError } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status, created_at")
      .or(
        `requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`
      )
      .order("created_at", { ascending: false })

    if (friendshipsError) {
      console.error("Ошибка загрузки друзей:", friendshipsError)
      alert(`Ошибка загрузки друзей: ${friendshipsError.message}`)
      setFriends([])
      setFriendRequests([])
      setLoading(false)
      return
    }

    const friendshipRows = (friendships ?? []) as Friendship[]

    const userIds = Array.from(
      new Set(
        friendshipRows.flatMap((friendship) => [
          friendship.requester_id,
          friendship.addressee_id,
        ])
      )
    ).filter((id) => id !== currentUser.id)

    if (userIds.length === 0) {
      setFriends([])
      setFriendRequests([])
      setLoading(false)
      return
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, name, avatar")
      .in("id", userIds)

    if (profilesError) {
      console.error("Ошибка загрузки профилей друзей:", profilesError)
      alert(`Ошибка загрузки профилей друзей: ${profilesError.message}`)
      setFriends([])
      setFriendRequests([])
      setLoading(false)
      return
    }

    const profileMap = new Map(
      ((profiles ?? []) as Profile[]).map((profile) => [
        profile.id,
        profile,
      ])
    )

    const acceptedFriends: FriendItem[] = []
    const incomingRequests: FriendRequest[] = []

    for (const friendship of friendshipRows) {
      const otherUserId =
        friendship.requester_id === currentUser.id
          ? friendship.addressee_id
          : friendship.requester_id

      const profile = profileMap.get(otherUserId)

      if (!profile) {
        continue
      }

      if (friendship.status === "accepted") {
        acceptedFriends.push({
          friendshipId: friendship.id,
          userId: profile.id,
          username: profile.username,
          name: profile.name,
          avatar: profile.avatar,
        })
      }

      if (
        friendship.status === "pending" &&
        friendship.addressee_id === currentUser.id
      ) {
        incomingRequests.push({
          friendshipId: friendship.id,
          userId: profile.id,
          username: profile.username,
          name: profile.name,
          avatar: profile.avatar,
          createdAt: friendship.created_at,
        })
      }
    }

    setFriends(acceptedFriends)
    setFriendRequests(incomingRequests)
    setLoading(false)
  }

  useEffect(() => {
    loadFriendsData()
  }, [])

  const handleViewProfile = (username: string) => {
    router.push(`/?username=${encodeURIComponent(username)}`)
  }

  const handleRemoveFriend = async (friendshipId: string) => {
    setRemovingFriend(true)

    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId)

      if (error) {
        console.error("Ошибка удаления друга:", error)
        alert(`Не удалось удалить друга: ${error.message}`)
        return false
      }

      await loadFriendsData()
      return true
    } catch (error) {
      console.error("Ошибка удаления друга:", error)
      alert("Не удалось удалить друга. Проверьте подключение к интернету.")
      return false
    } finally {
      setRemovingFriend(false)
    }
  }

  const confirmRemoveFriend = async () => {
    if (!friendToRemove || removingFriend) return

    const removed = await handleRemoveFriend(friendToRemove.friendshipId)

    if (removed) {
      setFriendToRemove(null)
    }
  }

  const handleAcceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId)

    if (error) {
      console.error("Ошибка принятия запроса:", error)
      alert(`Не удалось принять запрос: ${error.message}`)
      return
    }

    await loadFriendsData()
  }

  const handleRejectRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId)

    if (error) {
      console.error("Ошибка отклонения запроса:", error)
      alert(`Не удалось отклонить запрос: ${error.message}`)
      return
    }

    await loadFriendsData()
  }

  const filteredFriends = searchQuery
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends

  const filteredRequests = searchQuery
    ? friendRequests.filter(
        (request) =>
          request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friendRequests

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
        Загружаем друзей...
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold mb-4">Друзья</h1>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9 h-10"
            placeholder="Поиск друзей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="px-4 pt-2 pb-3">
          <h2 className="font-semibold">
            Мои друзья ({filteredFriends.length})
          </h2>
        </div>

        {filteredFriends.length > 0 ? (
          <div className="divide-y">
            {filteredFriends.map((friend) => (
              <div
                key={friend.friendshipId}
                className="flex items-center p-4 hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold">
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    friend.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="ml-3 flex-1">
                  <div className="font-medium">{friend.name}</div>
                  <p className="text-sm text-muted-foreground">
                    @{friend.username}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewProfile(friend.username)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setFriendToRemove(friend)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Пока нет друзей
          </div>
        )}

        <div className="px-4 pt-8 pb-3">
          <h2 className="font-semibold">
            Запросы в друзья ({filteredRequests.length})
          </h2>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="divide-y">
            {filteredRequests.map((request) => (
              <div
                key={request.friendshipId}
                className="flex items-center p-4 hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold">
                  {request.avatar ? (
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    request.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="ml-3 flex-1">
                  <div className="font-medium">{request.name}</div>
                  <p className="text-sm text-muted-foreground">
                    @{request.username}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive"
                    onClick={() =>
                      handleRejectRequest(request.friendshipId)
                    }
                  >
                    Отклонить
                  </Button>

                  <Button
                    size="sm"
                    onClick={() =>
                      handleAcceptRequest(request.friendshipId)
                    }
                  >
                    Принять
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Запросов в друзья нет
          </div>
        )}
      </div>

      <AlertDialog
        open={!!friendToRemove}
        onOpenChange={(open) => {
          if (!open && !removingFriend) {
            setFriendToRemove(null)
          }
        }}
      >
        <AlertDialogContent className="max-w-[360px] rounded-2xl border-border bg-background p-6 shadow-2xl">
          <AlertDialogHeader className="items-center text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <UserX className="h-7 w-7 text-destructive" />
            </div>

            <AlertDialogTitle className="text-xl font-semibold">
              Удалить из друзей?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center leading-relaxed">
              Вы действительно хотите удалить пользователя{" "}
              <span className="font-semibold text-foreground">
                {friendToRemove?.name}
              </span>{" "}
              из списка друзей?
              <span className="mt-2 block text-xs">
                Чтобы восстановить дружбу, потребуется отправить новую заявку.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:gap-2">
            <AlertDialogCancel
              disabled={removingFriend}
              className="mt-0 w-full rounded-xl sm:w-1/2"
            >
              Отмена
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              disabled={removingFriend}
              onClick={confirmRemoveFriend}
              className="w-full rounded-xl sm:w-1/2"
            >
              {removingFriend ? "Удаление..." : "Удалить"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}