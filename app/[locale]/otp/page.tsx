"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendOTP, verifyOTP } from "@/app/actions/otp"
import { useToast } from "@/components/ui/use-toast"

export default function OTPVerification() {
  const t = useTranslations("OTP")
  const router = useRouter()
  const searchParams = useSearchParams()

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [phone, setPhone] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [countdown, setCountdown] = useState(30)
  const { addToast } = useToast()

  // Get phone from URL params or session
  useEffect(() => {
    const phoneParam = searchParams.get("phone")
    if (phoneParam) {
      setPhone(phoneParam)
    }
  }, [searchParams])

  // Countdown timer for resend
  useEffect(() => {
    if (!resendDisabled) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendDisabled])

  // Handle OTP input change with auto-focus
  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return // Prevent multiple characters

      const newOtp = [...otp]
      newOtp[index] = value.replace(/[^0-9]/g, "") // Only allow numbers

      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    },
    [otp]
  )

  // Handle backspace to move focus back
  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`)
        prevInput?.focus()
      }
    },
    [otp]
  )

  // Resend OTP
  const handleResend = async () => {
    if (!phone) return

    setLoading(true)
    try {
      try {
        const result = await sendOTP(phone)
        if (result.success) {
          addToast({
            title: t("otpSent"),
            description: t("otpSentDesc", { phone }),
          })
        } else {
          addToast({
            title: t("error"),
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (e) {
        addToast({
          title: t("error"),
          description: t("errorResend"),
          variant: "destructive",
        })
      }
      setResendDisabled(true)
      setCountdown(30)
    } catch (error) {
      addToast({
        title: t("error"),
        description: t("errorResend"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length !== 6) {
      addToast({
        title: t("invalidCode"),
        description: t("enterFullCode"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Verify OTP via server action
      const result = await verifyOTP(phone, code)

      if (result.success) {
        addToast({
          title: t("verified"),
          description: t("verifiedDesc"),
        })
        router.push("/en/verify-nid") // or wherever you want to redirect
      } else {
        addToast({
          title: t("error"),
          description: result.message,
          variant: "destructive",
        })
        setOtp(Array(6).fill(""))
      }
    } catch (error) {
      addToast({
        title: t("error"),
        description: t("errorVerify"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {t("subtitle", { phone: phone || "your number" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold rounded-lg"
                disabled={loading}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="text-center">
            {resendDisabled ? (
              <p className="text-sm text-gray-500">
                {t("resendIn")} <span className="font-bold text-blue-600">{countdown}s</span>
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700"
              >
                {loading ? t("sending") : t("resend")}
              </Button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={loading || otp.some((d) => d === "")}
          >
            {loading ? t("verifying") : t("verifyBtn")}
          </Button>

          {/* Alternative Actions */}
          <div className="flex flex-col items-center gap-2 text-sm">
            <Link
              href="/en/login"
              className="text-blue-600 hover:underline"
            >
              {t("backLogin")}
            </Link>
            <p className="text-gray-400">{t("contactSupport")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}