import Link from "next/link"
import { Home, MessageSquare, User, Users } from "lucide-react"

interface BottomNavigationProps {
  activeItem: "home" | "chats" | "friends" | "profile"
}

export function BottomNavigation({ activeItem }: BottomNavigationProps) {
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
        <Users className="h-6 w-6" />
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

