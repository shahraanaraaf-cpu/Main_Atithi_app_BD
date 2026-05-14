'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function SearchBar() {
  const t = useTranslations('Index')
  const [activeTab, setActiveTab] = useState('stays')

  return (
    <div className="w-full max-w-[850px] mx-auto mt-6">
      <div className="flex bg-white rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-zinc-200 divide-x divide-zinc-200">
        
        {/* Where Section */}
        <label className="flex-1 px-8 py-3.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer group block">
          <span className="text-xs font-bold text-zinc-800">Where</span>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="w-full bg-transparent outline-none text-zinc-600 text-sm mt-0.5 truncate placeholder:text-zinc-400 group-hover:bg-zinc-100 transition-colors"
          />
        </label>

        {/* When Section */}
        <div className="flex-1 px-8 py-3.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer">
          <div className="text-xs font-bold text-zinc-800">When</div>
          <div className="text-zinc-400 text-sm mt-0.5 truncate">Add dates</div>
        </div>

        {/* Who Section & Search Button */}
        <div className="flex-1 pl-8 pr-2 py-2 flex items-center justify-between hover:bg-zinc-100 rounded-full transition-colors cursor-pointer">
          <div className="flex flex-col flex-1">
            <div className="text-xs font-bold text-zinc-800">Who</div>
            <div className="text-zinc-400 text-sm mt-0.5 truncate">Add guests</div>
          </div>
          <button className="bg-primary hover:bg-[#E31C5F] transition-colors text-white rounded-full p-4 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
