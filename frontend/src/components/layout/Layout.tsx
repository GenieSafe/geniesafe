import React from 'react'
import { Head, MetaProps } from './Head'
import { useSession } from '@supabase/auth-helpers-react'

import LoginPage from '../../pages/auth/login'
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
            <LoginPage />
          </div>
        </>
      ) : (
        <>
          <Head customMeta={customMeta} />
          <header>
            <Navbar />
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
