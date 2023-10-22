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
          <main className="container mx-auto my-16">{children}</main>
          <footer></footer>
        </>
      )}
    </>
  )
}
