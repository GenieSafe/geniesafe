import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { CheckCircle2, Edit3, XCircle } from 'lucide-react'

import { Button } from '../../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'

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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-primary-foreground">
                  Verifiers
                </CardTitle>
                <Button size={'icon'} variant={'secondary'} asChild>
                  <Link href={`/safeguard/edit/${data.id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="flex gap-4">
                {data.verifiers.map((verifier: any, index: number) => (
                  <Card key={index} className="">
                    <CardContent className="flex items-center gap-6 pt-6">
                      <div className="flex flex-col w-24">
                        <p className="text-lg font-semibold truncate">
                          {verifier.profiles.first_name}{' '}
                          {verifier.profiles.last_name}
                        </p>
                        <p className="truncate">
                          {verifier.profiles.wallet_address}
                        </p>
                      </div>
                      {verifier.has_verified ? (
                        <CheckCircle2 className="text-success"></CheckCircle2>
                      ) : (
                        <XCircle className="text-destructive"></XCircle>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button>Notify Verifiers</Button>
            </div>
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
              <Link href="/safeguard/assign">Assign Verifiers</Link>
            </Button>
          </>
        )}
      </div>
    </>
  )
}
