"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, ArrowRight, AlertCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const result = await response.json()
      console.log('API Response:', { status: response.status, result })

      if (response.ok) {
        setSubmitted(true)
        setMessage(result.message || "Please check your email to verify your subscription")
        setEmail("")
      } else {
        setError(result.error || `Error ${response.status}: Failed to subscribe`)
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="text-center py-8">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Check Your Email!</h3>
          <p className="text-blue-700 mb-4">
            {message}
          </p>
          <p className="text-xs text-blue-600 mb-4">
            Don't see it? Check your spam folder or try again with a different email.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSubmitted(false)
              setMessage("")
              setError("")
            }}
          >
            Try Different Email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Never Miss a Quality Tutorial</CardTitle>
        <CardDescription>
          Get weekly updates on new "Actually Works" tutorials and AI creator discoveries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={!email.trim() || loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Join <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center">
            ✅ No spam • ✅ Weekly AI tutorials • ✅ Unsubscribe anytime
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
