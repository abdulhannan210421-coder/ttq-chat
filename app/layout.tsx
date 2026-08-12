import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata = {
  title: 'TTQ Chat',
  description: 'Chat internal staf TTQ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}