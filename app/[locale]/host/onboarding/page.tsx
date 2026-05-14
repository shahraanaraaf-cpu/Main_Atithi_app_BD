'use client'

import { useState } from 'react'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic import for Map
const PropertyMap = dynamic(() => import('@/app/components/ui/PropertyMap').then(mod => mod.PropertyMap), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-100 rounded-2xl animate-pulse" />
})

export default function HostOnboarding() {
  const params = useParams() as { locale: string }
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: 'homes',
    title: '',
    description: '',
    location: '',
    lat: 23.8103,
    lng: 90.4125,
    price: 3500,
    images: [] as string[]
  })
  const router = useRouter()

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    // In a real app, we would call a server action to save to DB
    alert('Listing created successfully!')
    router.push(`/${params.locale}/dashboard/host`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header forceCompact userRole="HOST" />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-12">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-100 mb-12 flex gap-1">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`flex-1 h-full transition-all duration-500 ${step >= s ? 'bg-zinc-900' : 'bg-zinc-100'}`} 
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">Tell us about your place</h1>
            <p className="text-zinc-500 text-lg mb-10">Start with the basics. What kind of place are you listing?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {['Homes', 'Apartments', 'Cabins', 'Villas', 'Tiny Houses', 'Boats'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFormData({...formData, category: cat.toLowerCase()})}
                  className={`p-6 border-2 rounded-2xl flex flex-col gap-4 text-left transition-all ${formData.category === cat.toLowerCase() ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-900'}`}
                >
                  <span className="material-symbols-outlined text-3xl">home</span>
                  <span className="font-bold text-zinc-900">{cat}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest text-zinc-400">Property Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Luxury Villa in Sylhet" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest text-zinc-400">Description</label>
                <textarea 
                  rows={4} 
                  placeholder="Describe what makes your place special..." 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-all text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">Where is it located?</h1>
            <p className="text-zinc-500 text-lg mb-10">Your address is only shared with guests after they book.</p>
            
            <div className="mb-8">
              <input 
                type="text" 
                placeholder="Enter your address" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full p-4 border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-all text-lg mb-4"
              />
              <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                <PropertyMap lat={formData.lat} lng={formData.lng} locationName={formData.location || 'Your Property'} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">Add some photos</h1>
            <p className="text-zinc-500 text-lg mb-10">You'll need at least 5 photos to get started. You can add more later.</p>
            
            <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-20 text-center hover:border-zinc-900 transition-all cursor-pointer group">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-6xl text-zinc-300 group-hover:text-zinc-900 transition-colors">add_a_photo</span>
                <span className="text-lg font-bold text-zinc-900">Drag your photos here</span>
                <span className="text-zinc-500">or upload from your device</span>
                <button className="mt-4 px-6 py-2 border border-zinc-900 rounded-lg font-bold hover:bg-zinc-50 transition-all">Upload</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">Set your price</h1>
            <p className="text-zinc-500 text-lg mb-10">You can change it anytime. Start with a competitive price to get bookings.</p>
            
            <div className="flex flex-col items-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl font-black text-zinc-900">৳</span>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="bg-transparent text-7xl font-black text-zinc-900 outline-none w-[300px]"
                />
              </div>
              <p className="text-zinc-500 font-bold">per night</p>
            </div>

            <div className="mt-12 p-8 border border-zinc-200 rounded-2xl bg-white shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4">Final Review</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Category</span>
                  <span className="font-bold capitalize">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Title</span>
                  <span className="font-bold">{formData.title || 'Untitled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location</span>
                  <span className="font-bold truncate max-w-[200px]">{formData.location || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-auto pt-12 flex justify-between items-center border-t border-zinc-100">
          <button 
            onClick={handleBack}
            disabled={step === 1}
            className={`text-zinc-900 font-bold underline underline-offset-4 disabled:opacity-30 disabled:no-underline`}
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="px-10 py-4 bg-[#FF385C] text-white font-black rounded-2xl hover:bg-[#E31C5F] transition-all shadow-lg"
            >
              Create Listing
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
