import { ChangeEvent, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
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
import { useContract, useContractWrite } from '@thirdweb-dev/react'
import { toast } from '@/components/ui/use-toast'
import { utils } from 'ethers'

const formSchema = z.object({
  title: z.string({ required_error: 'Will title is required' }).min(5).max(30),
  ethAmount: z.string({ required_error: 'Amount is required' }),
})

export default function CreateWill() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const [beneficiariesArr, setBeneficiariesArr] = useState<
    Tables<'beneficiaries'>[]
  >([])
  const [beneficiaryInputVal, setBeneficiaryInputVal] = useState('')
  const [percentageInputVal, setPercentageInputVal] = useState('')
  const [totalPercentage, setTotalPercentage] = useState(0)
  const [loadingText, setLoadingText] = useState('Loading')

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  )
  const { mutateAsync: createWill, isLoading: isCreateWillLoading } =
    useContractWrite(contract, 'createWill')

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
      alert('Please fill in the fields')
    } else if (totalPercentage + parseInt(percentageInputVal) > 100) {
      alert('Total percentage cannot exceed 100%')
    } else if (
      beneficiariesArr.some(
        (beneficiary) =>
          (beneficiary.metadata as Record<string, any>).wallet_address ===
          beneficiaryInputVal
      )
    ) {
      alert('Beneficiary with the same wallet address already exists')
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', beneficiaryInputVal)

      if (!error && data.length > 0) {
        const newBeneficiary: any = {
          user_id: data[0].id,
          percentage: parseInt(percentageInputVal),
          metadata: data[0],
        }

        setBeneficiariesArr([...beneficiariesArr, newBeneficiary])
        setTotalPercentage(totalPercentage + parseInt(percentageInputVal))
      } else {
        // API call failed
        // Handle the error
        console.log(error)
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

  const [validatorsArr, setValidatorsArr] = useState<Tables<'validators'>[]>([])
  const [validatorInputVal, setValidatorInputVal] = useState('')

  const handleValidatorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidatorInputVal(e.target.value)
  }

  const handleAddValidator = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (validatorInputVal.trim() === '') {
      alert('Please fill in the field')
    } else if (validatorsArr.length >= 3) {
      alert('You can only have up to 3 validators')
    } else if (
      validatorsArr.some(
        (validator) =>
          (validator.metadata as Record<string, any>).wallet_address ===
          validatorInputVal
      )
    ) {
      alert('Validator with the same wallet address already exists')
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', validatorInputVal)

      if (!error && data) {
        const newValidator: any = {
          user_id: data[0].id,
          metadata: data[0],
        }

        setValidatorsArr([...validatorsArr, newValidator])

        if (validatorsArr.length >= 2) {
          setValidatorInputVal('')
        }
      } else {
        // API call failed
        // Handle the error
        console.log(error)
      }
    }
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

  const onCreate = async (values: z.infer<typeof formSchema>) => {
    console.info('Inserting will')
    setLoadingText('Creating will')
    const { data: newWill, error: createWillError } = await supabase
      .from('wills')
      .insert({
        title: values.title as string,
        user_id: user?.id as string,
        eth_amount: values.ethAmount as string,
      })
      .select()
      .single()

    if (!createWillError) {
      beneficiariesArr.forEach(async (beneficiary) => {
        beneficiary.will_id = newWill.id as string
      })
      validatorsArr.forEach(async (validator) => {
        validator.will_id = newWill.id as string
      })

      console.info('Inserting beneficiaries and validators data')
      setLoadingText('Creating beneficiaries and validators')
      const { data: newBeneficiary, error: createBenError } = await supabase
        .from('beneficiaries')
        .insert(beneficiariesArr)
        .select()

      const { data: newValidator, error: createValError } = await supabase
        .from('validators')
        .insert(validatorsArr)
        .select()

      console.info('Calling WillContract')
      setLoadingText('Calling WillContract')
      try {
        // Prep data for createWill contract call
        const _willId = newWill.id as string
        const _beneficiaries = beneficiariesArr.map((beneficiary) => ({
          beneficiaryAddress: (
            beneficiary.metadata as Record<string, any>
          ).wallet_address.toString(),
          percentage: beneficiary.percentage.toString(),
        }))
        const data = await createWill({
          args: [_willId, _beneficiaries],
          overrides: {
            value: utils.parseEther(values.ethAmount),
          },
        })
        console.info('WillContract call success', data)
        toast({
          title: 'WillContract call success',
          description: `Your will has been created!`,
          variant: 'success',
        })
      } catch (e) {
        console.error('WillContract call error', e)
        toast({
          title: 'WillContract call error',
          description: `Transaction failed. Please try again.`,
          variant: 'destructive',
        })

        // Delete will if contract call fails
        console.info('Transaction failed, deleting will')
        await supabase.from('wills').delete().eq('id', newWill.id)
      }

      if (!createBenError && !createValError) {
        router.push('/wills')
      } else {
        console.error(createBenError, createValError)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Create Will
        </h1>
      </div>
      <Card>
        <CardContent className="p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Will title</FormLabel>
                    <FormControl>
                      <Input placeholder="My First Will" {...field} />
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
                    <FormLabel>Deposit fund</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ETH amount to deposit"
                        type="text"
                        pattern="[0-9.]*" // Allow only numbers
                        inputMode="numeric" // Set the input mode to numeric for better mobile support
                        onInput={(e) => {
                          const inputElement = e.target as HTMLInputElement
                          inputElement.value = inputElement.value.replace(
                            /[^0-9.]/g,
                            ''
                          ) // Remove non-numeric characters
                        }}
                        {...field}
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
                      <Label htmlFor="email">Beneficiary's address</Label>
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
                  {beneficiariesArr.length != 0 && (
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
                            <p className="leading-7">
                              {beneficiary.percentage}%
                            </p>
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
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors scroll-m-20">
                    Validators
                  </h2>
                  <div className="grid items-end grid-cols-11 gap-4">
                    <div className="grid items-center w-full col-span-10 gap-2">
                      <Label htmlFor="email">Validator's address</Label>
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
                  {validatorsArr.length != 0 && (
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
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                {!isCreateWillLoading ? (
                  <Button size={'lg'} type="submit">
                    Create will
                  </Button>
                ) : (
                  <Button disabled>
                    <div className="loading-spinner"></div>
                    {loadingText}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
