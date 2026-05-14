'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * SSLCommerz Integration (Mock Flow for Bangladesh)
 * Target Methods: bKash, Nagad, Rocket, Cards
 */
export async function initiatePayment(formData: FormData) {
  const roomId = formData.get('roomId') as string
  const amount = formData.get('amount') as string
  const checkIn = formData.get('checkIn') as string
  const checkOut = formData.get('checkOut') as string
  
  const supabase = await createClient() as any

  // 1. Create Pending Booking in Database
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([
      { 
        room_id: roomId,
        amount: parseFloat(amount),
        status: 'PENDING',
        check_in: checkIn,
        check_out: checkOut,
        payment_method: 'SSLCOMMERZ'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('[Payment] Error creating booking:', error)
    throw new Error('Failed to initiate booking')
  }

  // 2. Generate Redirect URL (Mocking SSLCommerz Hosted Checkout)
  // In real integration, you'd call: https://sandbox.sslcommerz.com/gwprocess/v4/api.php
  const tranId = `TRAN_${Date.now()}`
  
  // Update booking with transaction ID
  await supabase
    .from('bookings')
    .update({ transaction_id: tranId })
    .eq('id', booking.id)

  // Redirect to mock payment gateway page
  const locale = formData.get('locale') as string || 'en'
  redirect(`/${locale}/checkout/payment?tranId=${tranId}&amount=${amount}`)
}

export async function handleIPN(tranId: string, status: string) {
  const supabase = await createClient() as any

  if (status === 'VALID') {
    // Confirm booking
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CONFIRMED', paid_at: new Date().toISOString() })
      .eq('transaction_id', tranId)

    if (error) {
      console.error('[IPN] Error confirming booking:', error)
      return { success: false }
    }

    console.log(`[IPN] Transaction ${tranId} confirmed successfully.`)
    return { success: true }
  }

  return { success: false }
}
