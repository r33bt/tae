import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header, Footer } from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Agent Engineer - Curated AI Engineering Resources",
  description: "We test AI tutorials so you don't waste time on broken content. Quality-first curation of AI engineering education.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
