"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface UsersListProps {
  users: string[]
  onSelectUser: (username: string) => void
}

export function UsersList({ users, onSelectUser }: UsersListProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-3">Популярные профили</h2>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {users.map((username) => (
            <button
              key={username}
              className="flex flex-col items-center space-y-2"
              onClick={() => onSelectUser(username)}
            >
              <div className="overflow-hidden rounded-full bg-secondary">
                <img
                  src={`/placeholder.svg?height=80&width=80&text=${username.charAt(0).toUpperCase()}`}
                  alt={username}
                  className="h-20 w-20 object-cover"
                />
              </div>
              <span className="font-roboto text-[16px] text-[#0D47A1]">{username}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-medium">Все пользователи</h2>
        <div className="space-y-2">
          {users.map((username) => (
            <button
              key={`list-${username}`}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => onSelectUser(username)}
            >
              <div className="overflow-hidden rounded-full bg-secondary">
                <img
                  src={`/placeholder.svg?height=48&width=48&text=${username.charAt(0).toUpperCase()}`}
                  alt={username}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <span className="font-roboto text-[16px] text-[#0D47A1]">{username}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

