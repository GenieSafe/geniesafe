import Link from 'next/link'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'

import { will } from '../../../types/interfaces'

export const getServerSideProps = (async (context) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(context)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }

  const res = await fetch(
    `http://localhost:3000/api/will?ownerUserId=${session.user.id}`
  )
  
  const wills = await res.json()
  return { props: { wills } }
  
}) satisfies GetServerSideProps<{
  wills: will[]
}>

export default function Wills({
  wills,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="container flex items-center justify-between pb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
          Your Wills
        </h1>
        <Button variant={'outline'} className="dark" asChild>
          <Link href="/wills/create">
            <Plus className="w-4 h-4 mr-2" />
            Create new will
          </Link>
        </Button>
      </div>
      <div className="container flex flex-col space-y-4">
        {wills.length ? (
          wills.map((will: will) => <WillCard key={will.id} will={will} />)
        ) : (
          <p className="text-2xl font-bold">No wills found.</p>
        )}
      </div>
    </>
  )
}
