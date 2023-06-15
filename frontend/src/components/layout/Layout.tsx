import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'
// import { LocalFaucetButton } from '../LocalFaucetButton'
import { Head, MetaProps } from './Head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { buttonVariants } from '../ui/button'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '../../utils/supabase'
import { ThemeSupa } from '@supabase/auth-ui-shared'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      ) : (
        <>
          <Head customMeta={customMeta} />
          <header>
            <div className="container flex items-center justify-between py-4">
              <div className="flex items-center justify-between">
                <Link className={buttonVariants({ variant: 'link' })} href="/">
                  Dashboard
                </Link>
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/wills"
                >
                  Will
                </Link>
                {/* <Link className={buttonVariants({ variant: 'link' })} href="">
                  Asset
                </Link>
                <Link className={buttonVariants({ variant: 'link' })} href="">
                  Inheritance
                </Link> */}
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/safeguard"
                >
                  Safeguard
                </Link>
              </div>
              <div className="flex items-center justify-between space-x-8">
                <small className="text-sm font-normal leading-none">
                  Hi, {session.user.email}!
                </small>
                <ConnectButton />
              </div>
            </div>
          </header>
          <main>
            <div className="container mx-auto">{children}</div>
          </main>
          <footer></footer>
        </>
      )}
    </>
  )
}
