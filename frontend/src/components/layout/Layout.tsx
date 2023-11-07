import React, { useEffect, useState } from 'react'
import { Head, MetaProps } from './Head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [name, setName] = useState({ first_name: '', last_name: '' })

  useEffect(() => {
    async function fetchName() {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session?.user.id)
        .single()

      if (!error) {
        setName(data)
      } else {
        setName({ first_name: 'User', last_name: '' })
      }
    }
    fetchName()
  }, [])

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
            <Navbar name={`${name.first_name} ${name.last_name}`} />
          </header>
          <main className="container px-40 py-16 mx-auto">{children}</main>
          <footer></footer>
        </>
      )}
    </>
  )
}
