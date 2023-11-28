import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Database } from '@/lib/database.types'
import Login from '@/pages/auth/login'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import SafeguardVerifiedEmail from '@/../emails/SafeguardVerifiedEmail'
import { render } from '@react-email/components'
import { sendMail } from '@/lib/emailHelper'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const configId = ctx.query.config_id
  const verifierId = ctx.query.verifier_id

  const supabase = createPagesServerClient(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  const { data: config, error: getConfigError } = await supabase
    .from('wallet_recovery_config')
    .select(`id, status, profiles(id, email, first_name, last_name)`)
    .eq('id', configId)
    .single()

  const { data: verifier, error: getVerifierError } = await supabase
    .from('verifiers')
    .select(
      `id, has_verified, verified_at, profiles(id, first_name, last_name)`
    )
    .eq('id', verifierId)
    .single()

  return {
    props: {
      config: config,
      verifier: verifier,
    },
  }
}

export default function VerificationPage({
  config,
  verifier,
}: {
  config: any
  verifier: any
}) {
  const session = useSession()

  if (!session) return <Login />

  const supabase = useSupabaseClient<Database>()
  const [isFallbackInterface, setIsFallbackInterface] = useState(false)
  const [isErrorInterface, setIsErrorInterface] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!config || !verifier || verifier.profiles.id !== session.user.id) {
      setIsFallbackInterface(true)
      setIsErrorInterface(true)
    }
  })

  async function onIgnore() {
    try {
      setIsLoading(true)

      // Update config status to inactive
      console.info('Ignoring request. Updating config status')
      const { data: newConfigStatus, error: updateConfigStatusError } =
        await supabase
          .from('wallet_recovery_config')
          .update({ status: 'INACTIVE' })
          .eq('id', config.id)

      if (updateConfigStatusError) {
        throw new Error(`${updateConfigStatusError}`)
      }

      toast({
        title: 'Ignored',
        description: `Successfully ignored request`,
        variant: 'success',
      })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Error',
        description: `${e}`,
        variant: 'destructive',
      })
      setIsErrorInterface(true)
    } finally {
      setIsLoading(false)
      setIsFallbackInterface(true)
    }
  }

  async function onVerify() {
    try {
      setIsLoading(true)

      console.info('Updating verifier status')
      const { data: newVerifierStatus, error: updateVerifierStatusError } =
        await supabase
          .from('verifiers')
          .update({ has_verified: true, verified_at: new Date().toISOString() })
          .eq('id', verifier.id)
          .single()

      if (updateVerifierStatusError) {
        throw new Error(`${updateVerifierStatusError}`)
        console.error(updateVerifierStatusError)
      }

      // Get not verified count
      console.info('Getting not verified count')
      const { count: unverifiedCount, error: getUnverifiedCountError } =
        await supabase
          .from('verifiers')
          .select('has_verified', { count: 'exact', head: true })
          .eq('config_id', config.id)
          .eq('has_verified', false)

      if (getUnverifiedCountError) {
        throw new Error(`${getUnverifiedCountError}`)
      }

      if (unverifiedCount === 0) {
        // Update config status to verified
        console.info('Verification completed. Updating config status')
        const { data: newConfigStatus, error: updateConfigStatusError } =
          await supabase
            .from('wallet_recovery_config')
            .update({ status: 'VERIFIED' })
            .eq('id', config.id)

        if (updateConfigStatusError) {
          throw new Error(`${updateConfigStatusError}`)
        }

        // Send email to owner
        console.info('Sending email to owner')
        const payload = {
          to: config.profiles.email,
          subject: `${config.profiles.first_name}, your safeguard request has been verified`,
          html: render(
            SafeguardVerifiedEmail({
              redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/safeguard`,
            })
          ),
        }
        sendMail(payload)

        toast({
          title: 'Verification successful',
          description: `Successfully verified request. Owner has been notified.`,
          variant: 'success',
        })
      } else {
        toast({
          title: 'Verification successful',
          description: `Successfully updated verifier status`,
          variant: 'success',
        })
      }
      setIsFallbackInterface(true)
    } catch (e) {
      console.error(e)
      toast({
        title: 'Error',
        description: `${e}`,
        variant: 'destructive',
      })
      setIsErrorInterface(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Verify - geniesafe</title>
      </Head>
      {config !== null &&
      verifier !== null &&
      config.status === 'ACTIVE' &&
      verifier.has_verified === false &&
      !isFallbackInterface ? (
        <>
          <div className="flex flex-col gap-2 pb-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Verify safeguard request
            </h1>
            <p className="leading-7">
              Hello {verifier.profiles.first_name}. As a verifier, your role is
              crucial in ensuring the security of our platform. We kindly
              request you to verify the safeguard request below to determine
              whether{' '}
              <b>
                {config.profiles.first_name} {config.profiles.last_name}
              </b>{' '}
              is legitimately attempting to recover a lost private key.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            {/* Ignore */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'destructive'} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>Loading
                    </>
                  ) : (
                    'Ignore'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ignore request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do this if you believe it is not legitimate.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onIgnore}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Verify */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={'default'} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>Loading
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Verify request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do this if you believe it is legitimate.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onVerify}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 pb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
            {isErrorInterface
              ? 'You are not authorized to view this'
              : 'Verification complete'}
          </h1>
          <p className="leading-7">
            {isErrorInterface
              ? 'Please log in again.'
              : 'You may exit this page.'}
          </p>
        </div>
      )}
    </>
  )
}
