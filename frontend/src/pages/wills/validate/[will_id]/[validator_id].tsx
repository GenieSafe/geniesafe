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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Database } from '@/lib/database.types'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useContract, useContractWrite } from '@thirdweb-dev/react'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Login from '@/pages/auth/login'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const willId = ctx.query.will_id
  const validatorId = ctx.query.validator_id

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

  // Get will and validator data
  const { data: will, error: getWillError } = await supabase
    .from('wills')
    .select(
      'id, title, profiles(first_name, last_name, wallet_address), status, activated_at)'
    )
    .eq('id', willId as string)
    .single()

  const { data: validator, error: getValidatorError } = await supabase
    .from('validators')
    .select('id, has_validated, profiles(id, first_name, last_name)')
    .eq('id', validatorId as string)
    .single()

  const { data: beneficiaries, error: getBeneficiariesError } = await supabase
    .from('beneficiaries')
    .select('id, profiles(wallet_address), percentage')
    .eq('will_id', willId as string)

  return {
    props: {
      will: will,
      validator: validator,
      beneficiaries: beneficiaries,
    },
  }
}

export default function ValidationPage({
  will,
  validator,
  beneficiaries,
}: {
  will: any
  validator: any
  beneficiaries: any
}) {
  const session = useSession()

  if (!session) return <Login />

  useEffect(() => {
    // If will or validator is not found
    // or if validator is not the current user
    // redirect to 404
    if (!will || !validator || validator.profiles.id !== session.user.id) {
      setIsFallbackInterface(true)
      setIsErrorInterface(true)
    }
  })

  const supabase = useSupabaseClient<Database>()
  const { toast } = useToast()
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  )
  const { mutateAsync: disburse, isLoading: isDisburseLoading } =
    useContractWrite(contract, 'disburse')

  const [isFallbackInterface, setIsFallbackInterface] = useState(false)
  const [isErrorInterface, setIsErrorInterface] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading')

  const onValidate = async (e: any) => {
    try {
      // Ensure both will_id and validator_id are valid
      if (!will || !validator) {
        window.location.href = '/404'
        return
      }

      setIsLoading(true)

      // Update validator's has_validated to true
      console.info('Updating validator status')
      setLoadingText('Updating validator status')
      const { error: updateValidatorStatusError } = await supabase
        .from('validators')
        .update({
          has_validated: true,
          validated_at: new Date().toISOString(),
        })
        .eq('id', validator.id)

      if (updateValidatorStatusError) {
        throw new Error(
          `Failed to update validator status. Error: ${updateValidatorStatusError.message}`
        )
      }

      // Get unvalidated count
      console.info('Getting unvalidated count')
      const { count: unvalidatedCount, error: getUnvalidatedCountError } =
        await supabase
          .from('validators')
          .select('has_validated', { count: 'exact', head: true })
          .eq('will_id', will.id)
          .eq('has_validated', false)

      if (getUnvalidatedCountError) {
        throw new Error(
          `Failed to get unvalidated count. Error: ${getUnvalidatedCountError.message}`
        )
      }

      // Runs this block only when all validators have validated
      if (unvalidatedCount === 0) {
        const _willId = will.id

        // Disburse funds to beneficiaries
        try {
          const data = await disburse({ args: [_willId] })
          console.info('Fund disbursement success', data)
        } catch (e) {
          console.error('Fund disbursement error', e)
          throw new Error(`Fund disbursement error: ${e}`)
        }

        // Update will status to EXECUTED
        console.info('Updating will status')
        const { error: updateWillStatusError } = await supabase
          .from('wills')
          .update({
            status: 'EXECUTED',
            deployed_at_block: null,
            deployed_at: new Date().toISOString(),
            activated_at: new Date().toISOString(),
          })
          .eq('id', will.id)

        if (updateWillStatusError) {
          throw new Error(
            `Failed to update will status. Error: ${updateWillStatusError.message}`
          )
        }

        toast({
          title: 'Validation and execution successful!',
          description:
            'The will has been executed, and the beneficiaries have received their inheritance.',
          variant: 'success',
        })
        setIsFallbackInterface(true)
      } else {
        toast({
          title: 'Validation successful!',
          description:
            'The will will be executed once all validators have validated.',
          variant: 'success',
        })
        setIsFallbackInterface(true)
      }
    } catch (error: any) {
      // Handle errors at any step
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      setIsErrorInterface(true)
      return
    } finally {
      setIsLoading(false)
    }
  }

  const onInvalidate = async (e: any) => {
    console.info('Invalidating will')

    try {
      // Update all validators of the will has_validated to false
      const { error: updateValidatorStatusError } = await supabase
        .from('validators')
        .update({
          has_validated: false,
          validated_at: null,
        })
        .eq('will_id', will.id)

      if (updateValidatorStatusError) {
        throw new Error(
          `Failed to update validator status. Error: ${updateValidatorStatusError.message}`
        )
      }

      // Update will status to INACTIVE
      const { error: updateWillStatusError } = await supabase
        .from('wills')
        .update({
          status: 'INACTIVE',
        })
        .eq('id', will.id)

      if (updateWillStatusError) {
        throw new Error(
          `Failed to update will status. Error: ${updateWillStatusError.message}`
        )
      }

      toast({
        title: 'Will invalidated!',
        description: 'This will is now inactive.',
        variant: 'success',
      })
      setIsFallbackInterface(true)
    } catch (error: any) {
      // Handle errors at any step
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      setIsErrorInterface(true)
    }
  }

  const getRelativeActivatedAt = () => {
    if (will.activated_at !== null)
      return formatDistanceToNow(new Date(will.activated_at), {
        addSuffix: true,
      })
    return null
  }

  return (
    <>
      <Head>
        <title>Validate - geniesafe</title>
      </Head>
      {will !== null &&
      validator !== null &&
      will.status === 'ACTIVE' &&
      !validator.has_validated &&
      !isFallbackInterface ? (
        <>
          <div className="flex flex-col gap-2 pb-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Validate will
            </h1>
            <p className="leading-7">
              Hello {validator.profiles.first_name}. Your role is to verify if
              the owner of this will has passed away. If it was activated in
              error, you have the authority to invalidate this will. Upon
              successful validation, the will's execution will proceed
              automatically via our smart contract.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-semibold tracking-tight scroll-m-20">
                {will.profiles.first_name} {will.profiles.last_name}'s will
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7">
                Activated {getRelativeActivatedAt()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {/* Invalidate */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {!isLoading ? (
                    <Button variant={'destructive'}>Invalidate</Button>
                  ) : (
                    <Button variant={'destructive'} disabled>
                      <div className="loading-spinner"></div>
                      {loadingText}
                    </Button>
                  )}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Invalidate this will?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By choosing to invalidate, you are confirming that the
                      will was mistakenly activated, and the owner is not
                      deceased. This action will render the will inactive once
                      more.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onInvalidate}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Validate */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {!isLoading ? (
                    <Button>Validate</Button>
                  ) : (
                    <Button disabled>
                      <div className="loading-spinner"></div>
                      {loadingText}
                    </Button>
                  )}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Validate this will?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By validating, you are confirming the owner's passing.
                      Once all validators have completed the validation process,
                      the will's execution will proceed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onValidate}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="flex flex-col gap-2 pb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
            {isErrorInterface
              ? 'You are not authorized to view this'
              : 'Validation complete'}
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
