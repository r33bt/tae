export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
            <h2 style="color: #dc2626;">❌ Invalid Verification Link</h2>
            <p>The verification link is missing or invalid.</p>
            <a href="/" style="color: #0070f3;">← Back to Homepage</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Verify the token in database
    const { supabase } = await import('@/lib/supabase')
    
    const { data: signup, error: fetchError } = await supabase
      .from('tae_newsletter_signups')
      .select('*')
      .eq('verification_token', token)
      .single()

    if (fetchError || !signup) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
            <h2 style="color: #dc2626;">❌ Invalid Token</h2>
            <p>This verification link is invalid or has expired.</p>
            <a href="/" style="color: #0070f3;">← Back to Homepage</a>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      })
    }

    if (signup.is_verified) {
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
            <h2 style="color: #059669;">✅ Already Verified</h2>
            <p>Your email <strong>${signup.email}</strong> is already verified for our newsletter.</p>
            <p>You'll receive our latest AI engineering content and resources.</p>
            <a href="/" style="color: #0070f3;">← Back to Homepage</a>
          </body>
        </html>
      `, { 
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Update the record to verified
    const { error: updateError } = await supabase
      .from('tae_newsletter_signups')
      .update({ 
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('verification_token', token)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
            <h2 style="color: #dc2626;">❌ Verification Failed</h2>
            <p>There was an error verifying your subscription. Please try again.</p>
            <a href="/" style="color: #0070f3;">← Back to Homepage</a>
          </body>
        </html>
      `, { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      })
    }

    // Success! Show confirmation page
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
          <h1 style="color: #059669;">🎉 Subscription Verified!</h1>
          <p style="font-size: 18px;">Thanks for verifying your email <strong>${signup.email}</strong></p>
          <p>You're now subscribed to The Agent Engineer newsletter!</p>
          <p style="color: #666;">You'll receive curated AI engineering content, validated tutorials, and community insights.</p>
          <div style="margin: 30px 0;">
            <a href="/" style="background: #0070f3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Explore TAE →
            </a>
          </div>
        </body>
      </html>
    `, { 
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return new Response(`
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; text-align: center;">
          <h2 style="color: #dc2626;">❌ Error</h2>
          <p>Something went wrong. Please try again later.</p>
          <a href="/" style="color: #0070f3;">← Back to Homepage</a>
        </body>
      </html>
    `, { 
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}