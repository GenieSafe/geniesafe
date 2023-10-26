import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'

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
  const { data, error } = await supabase
    .from('wills')
    .select(
      `
    id, title, contract_address, deployed_at_block, status,
    beneficiaries(percentage, metadata:user_id(first_name, last_name, wallet_address)),
    validators(has_validated, metadata:user_id(first_name, last_name, wallet_address))
  `
    )
    .eq('user_id', session.user.id)
    .single()

  return {
    props: {
      initialSession: session,
      data: data,
    },
  }
}

export default function Wills({ data }: { data: any }) {
  console.log(data)
  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
          Your Will
        </h1>
        {!data && (
          <Button asChild>
            <Link href="/wills/create">
              <Plus className="w-4 h-4 mr-2" />
              Create new will
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-16">
        {data ? (
          <WillCard will={data} />
        ) : (
          <p className="text-2xl font-bold text-center">No will found</p>
        )}
      </div>
    </>
  )
}
