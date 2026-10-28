import { ChatScreen } from "@/components/chat-screen"

export default function ChatPage({ params }: { params: { username: string } }) {
  return (
    <main className="flex min-h-screen flex-col">
      <ChatScreen username={params.username} />
    </main>
  )
}

