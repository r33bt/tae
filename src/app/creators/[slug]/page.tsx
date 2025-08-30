import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Youtube, Globe } from "lucide-react"
import Link from "next/link"

async function getCreatorBySlug(slug: string) {
  const { data, error } = await supabase
    .from("tae_creators")
    .select("*")
    .eq("is_recommended", true)

  if (error || !data) {
    console.error("Error fetching creators:", error)
    return null
  }

  const creator = data.find(c => 
    c.handle.replace('@', '').toLowerCase() === slug.toLowerCase()
  )

  return creator || null
}

async function getOfferingsForCreator(creatorId: number) {
  const { data, error } = await supabase
    .from("tae_offerings")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("is_currently_recommended", true)

  return data || []
}

async function getContentForCreator(creatorId: number) {
  const { data, error } = await supabase
    .from("tae_content_reviews")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("tae_verdict", "recommended")

  return data || []
}

export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const creator = await getCreatorBySlug(slug)
  
  if (!creator) {
    notFound()
  }

  const offerings = await getOfferingsForCreator(creator.id)
  const contentReviews = await getContentForCreator(creator.id)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Creator Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{creator.name}</h1>
            <p className="text-xl text-muted-foreground">{creator.handle}</p>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            {creator.content_quality_score}/10 Score
          </Badge>
        </div>

        {/* Creator Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About {creator.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {creator.focus_area && (
                <Badge variant="outline">{creator.focus_area}</Badge>
              )}
              {creator.target_audience && (
                <Badge variant="outline">{creator.target_audience}</Badge>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Teaching Style:</strong> {creator.teaching_style || "N/A"}</div>
              <div><strong>Content Style:</strong> {creator.content_style || "N/A"}</div>
              <div><strong>Update Frequency:</strong> {creator.update_frequency || "N/A"}</div>
              <div><strong>Target Audience:</strong> {creator.target_audience || "N/A"}</div>
            </div>

            {creator.review_summary && (
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <p className="italic text-blue-800">"{creator.review_summary}"</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {creator.youtube_url && (
                <Button asChild>
                  <a href={creator.youtube_url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube Channel
                  </a>
                </Button>
              )}
              
              {creator.website_url && (
                <Button variant="outline" asChild>
                  <a href={creator.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-blue-600">{offerings.length}</div>
              <div className="text-sm text-muted-foreground">Offerings</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-green-600">{contentReviews.length}</div>
              <div className="text-sm text-muted-foreground">Validated Tutorials</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-purple-600">{creator.content_quality_score}/10</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <div className="text-2xl font-bold text-orange-600">
                {creator.is_recommended ? '✅' : '❌'}
              </div>
              <div className="text-sm text-muted-foreground">Recommended</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Validated Content */}
      {contentReviews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            ✅ Validated Tutorials 
            <Badge variant="secondary" className="ml-3">{contentReviews.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contentReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{review.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{review.content_type}</Badge>
                    <Badge variant={
                      review.difficulty === "Easy" ? "default" : 
                      review.difficulty === "Medium" ? "secondary" : "destructive"
                    }>
                      {review.difficulty}
                    </Badge>
                    {review.time_to_complete_hours && (
                      <Badge variant="outline">
                        {review.time_to_complete_hours}h to complete
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.key_benefit && (
                      <p className="text-sm">
                        <strong className="text-green-700">Key Benefit:</strong> {review.key_benefit}
                      </p>
                    )}
                    
                    {review.tester_notes && (
                      <p className="text-xs text-muted-foreground italic bg-gray-50 p-2 rounded">
                        <strong>TAE Notes:</strong> {review.tester_notes}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Tested: {new Date(review.last_tested_date).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <a href={review.url} target="_blank" rel="noopener noreferrer">
                          Watch Tutorial →
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Offerings */}
      {offerings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            💎 {creator.name}'s Offerings
            <Badge variant="secondary" className="ml-3">{offerings.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {offerings.map((offering) => (
              <Card key={offering.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{offering.title}</CardTitle>
                      <CardDescription className="capitalize">{offering.type}</CardDescription>
                    </div>
                    {offering.tae_rating && (
                      <Badge variant="default">
                        {offering.tae_rating}/5 ⭐
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">{offering.type}</Badge>
                      {offering.price_monthly && (
                        <Badge variant="secondary">${offering.price_monthly}/mo</Badge>
                      )}
                      {offering.price_yearly && (
                        <Badge variant="secondary">${offering.price_yearly}/yr</Badge>
                      )}
                      {offering.type === 'free_content' && (
                        <Badge className="bg-green-600">FREE</Badge>
                      )}
                    </div>
                    
                    {offering.value_proposition && (
                      <p className="text-sm text-muted-foreground">
                        {offering.value_proposition}
                      </p>
                    )}
                    
                    {offering.best_for && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Best for:</strong> {offering.best_for}
                      </p>
                    )}

                    {offering.member_count && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Members:</strong> {offering.member_count.toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Back Navigation */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg" asChild>
          <Link href="/">← Back to All Creators</Link>
        </Button>
      </div>
    </main>
  )
}
