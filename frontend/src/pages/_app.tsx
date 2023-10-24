import type { AppProps } from 'next/app'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import {
  createPagesBrowserClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import '../styles/global.css'
import { Layout } from '../components/layout/Layout'
import { Outfit} from 'next/font/google'

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
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </>
  )
}
