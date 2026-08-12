'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from './AuthProvider'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatWindow({ otherUserId }) {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const messagesEndRef = useRef(null)

  // Dapatkan profil pengguna lain
  useEffect(() => {
    const fetchOther = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single()
      setOtherUser(data)
    }
    if (otherUserId) fetchOther()
  }, [otherUserId])

  // Cari atau buat conversation baru
  useEffect(() => {
    if (!user || !otherUserId) return
    const findOrCreateConversation = async () => {
      // Cari apakah sudah ada percakapan antara user dan otherUserId
      const { data: existing } = await supabase
        .from('participants')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (existing) {
        const convIds = existing.map(p => p.conversation_id)
        if (convIds.length > 0) {
          const { data: shared } = await supabase
            .from('participants')
            .select('conversation_id')
            .in('conversation_id', convIds)
            .eq('user_id', otherUserId)
            .limit(1)

          if (shared && shared.length > 0) {
            setConversationId(shared[0].conversation_id)
            return
          }
        }
      }

      // Jika belum ada, buat conversation baru
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single()

      if (error) {
        console.error('Gagal buat percakapan:', JSON.stringify(error, null, 2))
        return
      }

      // Tambahkan kedua peserta
      await supabase.from('participants').insert([
        { conversation_id: newConv.id, user_id: user.id },
        { conversation_id: newConv.id, user_id: otherUserId },
      ])

      setConversationId(newConv.id)
    }
    findOrCreateConversation()
  }, [user, otherUserId])

  // Ambil pesan yang sudah ada
  useEffect(() => {
    if (!conversationId) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    fetchMessages()
  }, [conversationId])

  // Realtime subscription untuk pesan baru
  useEffect(() => {
    if (!conversationId) return
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Scroll ke bawah saat pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content) => {
    if (!content.trim() || !conversationId || !user) return
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    })
    if (error) console.error('Gagal kirim pesan:', error)
  }

  if (!otherUser) {
    return <div className="flex h-full items-center justify-center">Memuat...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header chat */}
      <div className="p-4 bg-green-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700">
          {otherUser?.full_name?.charAt(0) || 'U'}
        </div>
        <span className="font-bold">{otherUser?.full_name || 'Tanpa Nama'}</span>
      </div>

      {/* Daftar pesan */}
      <MessageList messages={messages} currentUserId={user.id} />
      <div ref={messagesEndRef} />

      {/* Input pesan */}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}