'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

export default function VerifyNIDPage() {
  const t = useTranslations('NIDVerification')
  const locale = useLocale()
  const router = useRouter()
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string>('')
  const [backPreview, setBackPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (side: 'front' | 'back', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(t('maxSizeError'))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontImage(file)
        setFrontPreview(reader.result as string)
      } else {
        setBackImage(file)
        setBackPreview(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      alert(t('uploadBothSides'))
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('submitted')}</h2>
          <p className="text-gray-600 mb-8">
            {t('submittedDescription')}
          </p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="w-full bg-[#C62D2D] text-white py-4 rounded-xl font-semibold hover:bg-[#A82424] transition-all"
          >
            {t('goToHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Info Panel */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[450px] bg-[#C62D2D] flex-col">
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">{t('backToHome')}</span>
          </button>
          <Link href={`/${locale}`} className="text-2xl font-bold text-white">Atithi</Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-4xl text-white">verified</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            {t('verifyYourIdentity')}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            {t('identityRequirement')}
          </p>

          {/* Security Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <span className="material-symbols-outlined text-white">lock</span>
              <div>
                <div className="font-semibold">{t('encryptedStorage')}</div>
                <div className="text-sm text-white/70">{t('encryptionType')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <span className="material-symbols-outlined text-white">visibility_off</span>
              <div>
                <div className="font-semibold">{t('privateSecure')}</div>
                <div className="text-sm text-white/70">{t('privacyNote')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <span className="material-symbols-outlined text-white">schedule</span>
              <div>
                <div className="font-semibold">{t('quickVerification')}</div>
                <div className="text-sm text-white/70">{t('verificationTime')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="material-symbols-outlined text-base">help</span>
            <span>{t('needHelp')}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <Link href={`/${locale}`} className="text-xl font-bold text-[#C62D2D]">Atithi</Link>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-6 lg:p-12">
          {/* Title Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('identitySecurity')}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {t('verifyYour')} <span className="text-[#C62D2D]">{t('nid')}</span> {t('card')}
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {/* Military-Grade Encryption Notice */}
            <div className="bg-[#FFF5F5] rounded-2xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-[#FFE4E1] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#C62D2D]">shield</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('militaryGradeEncryption')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('encryptionDescription')}
                </p>
              </div>
            </div>

            {/* Upload Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Front Side */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl text-[#C62D2D]">photo_camera</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('frontSide')}</h3>
                  <p className="text-xs text-gray-500 mb-4">{t('frontDescription')}</p>
                  
                  <input
                    type="file"
                    ref={frontInputRef}
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('front', e.target.files[0])}
                  />
                  
                  <button
                    onClick={() => frontInputRef.current?.click()}
                    className={`w-full aspect-[4/3] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      frontPreview 
                        ? 'border-[#C62D2D] bg-[#FFF5F5]' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    {frontPreview ? (
                      <img src={frontPreview} alt="Front preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-gray-300">upload</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{t('uploadPrompt')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Back Side */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl text-[#C62D2D]">qr_code_scanner</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t('backSide')}</h3>
                  <p className="text-xs text-gray-500 mb-4">{t('backDescription')}</p>
                  
                  <input
                    type="file"
                    ref={backInputRef}
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('back', e.target.files[0])}
                  />
                  
                  <button
                    onClick={() => backInputRef.current?.click()}
                    className={`w-full aspect-[4/3] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
                      backPreview 
                        ? 'border-[#C62D2D] bg-[#FFF5F5]' 
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    {backPreview ? (
                      <img src={backPreview} alt="Back preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-gray-300">qr_code</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{t('maxSize')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Guidelines */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8">{t('verificationGuidelines')}</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFE4E1] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C62D2D] font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('goodLighting')}</h4>
                    <p className="text-sm text-gray-600">{t('lightingDescription')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFE4E1] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C62D2D] font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('frameProperly')}</h4>
                    <p className="text-sm text-gray-600">{t('frameDescription')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFE4E1] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C62D2D] font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('legibleText')}</h4>
                    <p className="text-sm text-gray-600">{t('textDescription')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-[#FFF5F5] rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">info</span>
                <p className="text-sm text-gray-600">
                  {t('privacyAgreement')}{' '}
                  <Link href="/privacy" className="text-[#C62D2D] hover:underline">{t('privacyPolicy')}</Link>
                  {' '}{t('regardingID')}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !frontImage || !backImage}
              className="w-full bg-[#C62D2D] text-white py-4 rounded-xl font-semibold hover:bg-[#A82424] transition-all shadow-lg shadow-[#C62D2D]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  {t('submitting')}
                </>
              ) : (
                t('submitForReview')
              )}
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className={`w-8 h-1.5 rounded-full ${frontImage ? 'bg-[#C62D2D]' : 'bg-gray-200'}`} />
              <div className={`w-8 h-1.5 rounded-full ${backImage ? 'bg-[#C62D2D]' : 'bg-gray-200'}`} />
              <div className={`w-8 h-1.5 rounded-full ${frontImage && backImage ? 'bg-[#C62D2D]' : 'bg-gray-200'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
