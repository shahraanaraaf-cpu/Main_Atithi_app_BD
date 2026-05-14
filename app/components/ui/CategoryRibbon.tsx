'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
  { id: 'HOME', name: 'Homes', icon: 'home' },
  { id: 'EXPERIENCE', name: 'Experiences', icon: 'local_activity' },
  { id: 'SERVICE', name: 'Services', icon: 'dry_cleaning' },
  { id: 'BEACH', name: 'Beachfront', icon: 'beach_access' },
  { id: 'TRENDING', name: 'Trending', icon: 'trending_up' },
]

export function CategoryRibbon() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') || 'HOME'

  const handleCategoryClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-[80px] w-full bg-white z-40 border-b border-zinc-100 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 flex items-center justify-between gap-8 h-20">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex flex-col items-center gap-2 min-w-fit transition-all relative group py-2`}
            >
              <span className={`material-symbols-outlined text-2xl transition-colors ${active === cat.id ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900'}`}>
                {cat.icon}
              </span>
              <span className={`text-[12px] font-bold whitespace-nowrap transition-colors ${active === cat.id ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900'}`}>
                {cat.name}
              </span>
              {active === cat.id && (
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-zinc-900" />
              )}
              {!active && (
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-200 text-xs font-bold hover:bg-zinc-50 transition-all flex-shrink-0">
          <span className="material-symbols-outlined text-sm">tune</span>
          Filters
        </button>
      </div>
      
    </div>
  )
}
