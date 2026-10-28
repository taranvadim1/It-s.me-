import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ProfileScreen />
      <BottomNavigation activeItem="profile" />
    </main>
  )
}

