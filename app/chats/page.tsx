import { ChatsScreen } from "@/components/chats-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function ChatsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ChatsScreen />
      <BottomNavigation activeItem="chats" />
    </main>
  )
}

