import { getCreators } from "@/lib/database"
import { CreatorCard } from "@/components/creators/creator-card"

export default async function CreatorsPage() {
  const creators = await getCreators()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">AI Engineering Creators</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Curated creators we recommend for learning AI engineering. All creators are vetted for quality and teaching effectiveness.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </main>
  )
}
