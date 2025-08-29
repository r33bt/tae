import { supabase } from "./supabase"
import type { Creator, Offering, ContentReview } from "@/types"

export async function getCreators(): Promise<Creator[]> {
  const { data, error } = await supabase
    .from("tae_creators")
    .select("*")
    .eq("is_recommended", true)
    .order("name")

  if (error) {
    console.error("Error fetching creators:", error)
    return []
  }

  return data || []
}

export async function getCreatorById(id: number): Promise<Creator | null> {
  const { data, error } = await supabase
    .from("tae_creators")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching creator:", error)
    return null
  }

  return data
}

export async function getOfferingsByCreatorId(creatorId: number): Promise<Offering[]> {
  const { data, error } = await supabase
    .from("tae_offerings")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("is_currently_recommended", true)
    .order("title")

  if (error) {
    console.error("Error fetching offerings:", error)
    return []
  }

  return data || []
}

export async function getContentReviewsByCreatorId(creatorId: number): Promise<ContentReview[]> {
  const { data, error } = await supabase
    .from("tae_content_reviews")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("tae_verdict", "recommended")
    .order("last_tested_date", { ascending: false })

  if (error) {
    console.error("Error fetching content reviews:", error)
    return []
  }

  return data || []
}

export async function getAllOfferings(): Promise<(Offering & { creator_name: string })[]> {
  const { data, error } = await supabase
    .from("tae_offerings")
    .select(`
      *,
      tae_creators (
        name
      )
    `)
    .eq("is_currently_recommended", true)
    .order("tae_rating", { ascending: false })

  if (error) {
    console.error("Error fetching all offerings:", error)
    return []
  }

  return data?.map(item => ({
    ...item,
    creator_name: item.tae_creators?.name || "Unknown"
  })) || []
}
