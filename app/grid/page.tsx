import { GridScreen } from "@/components/grid-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function GridPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <GridScreen />
      <BottomNavigation activeItem="home" />
    </main>
  )
}

