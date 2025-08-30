import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ExternalLink, AlertTriangle, Calendar, User } from "lucide-react"
import Link from "next/link"
import { FeedbackForm } from "@/components/feedback/feedback-form"

async function getContentReviewById(id: string) {
  const { data, error } = await supabase
    .from("tae_content_reviews")
    .select(`
      *,
      tae_creators (
        name,
        handle,
        youtube_url
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching content review:", error)
    return null
  }

  return {
    ...data,
    creator_name: data.tae_creators?.name || "Unknown",
    creator_handle: data.tae_creators?.handle || "",
    creator_youtube: data.tae_creators?.youtube_url || ""
  }
}

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const review = await getContentReviewById(id)

  
  if (!review) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{review.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>by {review.creator_name}</span>
              </div>
              {review.published_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Published: {new Date(review.published_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <Badge variant="default" className="bg-green-600">
              ✅ Actually Works
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tutorial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tutorial Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{review.content_type}</Badge>
                <Badge variant={
                  review.difficulty === "Easy" ? "default" : 
                  review.difficulty === "Medium" ? "secondary" : "destructive"
                }>
                  {review.difficulty} Difficulty
                </Badge>
                {review.duration_minutes && (
                  <Badge variant="outline">
                    {review.duration_minutes} min video
                  </Badge>
                )}
                {review.time_to_complete_hours && (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {review.time_to_complete_hours}h to complete
                  </Badge>
                )}
              </div>

              {review.key_benefit && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Key Benefit</h4>
                  <p className="text-green-700">{review.key_benefit}</p>
                </div>
              )}

              {review.prerequisites && (
                <div>
                  <h4 className="font-semibold mb-2">Prerequisites</h4>
                  <p className="text-muted-foreground">{review.prerequisites}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* TAE Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>TAE Analysis & Testing</CardTitle>
              <CardDescription>
                Our team tested this tutorial on {new Date(review.last_tested_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-800">Actually Works</div>
                  <div className="text-xs text-green-600">Verified ✅</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {review.difficulty}
                  </div>
                  <div className="text-sm text-blue-800">Difficulty Level</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {review.time_to_complete_hours || "N/A"}h
                  </div>
                  <div className="text-sm text-purple-800">Time Investment</div>
                </div>
              </div>

              {review.tester_notes && (
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    TAE Team Notes
                  </h4>
                  <p className="text-muted-foreground italic">"{review.tester_notes}"</p>
                </div>
              )}

              {review.common_issues && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Common Issues to Watch For
                  </h4>
                  <p className="text-yellow-700">{review.common_issues}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="lg" className="w-full" asChild>
                <a href={review.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch Tutorial
                </a>
              </Button>
              
              {review.creator_youtube && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={review.creator_youtube} target="_blank" rel="noopener noreferrer">
                    Visit {review.creator_name}'s Channel
                  </a>
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/creators/${review.creator_handle.replace('@', '').toLowerCase()}`}>
                  View Creator Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tutorial Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Tutorial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator:</span>
                <span className="font-medium">{review.creator_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{review.content_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium">{review.difficulty}</span>
              </div>
              {review.duration_minutes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Video Length:</span>
                  <span className="font-medium">{review.duration_minutes} minutes</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Tested:</span>
                <span className="font-medium">{new Date(review.last_tested_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TAE Status:</span>
                <Badge variant="default" className="bg-green-600">
                  {review.tae_verdict}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Feedback Section */}
      <section className="mt-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <FeedbackForm 
            contentType="content"
            contentId={review.id}
            contentTitle={review.title}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Community Feedback</CardTitle>
              <CardDescription>
                What others are saying about this tutorial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Be the first to leave feedback on this tutorial!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Back Navigation */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg" asChild>
          <Link href="/content">← Back to All Tutorials</Link>
        </Button>
      </div>
    </main>
  )
}
