'use client'

import { wagmiAdapter, } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, base,  } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

export const projectId = 'b6d6d27f4516676b4ba075bad7b0afe4' // Replace with your actual project ID

const anvil = {
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: ['http://localhost:8545'] 
    },
    public: { 
      http: ['http://localhost:8545'] 
    },
  },
  testnet: true
}

const metaData = {
  name: 'Impact Stream',
  description:
    'Impact Stream is a platform that allows users to track and verify the impact of their contributions to various causes.',
  // url: 'https://impactstream.com',
  // icons: ['https://impactstream.com/icon.png'], 
}

const Modal = createAppKit({
  projectId,
  networks: [mainnet, anvil],
  metadata: metaData,
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'farcaster', 'x'],
    emailShowWallets: true,
  },
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider;
