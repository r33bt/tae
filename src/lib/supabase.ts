import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for our specific use cases
export const getCreators = async () => {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('is_recommended', true)
    .order('content_quality_score', { ascending: false })
  
  if (error) throw error
  return data
}

export const getCreatorBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      offerings:offerings(*),
      content_reviews:content_reviews(*)
    `)
    .eq('handle', slug)
    .single()
  
  if (error) throw error
  return data
}

export const getRecommendedContent = async () => {
  const { data, error } = await supabase
    .from('content_reviews')
    .select(`
      *,
      creator:creators(name, handle)
    `)
    .eq('tae_verdict', 'recommended')
    .order('last_tested_date', { ascending: false })
    .limit(10)
  
  if (error) throw error
  return data
}
