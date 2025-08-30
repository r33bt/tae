import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    console.log('Newsletter signup attempt:', email)

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
      console.log('Email already subscribed:', email)
      return NextResponse.json(
        { success: true, message: 'Email already subscribed' },
        { status: 200 }
      )
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('tae_newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        is_active: true,
        source: 'website'
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Newsletter subscription successful:', data)
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

// Add a GET method to avoid the "No HTTP methods exported" error
export async function GET() {
  return NextResponse.json({ 
    message: 'Newsletter API endpoint is working. Use POST to subscribe.' 
  })
}
