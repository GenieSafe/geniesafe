import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { Edit3 } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { config } from '../../../types/interfaces'
import { verifier } from '../../../types/interfaces'

export const getServerSideProps = (async (context: any) => {
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
    `http://localhost:3000/api/entrust?ownerUserId=${session.user.id}`
  )

  const config = await res.json()
  return { props: { config } }
}) satisfies GetServerSideProps<{
  config: config
}>

const Safeguard = ({
  config,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <div className="container flex flex-col gap-8 pb-8">
        {config.length > 0 ? (
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
                <Card className="dark">
                  <CardHeader>
                    <CardTitle className="flex justify-between text-2xl">
                      Verifiers
                      <Button size={'sm'} asChild>
                        <Link href={`/safeguard/edit/${config.ownerId}`}>
                          {/* <Link
                          href={{
                            pathname: '/safeguard/edit/[id]',
                            query: ownerId, // the data
                          }}
                        > */}
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    {config.verifiers.map(
                      (verifier: verifier, index: number) => (
                        <Card key={index} className="bg-primary">
                          <CardContent className="grid pt-6">
                            <p className="text-secondary">
                              {verifier.user?.firstName +
                                ' ' +
                                verifier.user?.lastName}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    )}
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
