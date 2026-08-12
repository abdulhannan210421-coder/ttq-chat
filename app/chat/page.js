// app/chat/page.js
'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'

function ChatContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-200">
        <p className="text-gray-500 text-lg">Pilih kontak untuk memulai chat</p>
      </div>
    )
  }

  return <ChatWindow otherUserId={userId} />
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Memuat chat...</div>}>
      <ChatContent />
    </Suspense>
  )
}