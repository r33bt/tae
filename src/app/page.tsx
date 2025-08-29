import { getCreators, getAllOfferings } from "@/lib/database"
import { CreatorCard } from "@/components/creators/creator-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"

async function getLatestContentReviews() {
  const { supabase } = await import("@/lib/supabase")
  const { data, error } = await supabase
    .from("tae_content_reviews")
    .select(`
      *,
      tae_creators (
        name
      )
    `)
    .eq("tae_verdict", "recommended")
    .order("last_tested_date", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching content reviews:", error)
    return []
  }

  return data?.map(item => ({
    ...item,
    creator_name: item.tae_creators?.name || "Unknown"
  })) || []
}

export default async function HomePage() {
  const creators = await getCreators()
  const offerings = await getAllOfferings()
  const contentReviews = await getLatestContentReviews()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">The Agent Engineer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Curated AI engineering education resources. We test tutorials so you don't waste time on broken content.
        </p>
      </div>

      {/* Creators Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">🎯 Recommended Creators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>

      {/* Content Reviews Section - NEW */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">✅ "Actually Works" Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {contentReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{review.title}</CardTitle>
                    <CardDescription>by {review.creator_name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Works</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{review.content_type}</Badge>
                    <Badge variant={
                      review.difficulty === "Easy" ? "default" : 
                      review.difficulty === "Medium" ? "secondary" : "destructive"
                    }>
                      {review.difficulty}
                    </Badge>
                    {review.time_to_complete_hours && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {review.time_to_complete_hours}h to complete
                      </Badge>
                    )}
                  </div>
                  
                  {review.key_benefit && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Key Benefit:</strong> {review.key_benefit}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Tested: {new Date(review.last_tested_date).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={review.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Watch
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Offerings Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">💎 Top Communities & Courses</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {offerings.slice(0, 6).map((offering) => (
            <Card key={offering.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{offering.title}</CardTitle>
                    <CardDescription>by {offering.creator_name}</CardDescription>
                  </div>
                  <Badge>
                    {offering.tae_rating}/5 ⭐
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{offering.type}</Badge>
                    {offering.price_monthly && (
                      <Badge variant="secondary">
                        ${offering.price_monthly}/mo
                      </Badge>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>✅ "Actually Works" Promise</CardTitle>
            <CardDescription>
              Every tutorial we recommend has been tested by our team. No more wasted hours on broken code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Join our community for weekly updates on validated AI engineering content.
            </p>
            <Button size="lg">
              Get Weekly Updates
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
