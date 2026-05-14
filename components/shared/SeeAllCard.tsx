import Link from 'next/link'

interface SeeAllCardProps {
  href: string
  images?: string[]
  text?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape'
}

export function SeeAllCard({ 
  href, 
  images = [], 
  text = "See all",
  aspectRatio = 'square'
}: SeeAllCardProps) {
  
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[4/3]'
  }

  return (
    <Link href={href} className="group cursor-pointer block">
      <div className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-2xl mb-3 shadow-sm border border-zinc-200 bg-white flex flex-col items-center justify-center hover:shadow-md transition-all duration-300`}>
        
        {/* Images Fan */}
        <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
          {images.length >= 3 ? (
            <>
               <div className="absolute top-2 left-0 w-[75px] h-[75px] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)] border-[3px] border-white -rotate-12 bg-gray-100 z-10 transition-transform duration-300 group-hover:-rotate-[15deg] group-hover:-translate-x-1">
                  <img src={images[0]} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="absolute top-2 right-0 w-[75px] h-[75px] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)] border-[3px] border-white rotate-12 bg-gray-100 z-10 transition-transform duration-300 group-hover:rotate-[15deg] group-hover:translate-x-1">
                  <img src={images[1]} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="absolute bottom-0 z-20 w-[85px] h-[85px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-[3px] border-white bg-gray-100 transition-transform duration-300 group-hover:-translate-y-1">
                  <img src={images[2]} className="w-full h-full object-cover" alt="" />
               </div>
            </>
          ) : (
            <div className="w-[85px] h-[85px] rounded-xl overflow-hidden shadow-md border-[3px] border-white bg-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400 text-3xl">imagesmode</span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-zinc-900 text-[15px]">{text}</h3>
      </div>
      
      {/* Invisible spacer to roughly match the height of the text info below other cards so the horizontal row aligns correctly */}
      <div className="space-y-0.5 px-0.5 invisible" aria-hidden="true">
        <h3 className="font-bold text-[15px] leading-tight">Spacer</h3>
        <p className="text-[13px]">Spacer</p>
        <div className="pt-0.5">
          <span className="text-[14px]">Spacer</span>
        </div>
      </div>
    </Link>
  )
}
