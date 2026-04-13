export const metadata = {
  title: 'Crack Academy',
  description: 'La app de entrenamiento de tu hijo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
