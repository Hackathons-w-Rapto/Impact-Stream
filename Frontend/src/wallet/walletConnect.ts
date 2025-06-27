import { Core } from '@walletconnect/core'
import { WalletKit } from '@reown/walletkit'

const core = new Core({
  projectId: 'b6d6d27f4516676b4ba075bad7b0afe4' 
})

const metadata = {
  name: 'ImpactStream',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

export const walletKit = WalletKit.init({
  core,
  metadata
})
