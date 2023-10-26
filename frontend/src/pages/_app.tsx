import type { AppProps } from 'next/app'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import {
  createPagesBrowserClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import {
  ThirdwebProvider,
  localWallet,
  metamaskWallet,
} from '@thirdweb-dev/react'
import { Sepolia } from '@thirdweb-dev/chains'
import { useState } from 'react'
import '../styles/global.css'
import { Layout } from '../components/layout/Layout'
import { Outfit } from 'next/font/google'
import { MetaMaskProvider } from '@metamask/sdk-react'

const outfit = Outfit({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  // Create a new supabase browser client on every first render
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${outfit.style.fontFamily};
        }
      `}</style>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          checkInstallationImmediately: false,
          dappMetadata: { name: 'geniesafe', url: 'http://localhost:3000', },
        }}
      >
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <ThirdwebProvider
            clientId="2a4f7795555a65af9128f029c3c2b1fc"
            activeChain={Sepolia}
            supportedWallets={[metamaskWallet(), localWallet()]}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThirdwebProvider>
        </SessionContextProvider>
      </MetaMaskProvider>
    </>
  )
}
