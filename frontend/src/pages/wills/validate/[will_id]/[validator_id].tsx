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
import { useEffect } from 'react'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const will_id = ctx.query.will_id
  const validator_id = ctx.query.validator_id

  const supabase = createPagesServerClient(ctx)

  // Get will and validator data
  const { data: will, error: willError } = await supabase
    .from('wills')
    .select('id, title, profiles(first_name, last_name)')
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

  const onSubmit = async (e: any) => {
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

      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to get unvalidated count.Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Head>
        <title>Validate - geniesafe</title>
      </Head>
      {will !== null && validator !== null && !validator.has_validated ? (
        <>
          <div className="flex flex-col gap-2 pb-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Validate will
            </h1>
            <p className="leading-7">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad
              cumque ipsum voluptas? Impedit sit velit est deserunt aspernatur
              modi ipsum, nemo illo fuga. Sit unde reiciendis suscipit quos, at
              necessitatibus.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-semibold tracking-tight scroll-m-20">
                {will.profiles.first_name} {will.profiles.last_name}'s will
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                cumque atque iste veritatis deleniti natus eius nihil soluta id
                aspernatur quod voluptas qui laborum exercitationem omnis
                ratione excepturi, perspiciatis dolorum!
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Validate</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By continuing, you confirm that the this person is
                      deceased and therefore allow the will to be executed by
                      our smart contract.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>
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
            Validation completed
          </h1>
          <p className="leading-7">You may exit this page.</p>
        </div>
      )}
    </>
  )
}
