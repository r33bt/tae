import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log('Newsletter signup attempt:', email)

    // Check if email already exists
    const { supabase } = await import('@/lib/supabase')
    const { data: existingSignup } = await supabase
      .from('tae_newsletter_signups')
      .select('*')
      .eq('email', email)
      .single()

    if (existingSignup) {
      return Response.json({ 
        message: 'Email already subscribed!' 
      })
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15)

    // Save to database
    const { error: dbError } = await supabase
      .from('tae_newsletter_signups')
      .insert([{
        email,
        verification_token: verificationToken,
        is_verified: false,
        subscribed_at: new Date().toISOString()
      }])

    if (dbError) {
      console.error('Database error:', dbError)
      return Response.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    // Send verification email with clickable link
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/verify?token=${verificationToken}`
    
    const data = await resend.emails.send({
      from: 'TAE Newsletter <newsletter@theagentengineer.com>',
      to: [email],
      subject: 'Please verify your TAE newsletter subscription',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Welcome to The Agent Engineer!</h2>
          <p>Thanks for subscribing to our newsletter. Please click the button below to verify your subscription:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #0070f3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Verify Subscription
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link in your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't sign up for this newsletter, you can safely ignore this email.
          </p>
        </div>
      `
    })

    console.log('Newsletter signup processed for:', email)
    return Response.json({
      message: 'Subscription successful! Please check your email to verify.'
    })

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}