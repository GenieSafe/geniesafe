import Link from 'next/link'
import {
  GetServerSidePropsContext,
} from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Edit3 } from 'lucide-react'

import { Button } from '../../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'

import { verifier } from '../../../types/interfaces'

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
  const { data, error } = await supabase.from('wallet_recovery_config').select(`
    id, status,
    verifiers(has_verified, verified_at, profile:user_id(first_name, last_name, wallet_address))
  `)

  return {
    props: {
      initialSession: session,
      data: data ?? error,
    },
  }
}

const Safeguard = ({ data }: { data: any }) => {
  return (
    <>
      <div className="container flex flex-col gap-8 pb-8">
        {data ? (
          <>
            <div className="container pb-8">
              <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
                  Recover your wallet
                </h1>
                <p className="mb-4 leading-7">
                  Lost access to your wallet? Notify your Verifiers to verify
                  your identity and we'll send you your private key.
                </p>
              </div>
              <div className="grid gap-8">
                <Card className="bg-primary">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl text-primary-foreground">Verifiers</CardTitle>
                    <Button size={'icon'} variant={"secondary"} asChild>
                      <Link href={`/safeguard/edit/${data.user_id}`}>
                        {/* <Link
                          href={{
                            pathname: '/safeguard/edit/[id]',
                            query: ownerId, // the data
                          }}
                        > */}
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    {data[0].verifiers.map((verifier: verifier) => (
                      <Card key={verifier.id} className="">
                        <CardContent className="grid pt-6">
                          <p className="">
                            {verifier.profile.first_name +
                              ' ' +
                              verifier.profile.last_name}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="grid justify-end py-8">
                <Button size={'lg'}>Notify Verifiers</Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
              It seems like you don't have any wallet recovery method for now.
            </h1>
            <p className="leading-7">
              Worry you might lose access to your private key? Assign trusted
              Verifiers to help safeguard your private key.
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

export default Safeguard
