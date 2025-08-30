import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('tae_newsletter_subscribers')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 200 }
      )
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('tae_newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
        is_active: true,
        source: 'website'
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}