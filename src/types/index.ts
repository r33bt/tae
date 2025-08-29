export interface Creator {
  id: number
  name: string
  handle: string
  website_url?: string
  youtube_url?: string
  focus_area?: string
  target_audience?: string
  content_quality_score?: number
  teaching_style?: string
  update_frequency?: string
  is_recommended: boolean
  review_summary?: string
}

export interface Offering {
  id: number
  creator_id: number
  title: string
  type: "community" | "course" | "newsletter" | "free_content"
  price_monthly?: number
  price_yearly?: number
  tae_rating?: number
  value_proposition?: string
  best_for?: string
  is_currently_recommended: boolean
  member_count?: number
}

export interface ContentReview {
  id: number
  creator_id: number
  title: string
  url: string
  content_type: "tutorial" | "review" | "explainer"
  duration_minutes?: number
  actually_works?: boolean
  difficulty?: "Easy" | "Medium" | "Hard"
  time_to_complete_hours?: number
  key_benefit?: string
  tae_verdict: "recommended" | "skip" | "outdated"
  last_tested_date?: string
}
