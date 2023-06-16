import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'
// import { LocalFaucetButton } from '../LocalFaucetButton'
import { Head, MetaProps } from './Head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '../../utils/supabase'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { Button, buttonVariants } from '../ui/button'
import { LogOut } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()
  const supabase = useSupabaseClient()
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      // Redirect or perform additional actions after signout
    }
  }
  
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
              <div className="flex items-center justify-between space-x-4">
                <small className="text-sm font-medium leading-none">
                  Hi, {session.user.email}!
                </small>
                <Button variant={'ghost'} onClick={handleSignOut} >
                  Logout
                  <LogOut className="w-4 h-4 ml-2" />
                </Button>
                <ConnectButton />
              </div>
            </div>
          </header>
          <main>
            <div className="container mx-auto my-12">{children}</div>
          </main>
          <footer></footer>
        </>
      )}
    </>
  )
}
