import { FriendsScreen } from "@/components/friends-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function FriendsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <FriendsScreen />
      <BottomNavigation activeItem="friends" />
    </main>
  )
}

