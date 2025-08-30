"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, MessageSquare } from "lucide-react"

interface FeedbackFormProps {
  contentType: "creator" | "content" | "offering" | "general"
  contentId?: number
  contentTitle?: string
}

export function FeedbackForm({ contentType, contentId, contentTitle }: FeedbackFormProps) {
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !feedbackText.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          rating,
          feedback_text: feedbackText,
          email: email || null
        })
      })

      if (response.ok) {
        setSubmitted(true)
        // Reset form
        setEmail("")
        setRating(null)
        setFeedbackText("")
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for your feedback!</h3>
          <p className="text-green-700">Your input helps us maintain quality recommendations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          {contentTitle ? `Help others by reviewing: ${contentTitle}` : 'Help us improve our recommendations'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              How would you rate this {contentType}? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 rounded ${
                    rating && rating >= star
                      ? 'bg-yellow-400 text-yellow-800'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating && (
              <p className="text-xs text-muted-foreground mt-1">
                {rating === 1 && "Poor - Would not recommend"}
                {rating === 2 && "Fair - Has some issues"}
                {rating === 3 && "Good - Decent quality"}
                {rating === 4 && "Very Good - High quality"}
                {rating === 5 && "Excellent - Highly recommend"}
              </p>
            )}
          </div>

          {/* Feedback Text */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Your feedback *
            </label>
            <Textarea
              placeholder="Share your experience... Did it work as expected? Any issues you encountered? What did you learn?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
              rows={4}
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Email (optional)
            </label>
            <Input
              type="email"
              placeholder="your@email.com (for follow-up questions)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!rating || !feedbackText.trim() || loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
