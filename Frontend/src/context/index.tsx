'use client'

import { wagmiAdapter, } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

export const projectId = 'b6d6d27f4516676b4ba075bad7b0afe4' // Replace with your actual project ID

const metaData = {
  name: 'Impact Stream',
  description:
    'Impact Stream is a platform that allows users to track and verify the impact of their contributions to various causes.',
  url: 'https://impactstream.com',
}

const Modal = createAppKit({
  projectId,
  networks: [mainnet, arbitrum],
  metadata: metaData,
  adapters: [wagmiAdapter],
  features: {
    analytics: true,
    email: true,
    social: ['google', 'github', 'farcaster', 'twitter'],
    emailShowWaller: true,
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
