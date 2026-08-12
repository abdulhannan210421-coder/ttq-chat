export default function MessageList({ messages, currentUserId }) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow ${
                  isMine
                    ? 'bg-green-200 text-gray-900'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }