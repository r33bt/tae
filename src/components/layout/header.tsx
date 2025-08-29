import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            TAE
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Creators
            </Link>
            <Link href="/content" className="text-sm font-medium hover:underline">
              Tutorials
            </Link>
            <Link href="/communities" className="text-sm font-medium hover:underline">
              Communities
            </Link>
          </nav>
          
          <Button size="sm">
            Submit Review
          </Button>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2024 The Agent Engineer. Curating quality AI education resources.</p>
          <p className="mt-2">
            Have a creator or tutorial to suggest? <Button variant="link" className="p-0 h-auto">Let us know</Button>
          </p>
        </div>
      </div>
    </footer>
  )
}
