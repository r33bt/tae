'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Mail } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already_subscribed'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.message.includes('already subscribed')) {
          setStatus('already_subscribed')
          setMessage('You&apos;re already on our list!')
        } else {
          setStatus('success')
          setMessage(data.message)
          setEmail('')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setMessage('')
    setEmail('')
  }

  // Already subscribed state
  if (status === 'already_subscribed') {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                You&apos;re Already Subscribed! 🎉
              </h3>
              <p className="text-green-700 text-sm">
                Great news! You&apos;re already on our list and will receive all our latest AI engineering content.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetForm}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Try Different Email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Check Your Email! 📧
              </h3>
              <p className="text-blue-700 text-sm">
                We&apos;ve sent you a verification link. Please check your inbox and click the link to confirm your subscription.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetForm}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              Subscribe Another Email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default form state
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>📧 Stay Updated</CardTitle>
        <CardDescription>
          Get our latest content and updates delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          
          {status === 'error' && message && (
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{message}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetForm}
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}