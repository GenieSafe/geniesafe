import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../../components/ui/button'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { Tables } from '../../lib/database.types'
import { useToast } from '../../components/ui/use-toast'
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
} from '../../components/ui/alert-dialog'
import { useState } from 'react'

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

  return {
    props: {
      data: data ? data[0] : error,
    },
  }
}

const formSchema = z.object({
  icNumber: z
    .string()
    .refine((icNumber) => /^\d{6}-\d{2}-\d{4}$/.test(icNumber), {
      message: 'Invalid I/C number format',
    }),
})

export default function Activate({ data }: { data: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const formatIcNumber = (icNumber: string) => {
    // Remove dashes and ensure it's a valid I/C number
    icNumber = icNumber.replace(/-/g, '')
    if (/^\d{12}$/.test(icNumber)) {
      // Insert dashes in the correct positions as the user types
      icNumber = icNumber.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3')
    }
    return icNumber
  }

  const handleIcNumberChange = (e: { target: { value: string } }) => {
    // Limit the input field to 12 characters
    const inputWithoutDashes = e.target.value.replace(/-/g, '').slice(0, 12)
    const formattedICNumber = formatIcNumber(inputWithoutDashes)
    form.setValue('icNumber', formattedICNumber)
  }

  const onSubmit = ({ icNumber }: { icNumber: string }) => {
    // Close dialog
    setIsDialogOpen(false)
    
    // Check if data is not null
    if (data === null) return

    // Extract id
    const _id = data.id

    // Extract wallet addresses from beneficiaries
    const _beneficiaries = data.beneficiaries.map(
      (beneficiary: Tables<'beneficiaries'>) =>
        beneficiary.metadata
          ? (beneficiary.metadata as { wallet_address: string }).wallet_address
          : null
    )

    // Extract percentages
    const _percentages: number[] = data.beneficiaries.map(
      (beneficiary: Tables<'beneficiaries'>) => beneficiary.percentage
    )

    // Log data
    console.log('icNumber', icNumber)
    console.log('_id', _id)
    console.log('_beneficiaries', _beneficiaries)
    console.log('_percentages', _percentages)
  }

  return (
    <>
      <div className="flex items-center justify between pb-12">
        <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
          Activate Will
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="icNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deceased's I/C number</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    onChange={handleIcNumberChange}
                    maxLength={12} // Limit the input to 12 characters
                  />
                </FormControl>
                <FormDescription>
                  Enter digits without dashes (-)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size={'lg'}>Activate</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to activate this person's will?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is irreversible and legally binding. Please
                    ensure you have the necessary legal authority and documents
                    before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    // type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </>
  )
}
