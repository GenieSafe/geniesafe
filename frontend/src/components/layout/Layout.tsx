import React from 'react'
import { Head, MetaProps } from './Head'
import { useSession } from '@supabase/auth-helpers-react'

import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()

  return (
    <>
      {!session ? (
        <>
          <Head customMeta={customMeta} />
          <div className="flex items-center justify-center h-screen">
            {children}
          </div>
        </>
      ) : (
        <>
          <Head customMeta={customMeta} />
          <header>
            <Navbar />
          </header>
          <main className="container px-40 py-16 mx-auto">{children}</main>
          <footer></footer>
        </>
      )}
    </>
  )
}
