'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  fullName: string
  role: 'GUEST' | 'HOST'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('atithi-user')
      console.log('AuthContext: Checking stored user:', storedUser)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('AuthContext: Parsed user:', parsedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('atithi-user')
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log('AuthContext: Logging in user:', userData)
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('atithi-user', JSON.stringify(userData))
    }
    console.log('AuthContext: User stored in localStorage')
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atithi-user')
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
