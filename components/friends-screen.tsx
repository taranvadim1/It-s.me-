"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, UserX } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  getAllFriends,
  getAllFriendRequests,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  type Friend,
  type FriendRequest,
} from "@/lib/friends-store"

export function FriendsScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  // Загружаем данные о друзьях при монтировании компонента
  useEffect(() => {
    const loadFriendsData = () => {
      setFriends(getAllFriends())
      setFriendRequests(getAllFriendRequests())
    }

    loadFriendsData()

    // Добавляем слушатель события хранилища для обновления данных
    const handleStorageChange = () => {
      loadFriendsData()
    }

    window.addEventListener("storage", handleStorageChange)

    // Устанавливаем интервал для периодического обновления данных
    const interval = setInterval(loadFriendsData, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleViewProfile = (username: string) => {
    router.push(`/?username=${username}`)
  }

  const handleRemoveFriend = (username: string) => {
    removeFriend(username)
    setFriends(getAllFriends())
  }

  const handleAcceptRequest = (username: string) => {
    acceptFriendRequest(username)
    setFriends(getAllFriends())
    setFriendRequests(getAllFriendRequests())
  }

  const handleRejectRequest = (username: string) => {
    rejectFriendRequest(username)
    setFriendRequests(getAllFriendRequests())
  }

  const filteredFriends = searchQuery
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends

  const filteredRequests = searchQuery
    ? friendRequests.filter(
        (request) =>
          request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friendRequests

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

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid grid-cols-2 mx-4">
          <TabsTrigger value="all">Все друзья</TabsTrigger>
          <TabsTrigger value="requests">Запросы ({friendRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1">
          {filteredFriends.length > 0 ? (
            <div className="divide-y">
              {filteredFriends.map((friend) => (
                <div key={friend.username} className="flex items-center p-4 hover:bg-secondary transition-colors">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=48&width=48&text=${friend.username.charAt(0).toUpperCase()}`}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${friend.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                    />
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{friend.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary"
                          onClick={() => handleViewProfile(friend.username)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveFriend(friend.username)}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">Друзья не найдены</div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="flex-1">
          {filteredRequests.length > 0 ? (
            <div className="divide-y">
              {filteredRequests.map((request) => (
                <div key={request.username} className="flex items-center p-4 hover:bg-secondary transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=48&width=48&text=${request.username.charAt(0).toUpperCase()}`}
                      alt={request.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{request.name}</span>
                        <p className="text-sm text-muted-foreground">@{request.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive"
                          onClick={() => handleRejectRequest(request.username)}
                        >
                          Отклонить
                        </Button>
                        <Button size="sm" className="bg-primary" onClick={() => handleAcceptRequest(request.username)}>
                          Принять
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
              Запросов в друзья нет
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

