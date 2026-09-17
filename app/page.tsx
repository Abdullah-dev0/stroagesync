import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <main>
      <h1>Storumi</h1>
      <p>Secure cloud storage for the files that keep your work moving.</p>
    </main>
  )
}
