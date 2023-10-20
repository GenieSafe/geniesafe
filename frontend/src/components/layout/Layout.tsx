import Link from 'next/link'
import React from 'react'
import { Head, MetaProps } from './Head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import { Button, buttonVariants } from '../ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import LoginPage from '../../pages/auth/login'

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
    }
  }

  return (
    <>
      {!session ? (
        <>
          <div className="flex items-center justify-center h-screen">
            <LoginPage />
          </div>
        </>
      ) : (
        <>
          <Head customMeta={customMeta} />
          <header>
            <div className="container grid items-center justify-between grid-cols-3 py-4">
              <div className="flex items-center justify-center">
                <Link className={buttonVariants({ variant: 'link' })} href="/">
                  Dashboard
                </Link>
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/wills"
                >
                  Will
                </Link>
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/safeguard"
                >
                  Safeguard
                </Link>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <small className="text-sm font-medium leading-none">
                  Hi, {session.user.email}!
                </small>
                <Button variant={'link'} onClick={handleSignOut}>
                  Logout
                  <LogOut className="w-4 h-4 ml-2" />
                </Button>
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
