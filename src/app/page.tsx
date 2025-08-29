import { getCreators } from "@/lib/database"
import { CreatorCard } from "@/components/creators/creator-card"

export default async function HomePage() {
  const creators = await getCreators()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">The Agent Engineer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Curated AI engineering education resources. We test tutorials so you don't waste time on broken content.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">🎯 Recommended Creators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
    </main>
  )
}
