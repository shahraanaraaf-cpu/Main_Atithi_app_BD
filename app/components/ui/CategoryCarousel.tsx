'use client'

import { useState } from 'react'

const categories = [
  { id: '1', name: 'Icons', icon: 'M12 2L2 12h3v8h14v-8h3L12 2z' },
  { id: '2', name: 'Beachfront', icon: 'M14 2v4a2 2 0 0 0 2 2h4l-6-6z' },
  { id: '3', name: 'Cabins', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: '4', name: 'Amazing pools', icon: 'M2 12h20 M12 2v20' },
  { id: '5', name: 'Trending', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: '6', name: 'Lakefront', icon: 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0z' },
  { id: '7', name: 'Design', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: '8', name: 'Countryside', icon: 'M5 12h14' },
]

export function CategoryCarousel() {
  const [activeId, setActiveId] = useState('1')

  return (
    <div className="relative w-full overflow-hidden flex items-center mt-6 border-b border-zinc-200 pb-2">
      <div className="flex gap-8 overflow-x-auto no-scrollbar py-4 px-2 scroll-smooth">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveId(category.id)}
            className={`flex flex-col items-center gap-2 min-w-max transition-all ${
              activeId === category.id 
                ? 'text-zinc-950 border-b-2 border-zinc-950 pb-2 opacity-100' 
                : 'text-zinc-500 border-b-2 border-transparent pb-2 hover:text-zinc-800 hover:border-zinc-300 opacity-80 hover:opacity-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeId === category.id ? 'fill-zinc-950 stroke-zinc-950' : ''}>
              <path d={category.icon} />
            </svg>
            <span className="text-xs font-semibold">{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Right Scroll Arrow Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-2">
        <button className="bg-white border border-zinc-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  )
}
