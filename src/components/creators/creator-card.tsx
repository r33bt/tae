import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Youtube, Globe } from "lucide-react"
import Link from "next/link"
import type { Creator } from "@/types"

interface CreatorCardProps {
  creator: Creator
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const creatorSlug = creator.handle.replace('@', '').toLowerCase()
  
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/creators/${creatorSlug}`} className="hover:text-blue-600 transition-colors">
              <CardTitle className="text-xl">
                {creator.name}
              </CardTitle>
            </Link>
            <CardDescription className="text-sm opacity-70">
              {creator.handle}
            </CardDescription>
          </div>
          <Badge variant={creator.is_recommended ? "default" : "secondary"}>
            Score: {creator.content_quality_score || "N/A"}/10
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {creator.focus_area && (
              <Badge variant="outline">{creator.focus_area}</Badge>
            )}
            {creator.target_audience && (
              <Badge variant="outline">{creator.target_audience}</Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong>Teaching Style:</strong> {creator.teaching_style || "N/A"}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <strong>Updates:</strong> {creator.update_frequency || "N/A"}
          </div>
        </div>

        {creator.review_summary && (
          <p className="text-sm text-muted-foreground italic">
            "{creator.review_summary}"
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {creator.youtube_url && (
            <Button size="sm" variant="outline" asChild>
              <a href={creator.youtube_url} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-1" />
                YouTube
              </a>
            </Button>
          )}
          
          {creator.website_url && (
            <Button size="sm" variant="outline" asChild>
              <a href={creator.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-1" />
                Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
