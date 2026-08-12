'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

export default function ChatSidebar() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id) // jangan tampilkan diri sendiri
      if (!error) setContacts(data)
    }
    fetchContacts()
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const startChat = (contactId) => {
    router.push(`/chat?userId=${contactId}`)
  }

  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 bg-green-600 text-white flex justify-between items-center">
        <h1 className="font-bold text-lg">TTQ Chat</h1>
        <button onClick={handleLogout} className="text-sm hover:underline">
          Keluar
        </button>
      </div>
      <div className="p-2 border-b">
        <p className="text-sm text-gray-600">Halo, {user?.user_metadata?.full_name || user?.email}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">Belum ada kontak lain</p>
        )}
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => startChat(contact.id)}
            className="w-full text-left p-4 hover:bg-gray-100 border-b flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
              {contact.full_name?.charAt(0) || 'U'}
            </div>
            <span className="font-medium">{contact.full_name || 'Tanpa Nama'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}