'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-zinc-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-zinc-950">
        {isLogin ? 'Welcome back to Atithi App BD' : 'Join Atithi App BD'}
      </h2>
      
      <form action={isLogin ? login : signup} className="flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="full_name">Full Name</label>
            <input 
              id="full_name" 
              name="full_name" 
              type="text" 
              required 
              className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors mt-2"
        >
          {isLogin ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-primary font-semibold hover:underline"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  )
}
