import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import '../../styles/global.css'
import { Layout } from '../components/layout/Layout'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ''

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.localhost]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
)

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
})

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
}

const connectors = connectorsForWallets(wallets)
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export default function App({ Component, pageProps }: AppProps) {
  // Create a new supabase browser client on every first render
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={demoAppInfo}
          chains={chains}
          theme={midnightTheme({
            borderRadius: 'small',
            fontStack: 'system',
          })}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionContextProvider>
  )
}
