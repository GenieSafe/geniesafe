import { ChangeEvent, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { Database, Tables } from '@/lib/database.types'
import {
  useAddress,
  useContract,
  useContractWrite,
  useWallet,
} from '@thirdweb-dev/react'
import { utils } from 'ethers'
import { toast } from '@/components/ui/use-toast'
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
  const { data: will, error: getWillError } = await supabase
    .from('wills')
    .select(
      `
    id, title, deployed_at_block, status, eth_amount,
    beneficiaries(user_id, percentage, metadata:user_id(first_name, last_name, wallet_address)),
    validators(user_id, has_validated, metadata:user_id(first_name, last_name, wallet_address))
  `
    )
    .eq('id', ctx.query.id)
    .single()

  return {
    props: {
      initialSession: session,
      will: will,
    },
  }
}

const formSchema = z.object({
  title: z
    .string({ required_error: 'Will title is required' })
    .min(5, { message: 'Will title must at least contain 5 characters' })
    .max(30, { message: 'Will title must not exceed 30 characters' })
    .refine((data) => !/^\s/.test(data), {
      message: 'Will title must not start with whitespace',
    }),
  ethAmount: z.string({ required_error: 'Amount is required' }).default('0'),
})

export default function EditWill({ will }: { will: any }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const address = useAddress()
  const [isLoading, setIsLoading] = useState(false)

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  )
  const { mutateAsync: updateWill, isLoading: isUpdateWillLoading } =
    useContractWrite(contract, 'updateWill')
  const { mutateAsync: deleteWill, isLoading: isDeleteWillLoading } =
    useContractWrite(contract, 'deleteWill')
  const { mutateAsync: withdraw, isLoading: isWithdrawLoading } =
    useContractWrite(contract, 'withdraw')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: will.title,
    },
  })

  const [beneficiariesArr, setBeneficiariesArr] = useState<
    Tables<'beneficiaries'>[]
  >(will.beneficiaries)
  const [beneficiaryInputVal, setBeneficiaryInputVal] = useState('')
  const [percentageInputVal, setPercentageInputVal] = useState('')
  const [totalPercentage, setTotalPercentage] = useState(
    will.beneficiaries.reduce(
      (acc: number, curr: Tables<'beneficiaries'>) =>
        acc + (curr.percentage ?? 0),
      0
    )
  )

  const handleBeneficiaryInputValChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBeneficiaryInputVal(e.target.value)
  }

  const handlePercentFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageInputVal(e.target.value)
  }

  const handleAddBeneficiary = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    if (beneficiaryInputVal === '' || parseInt(percentageInputVal) === 0) {
      toast({
        title: 'Error',
        description: 'Beneficiary and percentage fields are required.',
        variant: 'destructive',
      })
    } else if (totalPercentage + parseInt(percentageInputVal) > 100) {
      toast({
        title: 'Error',
        description: 'Total percentage cannot exceed 100%.',
        variant: 'destructive',
      })
    } else if (
      beneficiariesArr.some(
        (beneficiary) =>
          (beneficiary.metadata as Record<string, any>).wallet_address ===
          beneficiaryInputVal
      )
    ) {
      toast({
        title: 'Error',
        description: 'Beneficiary with the same wallet address already exists.',
        variant: 'destructive',
      })
    } else if (beneficiaryInputVal === address) {
      toast({
        title: 'Error',
        description: 'You cannot add yourself as a beneficiary.',
        variant: 'destructive',
      })
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', beneficiaryInputVal)
        .single()

      if (!error && data) {
        const newBeneficiary: any = {
          user_id: data.id,
          percentage: parseInt(percentageInputVal),
          metadata: data,
        }

        setBeneficiariesArr([...beneficiariesArr, newBeneficiary])
        setTotalPercentage(totalPercentage + parseInt(percentageInputVal))
      } else {
        // API call failed
        // Handle the error
        toast({
          title: 'Error',
          description: `User with the address does not exist.`,
          variant: 'destructive',
        })
      }
    }

    // Clear the input fields
    setBeneficiaryInputVal('')
    setPercentageInputVal('')
  }

  const handleDeleteBeneficiary = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const newArr = [...beneficiariesArr]
    setTotalPercentage(totalPercentage - newArr[index].percentage)
    newArr.splice(index, 1)
    setBeneficiariesArr(newArr)
  }

  const [validatorsArr, setValidatorsArr] = useState<Tables<'validators'>[]>(
    will.validators
  )
  const [validatorInputVal, setValidatorInputVal] = useState('')

  const handleValidatorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidatorInputVal(e.target.value)
  }

  const handleAddValidator = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (validatorInputVal.trim() === '') {
      toast({
        title: 'Error',
        description: 'Validator field is required.',
        variant: 'destructive',
      })
    } else if (validatorsArr.length >= 3) {
      toast({
        title: 'Error',
        description: 'You can only have up to 3 validators.',
        variant: 'destructive',
      })
    } else if (
      validatorsArr.some(
        (validator) =>
          (validator.metadata as Record<string, any>).wallet_address ===
          validatorInputVal
      )
    ) {
      toast({
        title: 'Error',
        description: 'Validator with the same wallet address already exists.',
        variant: 'destructive',
      })
    } else if (validatorInputVal === address) {
      toast({
        title: 'Error',
        description: 'You cannot add yourself as a validator.',
        variant: 'destructive',
      })
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', validatorInputVal)
        .single()

      if (!error && data) {
        const newValidator: any = {
          user_id: data.id,
          metadata: data,
        }

        setValidatorsArr([...validatorsArr, newValidator])

        if (validatorsArr.length >= 2) {
          setValidatorInputVal('')
        }
      } else {
        // API call failed
        // Handle the error
        toast({
          title: 'Error',
          description: `User with the address does not exist.`,
          variant: 'destructive',
        })
      }
    }

    setValidatorInputVal('')
  }

  const handleDeleteValidator = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const newArr = [...validatorsArr]
    newArr.splice(index, 1)
    setValidatorsArr(newArr)
  }

  const onSave = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // If wallet is not connected, show alert and return
      if (address === undefined) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first.',
          variant: 'destructive',
        })
        return
      }
      // If total percentages of beneficiaries is less than 100%, show alert and return
      if (totalPercentage < 100) {
        toast({
          title: 'Error',
          description: 'Total percentage of beneficiaries must be 100%.',
          variant: 'destructive',
        })
        return
      }

      // Call WillContract
      const _willId = will.id
      const _newBeneficiaries = beneficiariesArr.map((beneficiary) => ({
        beneficiaryAddress: (
          beneficiary.metadata as Record<string, any>
        ).wallet_address.toString(),
        percentage: beneficiary.percentage.toString(),
      }))

      if (values.ethAmount === '') values.ethAmount = '0'

      // If ethAmount is not 0, call WillContract
      if (values.ethAmount !== '0') {
        console.info('Calling WillContract')
        try {
          const updatedWillContract = await updateWill({
            args: [_willId, _newBeneficiaries],
            overrides: {
              value: utils.parseEther(values.ethAmount),
            },
          })

          console.info('WillContract call success', updatedWillContract)
          toast({
            title: 'Contract call success',
            description: `Your will has been updated!`,
            variant: 'success',
          })
        } catch (e) {
          console.error('WillContract call failure', e)
          toast({
            title: 'Contract call error',
            description: `Transaction failed. Please try again.`,
            variant: 'destructive',
          })
          return
        }
      }

      console.info('Updating will')
      // Adding throws for the supabase.rpc call
      let { data: updatedWill, error: updateWillError } = await supabase.rpc(
        'update_will',
        {
          in_beneficiaries: beneficiariesArr,
          in_title: values.title,
          in_validators: validatorsArr,
          in_will_id: will.id,
        }
      )
      if (updateWillError) {
        throw new Error(`Supabase RPC error: ${updateWillError.message}`)
      }

      // Add old ethAmount to new ethAmount
      const oldEthAmount = will.eth_amount
      const newEthAmount = values.ethAmount
      const totalEthAmount = (
        parseFloat(oldEthAmount) + parseFloat(newEthAmount)
      ).toString()

      // Update eth_amount in wills table
      console.info(`Updating eth_amount (${totalEthAmount})`)
      const { data: updatedWillEthAmount, error: updateWillEthAmountError } =
        await supabase
          .from('wills')
          .update({ eth_amount: totalEthAmount })
          .eq('id', will.id)

      if (updateWillEthAmountError) {
        throw new Error(
          `Supabase update error: ${updateWillEthAmountError.message}`
        )
      }

      if (!updateWillError) {
        toast({
          title: 'Success',
          description: `Your will has been updated!`,
          variant: 'success',
        })
        router.push('/wills')
      } else {
        console.log(updateWillError)
      }
    } catch (e) {
      console.error('Error during form submission:', e)
      toast({
        title: 'Form submission error',
        description: `Error: ${e}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    try {
      const _willId = will.id
      const _weiAmount = utils.parseEther(will.eth_amount)

      console.info('Calling WillContract to withdraw funds')
      try {
        const data = await withdraw({ args: [_willId, _weiAmount] })
        console.info('Contract call success', data)
      } catch (e) {
        console.error('Contract call failure', e)
        toast({
          title: 'Error withdrawing funds',
          description: `Error calling WillContract to withdraw funds: ${e}`,
          variant: 'destructive',
        })
        return
      }

      console.info('Calling WillContract to delete will')
      try {
        const data = await deleteWill({ args: [_willId] })
        console.info('Contract call success', data)
        toast({
          title: 'Will deleted',
          description: 'Your will has been successfully deleted!',
          variant: 'success',
        })
      } catch (e) {
        console.error('Contract call failure', e)
        toast({
          title: 'Error deleting will',
          description: `Error calling WillContract to delete will: ${e}`,
          variant: 'destructive',
        })
        return
      }

      console.info('Deleting will')
      const { error } = await supabase.from('wills').delete().eq('id', will.id)
      if (!error) {
        router.push('/wills')
      }
    } catch (e) {
      console.error('Error during deletion:', e)
      toast({
        title: 'Error deleting will',
        description: `Error deleting the will: ${e}`,
        variant: 'destructive',
      })
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Edit Will
        </h1>
      </div>
      <Card>
        <CardContent className="p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Will title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter will title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ethAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit fund (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ETH amount to deposit"
                        type="text"
                        pattern="[0-9.]*" // Allow only numbers
                        inputMode="numeric" // Set the input mode to numeric for better mobile support
                        value={field.value || ''}
                        onChange={(e) => {
                          const inputElement = e.target as HTMLInputElement
                          inputElement.value = inputElement.value.replace(
                            /[^0-9.]/g,
                            ''
                          ) // Remove non-numeric characters
                          field.onChange(e) // Call the onChange function from the form field
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors scroll-m-20">
                    Beneficiaries
                  </h2>
                  <div className="grid items-end grid-cols-11 gap-4">
                    <div className="grid items-center w-full col-span-5 gap-2">
                      <Label htmlFor="email">Address</Label>
                      <Input
                        type="text"
                        name="field1"
                        placeholder="0x12345..."
                        value={beneficiaryInputVal}
                        onChange={handleBeneficiaryInputValChange}
                        disabled={totalPercentage === 100}
                      />
                    </div>
                    <div className="grid items-center w-full col-span-5 gap-2">
                      <Label htmlFor="email">Percentage (%)</Label>
                      <Input
                        type="number"
                        name="field2"
                        placeholder="100"
                        value={percentageInputVal}
                        onChange={handlePercentFieldChange}
                        disabled={totalPercentage === 100}
                      />
                    </div>
                    <Button
                      className="col-span-1"
                      size={'icon'}
                      onClick={handleAddBeneficiary}
                      disabled={totalPercentage === 100}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {beneficiariesArr.map((beneficiary, index) => (
                      <Card key={beneficiary.user_id}>
                        <CardContent className="flex items-center justify-between pt-6">
                          <p className="leading-7 truncate max-w-[10rem]">
                            {
                              (beneficiary.metadata as Record<string, any>)
                                .first_name
                            }{' '}
                            {
                              (beneficiary.metadata as Record<string, any>)
                                .last_name
                            }
                          </p>
                          <p className="w-40 leading-7 truncate">
                            {
                              (beneficiary.metadata as Record<string, any>)
                                .wallet_address
                            }
                          </p>
                          <p className="leading-7">{beneficiary.percentage}%</p>
                          <Button
                            size={'sm'}
                            variant={'destructive'}
                            className="col-span-1"
                            onClick={(event) =>
                              handleDeleteBeneficiary(event, index)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors scroll-m-20">
                    Validators ({validatorsArr.length}/3)
                  </h2>
                  <div className="grid items-end grid-cols-11 gap-4">
                    <div className="grid items-center w-full col-span-10 gap-2">
                      <Label htmlFor="email">Address</Label>
                      <Input
                        type="text"
                        name="field1"
                        placeholder="0x12345..."
                        value={validatorInputVal}
                        onChange={handleValidatorInputChange}
                        disabled={validatorsArr.length === 3}
                      />
                    </div>
                    <Button
                      className="col-span-1"
                      size={'icon'}
                      onClick={handleAddValidator}
                      disabled={validatorsArr.length === 3}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {validatorsArr.map((validator, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-center justify-between pt-6">
                          <p className="w-40 leading-7 truncate">
                            {
                              (validator.metadata as Record<string, any>)
                                .first_name
                            }{' '}
                            {
                              (validator.metadata as Record<string, any>)
                                .last_name
                            }
                          </p>
                          <Button
                            size={'sm'}
                            variant={'destructive'}
                            className="col-span-1"
                            onClick={(event) =>
                              handleDeleteValidator(event, index)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                {isLoading ? (
                  <Button size={'lg'} disabled>
                    <div className="loading-spinner"></div>
                    Loading...
                  </Button>
                ) : (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size={'lg'} variant={'destructive'}>
                          Delete and withdraw
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this will?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You will not be able to undo this action. All funds
                            will be returned to your address. Please proceed
                            with caution.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDelete}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      size={'lg'}
                      type="submit"
                      disabled={
                        validatorsArr.length < 3 || totalPercentage < 100
                      }
                    >
                      Save
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-right text-muted">
                Note: Any amount of deposits will trigger a transaction and
                incur gas fees.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
