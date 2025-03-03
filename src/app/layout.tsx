export const metadata = {
  title: 'Audio Visualizer',
  description: 'This is a simple audio visualizer built with Three.js and Web Audio API.',
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
