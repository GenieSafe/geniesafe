import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'
// import { LocalFaucetButton } from '../LocalFaucetButton'
import { Head, MetaProps } from './Head'
import { useSession } from '@supabase/auth-helpers-react'
import { Button } from '../ui/button'
import { buttonVariants } from '../ui/button'


interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center justify-between">
            <Link className={buttonVariants({ variant: 'link' })} href="">
              Dashboard
            </Link>
            <Link className={buttonVariants({ variant: 'link' })} href="">
              Will
            </Link>
            <Link className={buttonVariants({ variant: 'link' })} href="">
              Asset
            </Link>
            <Link className={buttonVariants({ variant: 'link' })} href="">
              Inheritance
            </Link>
            <Link className={buttonVariants({ variant: 'link' })} href="">
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
  )
}
