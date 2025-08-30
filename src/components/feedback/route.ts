import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, rating, feedback_text, email } = body

    // Validate required fields
    if (!content_type || !rating || !feedback_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert feedback into database
    const { data, error } = await supabase
      .from('tae_user_feedback')
      .insert({
        content_type,
        content_id: content_id || null,
        rating,
        feedback_text,
        email: email || null,
        is_verified: false // We'll manually verify later
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get recent verified feedback for display
    const { data, error } = await supabase
      .from('tae_user_feedback')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
