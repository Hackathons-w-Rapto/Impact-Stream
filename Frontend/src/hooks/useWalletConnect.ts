// src/hooks/useWalletConnect.ts
import { useState } from 'react'
import { walletKit } from '@/wallet/walletConnect'

export function useWalletConnect() {
  const [session, setSession] = useState(null)
  const [error, setError] = useState<Error | null>(null)

  async function connect() {
    try {
      const newSession = await walletKit.connect()
      setSession(newSession)
      setError(null)
    } catch (err) {
      setError(err as Error)
    }
  }

  async function disconnect() {
    await walletKit.disconnect()
    setSession(null)
  }

  return { session, error, connect, disconnect }
}
