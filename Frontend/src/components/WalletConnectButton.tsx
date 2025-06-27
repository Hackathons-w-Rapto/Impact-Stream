import React from 'react'
import { useWalletConnect } from '@/hooks/useWalletConnect'

export function WalletConnectButton() {
  const { session, connecting, error, connect, disconnect } = useWalletConnect()

  return (
    <div>
      {session ? (
        <>
          <p>Wallet connected: {session.peer.metadata.name}</p>
          <button onClick={disconnect}>Disconnect Wallet</button>
        </>
      ) : (
        <>
          <button onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        </>
      )}
    </div>
  )
}
