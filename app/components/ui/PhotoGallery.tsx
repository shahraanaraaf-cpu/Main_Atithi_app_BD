'use client'

import { useEffect } from 'react'

export function PhotoGallery({ 
  images, 
  onClose 
}: { 
  images: string[], 
  onClose: () => void 
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <header className="h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 bg-white z-10">
        <button 
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center hover:bg-zinc-100 rounded-2xl transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg text-sm font-semibold underline">
            <span className="material-symbols-outlined text-[20px]">share</span>
            Share
          </button>
          <button className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg text-sm font-semibold underline">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            Save
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="w-full">
              <img 
                src={img} 
                alt={`Room ${i}`} 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
