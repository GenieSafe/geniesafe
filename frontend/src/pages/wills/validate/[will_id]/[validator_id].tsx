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
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useContract, useContractWrite } from '@thirdweb-dev/react'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const will_id = ctx.query.will_id
  const validator_id = ctx.query.validator_id

  const supabase = createPagesServerClient(ctx)

  // Get will and validator data
  const { data: will, error: willError } = await supabase
    .from('wills')
    .select('id, title, profiles(first_name, last_name), status, activated_at')
    .eq('id', will_id as string)
    .single()

  const { data: validator, error: validatorError } = await supabase
    .from('validators')
    .select('id, has_validated, profiles(first_name, last_name)')
    .eq('id', validator_id as string)
    .single()

  return {
    props: {
      will: will,
      validator: validator,
    },
  }
}

export default function ValidationPage({
  will,
  validator,
}: {
  will: any
  validator: any
}) {
  useEffect(() => {
    // If will or validator is not found, redirect to 404
    if (!will || !validator) {
      window.location.href = '/404'
    }
  })

  const supabase = useSupabaseClient<Database>()
  const { toast } = useToast()
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  )
  const { mutateAsync: validateWill, isLoading: isValidateWillLoading } =
    useContractWrite(contract, 'validateWill')
  const { mutateAsync: executeWill, isLoading: isExecuteWillLoading } =
    useContractWrite(contract, 'executeWill')
  const [isFallbackInterface, setIsFallbackInterface] = useState(false)

  const onValidate = async (e: any) => {
    // Ensure both will_id and validator_id are valid
    if (!will || !validator) {
      window.location.href = '/404'
      return
    }

    // Update validator's has_validated to true
    try {
      const { error: updateValidatorStatusError } = await supabase
        .from('validators')
        .update({
          has_validated: true,
          validated_at: new Date(),
        })
        .eq('id', validator.id)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to update validator status. ',
        variant: 'destructive',
      })
    }

    // Runs only when all validators have validated
    // Get unvalidated count
    try {
      const { count: unvalidatedCount, error: unvalidatedError } =
        await supabase
          .from('validators')
          .select('has_validated', { count: 'exact', head: true })
          .eq('will_id', will.id)
          .eq('has_validated', false)

      if (unvalidatedCount === 0) {
        // Call validateWill and executeWill in WillContract
        try {
          const [validateWillData, executeWillData] = await Promise.all([
            validateWill({ args: [will.id] }),
            executeWill({ args: [will.id] }),
          ])

          console.info(
            'Contract calls successful',
            validateWillData,
            executeWillData
          )
        } catch (e) {
          console.error('Contract calls failure', e)
          toast({
            title: 'Error',
            description: 'Failed to call contract. Please try again.',
            variant: 'destructive',
          })
        }

        // Update will status to VALIDATED
        try {
          const { error: updateWillStatusError } = await supabase
            .from('wills')
            .update({
              status: 'VALIDATED',
            })
            .eq('id', will.id)
          toast({
            title: 'Validation successful!',
            description:
              'This will will be executed once all validators have completed validation.',
            variant: 'success',
          })
        } catch (e) {
          toast({
            title: 'Error',
            description: 'Failed to update will status. Please try again.',
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Validation successful!',
          description:
            'The will will be executed once all validators have validated.',
          variant: 'success',
        })
      }

      setIsFallbackInterface(true)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to get unvalidated count.Please try again.',
        variant: 'destructive',
      })
    }
  }

  const onInvalidate = async (e: any) => {
    console.log('invalidate')

    // Update all validators of the will has_validated to false
    try {
      const { error: updateValidatorStatusError } = await supabase
        .from('validators')
        .update({
          has_validated: false,
          validated_at: null,
        })
        .eq('will_id', will.id)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to update validator status. ',
        variant: 'destructive',
      })
    }

    // Update will status to INACTIVE
    try {
      const { error: updateWillStatusError } = await supabase
        .from('wills')
        .update({
          status: 'INACTIVE',
        })
        .eq('id', will.id)
      toast({
        title: 'Will invalidated!',
        description: 'This will is now inactive.',
        variant: 'success',
      })
      setIsFallbackInterface(true)

      // setTimeout(() => {
      //   window.location.reload()
      // }, 3000)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to update will status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const relativeActivatedAt = formatDistanceToNow(new Date(will.activated_at), {
    addSuffix: true,
  })

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
                  {!isButtonLoading ? (
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
                  {!isButtonLoading ? (
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
            {isErrorInterface ? 'Something went wrong' : 'Validation completed'}
          </h1>
          <p className="leading-7">
            {isErrorInterface ? 'Please try again.' : 'You may exit this page.'}
          </p>
        </div>
      )}
    </>
  )
}
