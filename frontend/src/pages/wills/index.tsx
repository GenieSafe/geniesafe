import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'

import { will } from '../../../types/interfaces'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
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

  // Run queries with RLS on the server
  const { data, error } = await supabase.from('wills').select(`
    id, title, contract_address, deployed_at_block, status,
    beneficiaries(percentage, metadata:user_id(first_name, last_name, wallet_address)),
    validators(has_validated, metadata:user_id(first_name, last_name, wallet_address))
  `)

  return {
    props: {
      initialSession: session,
      data: data ?? error,
    },
  }
}

export default function Wills({ data }: { data: any }) {
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
        {data.length ? (
          data.map((will: will) => <WillCard key={will.id} will={will} />)
        ) : (
          <p className="text-2xl font-bold">No wills found.</p>
        )}
      </div>
    </>
  )
}
