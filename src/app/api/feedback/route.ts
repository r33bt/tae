import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, rating, feedback_text, email } = body

    console.log('Feedback received:', { content_type, content_id, rating, feedback_text })

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
        is_verified: false
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
