import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit'
import { EnokiFlowProvider } from '@mysten/enoki/react'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  // localnet: { url: getFullnodeUrl('localnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  // mainnet: { url: getFullnodeUrl('mainnet') },
})
const queryClient = new QueryClient()

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <EnokiFlowProvider apiKey={import.meta.env.VITE_ENOKI_PUBLIC_KEY}>
            {children}
          </EnokiFlowProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
