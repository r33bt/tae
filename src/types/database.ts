// Core database types based on our schema
export interface Creator {
  id: number
  name: string
  handle: string
  website_url?: string
  youtube_url?: string
  primary_social_url?: string
  subscriber_count?: number
  focus_area?: string
  target_audience?: string
  content_style?: string
  content_quality_score?: number
  teaching_style?: string
  update_frequency?: string
  is_recommended: boolean
  last_reviewed?: string
  review_summary?: string
}

export interface Offering {
  id: number
  creator_id: number
  title: string
  type: 'community' | 'course' | 'newsletter' | 'free_content'
  join_url?: string
  price_monthly?: number
  price_yearly?: number
  trial_available: boolean
  refund_policy?: string
  requires_application: boolean
  waitlist_status: boolean
  member_count?: number
  tae_rating?: number
  value_proposition?: string
  best_for?: string
  pros?: string[]
  cons?: string[]
  worth_it_verdict?: string
  affiliate_link?: string
  our_affiliate_rate?: number
  is_currently_recommended: boolean
  last_reviewed?: string
  creator?: Creator
}

export interface ContentReview {
  id: number
  creator_id: number
  title: string
  url: string
  content_type: 'tutorial' | 'review' | 'explainer'
  duration_minutes?: number
  published_date?: string
  actually_works?: boolean
  difficulty: 'Easy' | 'Medium' | 'Hard'
  time_to_complete_hours?: number
  prerequisites?: string
  common_issues?: string
  key_benefit?: string
  updated_recently: boolean
  tae_verdict: 'recommended' | 'skip' | 'outdated'
  last_tested_date?: string
  tester_notes?: string
  creator?: Creator
}

export interface UserFeedback {
  id: number
  content_type: 'creator' | 'offering' | 'content'
  content_id: number
  rating: number
  feedback_text?: string
  helpful_votes: number
  email?: string
  created_at: string
  is_verified: boolean
}
