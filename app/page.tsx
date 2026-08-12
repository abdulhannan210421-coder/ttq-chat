'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/chat')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Memuat...</p>
    </div>
  )
}