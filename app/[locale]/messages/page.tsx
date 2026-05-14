'use client'

import { useState } from 'react'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'

const mockConversations = [
  { id: '1', name: 'Shuvo', avatar: 'https://picsum.photos/seed/shuvo/50/50', lastMsg: 'Is the pool open in October?', time: '2h ago', unread: true },
  { id: '2', name: 'Karim', avatar: 'https://picsum.photos/seed/karim/50/50', lastMsg: 'Your booking is confirmed!', time: 'Yesterday', unread: false },
  { id: '3', name: 'Maria', avatar: 'https://picsum.photos/seed/maria/50/50', lastMsg: 'Thanks for the quick response.', time: '3 days ago', unread: false },
]

const mockMessages = [
  { id: 'm1', sender: 'them', text: 'Hello! I was looking at your Luxury Villa.', time: '10:05 AM' },
  { id: 'm2', sender: 'me', text: 'Hi! Happy to help. What would you like to know?', time: '10:10 AM' },
  { id: 'm3', sender: 'them', text: 'Is the tea garden view visible from the bedroom?', time: '10:15 AM' },
  { id: 'm4', sender: 'me', text: 'Yes, both bedrooms have large windows facing the garden.', time: '10:16 AM' },
]

export default function MessagesPage({ params }: { params: { locale: string } }) {
  const [activeConv, setActiveConv] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now().toString(), sender: 'me', text: input, time: 'Just now' }])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header forceCompact />
      
      <main className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-12 gap-8 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[350px] flex flex-col border border-zinc-200 rounded-3xl overflow-hidden bg-white">
          <div className="p-6 border-b border-zinc-200 bg-zinc-50">
            <h2 className="text-xl font-bold text-zinc-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conv) => (
              <button 
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full flex items-center gap-4 p-6 text-left hover:bg-zinc-50 transition-all border-b border-zinc-100 last:border-0 ${activeConv.id === conv.id ? 'bg-zinc-50' : ''}`}
              >
                <div className="relative">
                  <img src={conv.avatar} alt={conv.name} className="w-14 h-14 rounded-full object-cover" />
                  {conv.unread && <div className="absolute top-0 right-0 w-4 h-4 bg-[#FF385C] border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-zinc-900">{conv.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{conv.time}</span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{conv.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col border border-zinc-200 rounded-3xl overflow-hidden bg-white">
          {/* Chat Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-4">
              <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-zinc-900">{activeConv.name}</h3>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</p>
              </div>
            </div>
            <button className="h-10 w-10 flex items-center justify-center hover:bg-zinc-200 rounded-full transition-all">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 bg-zinc-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-3xl ${msg.sender === 'me' ? 'bg-zinc-900 text-white rounded-tr-none' : 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-none shadow-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-2 ${msg.sender === 'me' ? 'text-zinc-400' : 'text-zinc-500'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-zinc-200 bg-white">
            <div className="flex items-center gap-4 bg-zinc-100 rounded-2xl p-2 pl-6">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900"
              />
              <button 
                onClick={handleSend}
                className="h-10 w-10 bg-[#FF385C] text-white rounded-xl flex items-center justify-center hover:bg-[#E31C5F] transition-all"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
