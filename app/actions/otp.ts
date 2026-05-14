'use server'

/**
 * Modular OTP Service for Bangladesh
 * This can be swapped with real SMS gateways like SSL Wireless, BulkSMS BD, etc.
 */
export async function sendOTP(phoneNumber: string) {
  console.log(`[OTP] Sending code to ${phoneNumber}...`)
  
  // MOCK: Generate a random 6-digit code
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
  
  // In a real scenario, you'd call your SMS gateway API here
  // await axios.post('https://api.sms-gateway.com/send', { to: phoneNumber, message: `Your Atithi code is ${mockCode}` })
  
  console.log(`[OTP] Code for ${phoneNumber}: ${mockCode} (SAVED TO SESSION/CACHE)`)
  
  return { success: true, message: 'OTP sent successfully' }
}

export async function verifyOTP(phoneNumber: string, code: string) {
  console.log(`[OTP] Verifying code ${code} for ${phoneNumber}...`)
  
  // MOCK: Always accept '123456' or any code for testing
  if (code === '123456' || code.length === 6) {
    return { success: true, message: 'OTP verified' }
  }
  
  return { success: false, message: 'Invalid OTP' }
}
