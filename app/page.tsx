"use client"

import { useState, useEffect } from "react"
import { MainScreen } from "@/components/main-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserProfile } from "@/components/user-profile"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  const searchParams = useSearchParams()
  const usernameParam = searchParams.get("username")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    if (usernameParam) {
      setSelectedUser(usernameParam)
    }
  }, [usernameParam])

  return (
    <main className="flex min-h-screen flex-col">
      {!selectedUser && <SiteHeader />}
      {selectedUser ? (
        <UserProfile username={selectedUser} onBack={() => setSelectedUser(null)} />
      ) : (
        <MainScreen onSelectUser={setSelectedUser} />
      )}
      <BottomNavigation activeItem="home" />
    </main>
  )
}

