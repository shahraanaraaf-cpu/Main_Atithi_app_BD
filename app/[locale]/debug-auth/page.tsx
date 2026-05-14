'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Index')

  const handleTestLogin = () => {
    const testUser = {
      id: 'test-123',
      email: 'whosain@live.com',
      fullName: 'Whosain Test',
      role: 'GUEST' as const
    }
    login(testUser)
  }

  const handleTestHostLogin = () => {
    const testUser = {
      id: 'host-123',
      email: 'host@example.com',
      fullName: 'Test Host',
      role: 'HOST' as const
    }
    login(testUser)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleTestLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Test Guest Login (whosain@live.com)
            </button>
            <button
              onClick={handleTestHostLogin}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Test Host Login
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              disabled={!isAuthenticated}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push(`/${locale}`)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard/guest/overview`)}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Go to Guest Dashboard
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard/host/overview`)}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            >
              Go to Host Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Check</h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                const storedUser = localStorage.getItem('atithi-user')
                alert('LocalStorage: ' + (storedUser || 'No user data found'))
              }}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              Check LocalStorage
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('atithi-user')
                alert('LocalStorage cleared')
              }}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Clear LocalStorage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
