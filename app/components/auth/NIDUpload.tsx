'use client'

import { useState } from 'react'
import { updateNID } from '@/app/actions/user'

export function NIDUpload() {
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    // In a real app, you would upload the files to Supabase Storage here
    // and get the returned URLs. For now, we simulate the process.
    setIsUploading(true)
    try {
      const mockFrontUrl = 'https://example.com/nid_front.jpg'
      const mockBackUrl = 'https://example.com/nid_back.jpg'
      await updateNID(mockFrontUrl, mockBackUrl)
      alert("NID successfully uploaded and pending verification!")
    } catch (e: any) {
      alert("Upload failed: " + e.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-[#fdf7f7] rounded-3xl shadow-sm border border-[#f5e6e6]">
      <h2 className="text-3xl font-bold text-center mb-2 text-zinc-900">Verify Your Identity</h2>
      <p className="text-center text-zinc-600 mb-8">
        Please upload your National ID card. This helps us keep Atithi App BD secure.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Front Dropzone */}
        <label className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-primary/30 rounded-3xl cursor-pointer hover:bg-red-50/50 transition-colors">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-primary">
            {/* Camera Icon Simulation */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <span className="font-semibold text-zinc-800">Upload Front Side</span>
          <span className="text-sm text-zinc-500 mt-1">JPEG or PNG, max 5MB</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => setFrontImage(e.target.files?.[0] || null)}
          />
        </label>

        {/* Back Dropzone */}
        <label className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-primary/30 rounded-3xl cursor-pointer hover:bg-red-50/50 transition-colors">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-primary">
            {/* Camera Icon Simulation */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <span className="font-semibold text-zinc-800">Upload Back Side</span>
          <span className="text-sm text-zinc-500 mt-1">JPEG or PNG, max 5MB</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => setBackImage(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <div className="bg-white p-4 rounded-2xl flex items-start gap-4 mb-8 shadow-sm">
        <div className="text-primary mt-1">
          {/* Lock Icon Simulation */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-zinc-800">Your data is secure</h4>
          <p className="text-sm text-zinc-600">Your ID is encrypted and securely stored. It will not be shared with hosts or guests.</p>
        </div>
      </div>

      <button 
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full bg-[#da2b2b] hover:bg-[#c42525] text-white font-bold py-4 rounded-2xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isUploading ? 'Uploading...' : 'Submit Verification'}
        {!isUploading && (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>
    </div>
  )
}
