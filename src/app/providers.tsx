// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider style={{ height: '100vh', position: 'fixed' }}>
      {children}
    </NextUIProvider>
  )
}