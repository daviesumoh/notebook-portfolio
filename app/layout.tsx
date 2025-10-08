import type React from "react"
import type { Metadata } from "next"
import { Kalam, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const scriptFont = Kalam({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["300", "400", "700"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Davies Umoh",
  description: "Davies Umoh's portfolio and field notes as a Product Manager focused on ML & Data Infrastructure.",
  generator: "Davies Umoh",
  openGraph: {
    title: "Davies Umoh",
    description: "Product Manager focused on ML & Data Infrastructure. Co-Founder of MockQ & GitCloud.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1770144940187%20%281%29-fhiVAXs3ZFVKVxtg0oy7xCFlQLV4h2.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${scriptFont.variable} ${jetbrainsMono.variable} ${jakarta.variable} w-full h-full`}>
      <body className="font-script antialiased text-[#181824] bg-[#FAF7F0] selection:bg-[#FDE68A] selection:text-[#78350F] m-0 p-0 overflow-hidden w-full h-full text-xl leading-[32px]">
        {children}
      </body>
    </html>
  )
}

// SEO metadata configuration
