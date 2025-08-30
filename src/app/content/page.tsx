import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

async function getAllContentReviews() {
  const { data, error } = await supabase
    .from("tae_content_reviews")
    .select(`
      *,
      tae_creators (
        name,
        handle
      )
    `)
    .eq("tae_verdict", "recommended")
    .order("last_tested_date", { ascending: false })

  if (error) {
    console.error("Error fetching content reviews:", error)
    return []
  }

  return data?.map(item => ({
    ...item,
    creator_name: item.tae_creators?.name || "Unknown",
    creator_handle: item.tae_creators?.handle || ""
  })) || []
}

export default async function ContentPage() {
  const contentReviews = await getAllContentReviews()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">✅ "Actually Works" Tutorials</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every tutorial here has been tested by our team. No broken code, no wasted time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contentReviews.map((review) => (
          <Link key={review.id} href={`/content/${review.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {review.title}
                    </CardTitle>
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
                        {review.time_to_complete_hours}h
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
                    <span className="text-xs text-blue-600 group-hover:text-blue-800">
                      View Details →
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {contentReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No validated tutorials found.</p>
        </div>
      )}
    </main>
  )
}
