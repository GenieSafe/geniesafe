import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

import { Button } from '../../components/ui/button'
import SafeguardCard from '../../components/SafeguardCard'

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
  const { data: config_data, error: config_error } = await supabase
    .from('wallet_recovery_config')
    .select(
      `
    id, status,
    verifiers(has_verified, verified_at, profiles(first_name, last_name, wallet_address))
  `
    )
    .eq('user_id', session.user.id)
    .single()

  return {
    props: {
      initialSession: session,
      data: config_data,
    },
  }
}

export default function Config({ data }: { data: any }) {
  const supabase = useSupabaseClient()
  const [privateKey, setPrivateKey] = useState<string | null>('' as string)

  async function getPrivateKey(id: string) {
    const { data, error } = await supabase.rpc('get_private_key', {
      in_config_id: id,
    })

    if (!error) {
      setPrivateKey(data)
    } else {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data !== null) {
      if (data.status == 'VERIFIED') getPrivateKey(data.id)
    }
  })

  return (
    <>
      <div className="flex flex-col gap-8">
        {data ? (
          <>
            <div className="flex flex-col gap-4 pb-4">
              <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
                Recover your wallet
              </h1>
              <p className="leading-7">
                Lost access to your wallet? Notify your verifiers to verify your
                identity and we'll send you your private key.
              </p>
            </div>
            <SafeguardCard
              config={data}
              privateKey={privateKey}
            ></SafeguardCard>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
              It seems like you don't have safeguard set up for now.
            </h1>
            <p className="leading-7">
              Worry you might lose access to your private key? Assign trusted
              verifiers to help safeguard your private key.
            </p>
            <Button asChild className="self-start" size={'lg'}>
              <Link href="/safeguard/assign">Assign verifiers</Link>
            </Button>
          </>
        )}
      </div>
    </>
  )
}
