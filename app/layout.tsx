import './globals.css'

export const metadata = {
  title: 'Translation Converter | TS ↔ Excel',
  description: 'Convert TypeScript translation files to Excel and back with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
