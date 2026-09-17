import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@/app/globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { siteUrl } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Storumi — Secure Cloud Storage for Your Files",
    template: "%s | Storumi",
  },
  description:
    "Store, organize, access, and share your files securely from one simple cloud workspace.",
  applicationName: "Storumi",
  keywords: [
    "cloud storage",
    "secure file storage",
    "file sharing",
    "online file storage",
    "file organization",
  ],
  authors: [{ name: "Storumi", url: siteUrl }],
  creator: "Storumi",
  publisher: "Storumi",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Storumi",
    title: "Storumi — Secure Cloud Storage for Your Files",
    description:
      "Store, organize, access, and share your files securely from one simple cloud workspace.",
  },
  twitter: {
    card: "summary",
    title: "Storumi — Secure Cloud Storage for Your Files",
    description:
      "Store, organize, access, and share your files securely from one simple cloud workspace.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
