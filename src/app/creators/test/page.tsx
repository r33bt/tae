export default function TestCreatorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Static Test Route Works!</h1>
      <p>If you can see this at /creators/test, then basic routing is working.</p>
      <p>The issue is with the dynamic [slug] route specifically.</p>
    </main>
  )
}
