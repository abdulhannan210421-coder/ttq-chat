'use client'
import { useState } from 'react'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSend(text)
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white border-t flex gap-2"
    >
      <input
        type="text"
        placeholder="Ketik pesan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border rounded-full focus:outline-green-500"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-5 rounded-full hover:bg-green-700 transition"
      >
        Kirim
      </button>
    </form>
  )
}