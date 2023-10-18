'use client'

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
} from '../../../components/ui/form'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'

import { beneficiary, validator, will } from '../../../../types/interfaces'
import { Trash2 } from 'lucide-react'

import { Database } from '../../../lib/database.types'

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
    beneficiaries(user_id, percentage, profile:user_id(first_name, last_name, wallet_address)),
    validators(user_id, has_validated, profile:user_id(first_name, last_name, wallet_address))
  `
    )
    .eq('id', ctx.query.id)

  return {
    props: {
      initialSession: session,
      will: data ?? error,
    },
  }
}

const formSchema = z.object({
  title: z.string({ required_error: 'Will title is required' }).min(5).max(30),
})

export default function EditWill({ will }: { will: will[] }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: will[0].title,
    },
  })

  const [beneficiariesArr, setBeneficiariesArr] = useState<beneficiary[]>(
    will[0].beneficiaries
  )
  const [beneficiaryInputVal, setBeneficiaryInputVal] = useState('')
  const [percentageInputVal, setPercentageInputVal] = useState('')
  const [totalPercentage, setTotalPercentage] = useState(
    will[0].beneficiaries.reduce(
      (acc: number, curr: beneficiary) => acc + (curr.percentage ?? 0),
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

    if (beneficiaryInputVal !== '' && parseInt(percentageInputVal) !== 0) {
      if (totalPercentage + parseInt(percentageInputVal) <= 100) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', beneficiaryInputVal)

          if (!error && data) {
            const newBeneficiary: beneficiary = {
              user_id: data[0].id,
              percentage: parseInt(percentageInputVal),
              profile: {
                id: data[0].id,
                first_name: data[0].first_name,
                last_name: data[0].last_name,
                wallet_address: data[0].wallet_address,
                email: data[0].email,
              },
            }

            setBeneficiariesArr([...beneficiariesArr, newBeneficiary])
            setTotalPercentage(totalPercentage + parseInt(percentageInputVal))
          } else {
            console.log(error)
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Total percentage cannot exceed 100%')
      }
    } else {
      alert('Please fill in the fields')
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

  const [validatorsArr, setValidatorsArr] = useState<validator[]>(
    will[0].validators
  )
  const [validatorInputVal, setValidatorInputVal] = useState('')

  const handleValidatorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidatorInputVal(e.target.value)
  }

  const handleAddValidator = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (validatorInputVal.trim() !== '') {
      if (validatorsArr.length < 3) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', validatorInputVal)

          if (!error && data) {
            const newValidator: validator = {
              user_id: data[0].id,
              has_validated: false,
              profile: {
                id: data[0].id,
                first_name: data[0].first_name,
                last_name: data[0].last_name,
                wallet_address: data[0].wallet_address,
                email: data[0].email,
              },
            }

            setValidatorsArr([...validatorsArr, newValidator])

            if (validatorsArr.length >= 2) {
              setValidatorInputVal('')
            } else {
              setValidatorInputVal('')
            }
          } else {
            // API call failed
            // Handle the error
            console.log('user fetch fail')
          }
        } catch (error) {
          // Handle any network or other errors
          console.log(error)
        }
      } else {
        alert('You can only have up to 3 validators')
      }
    } else {
      alert('Please fill in the field')
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let { data, error } = await supabase.rpc('update_will', {
      in_beneficiaries: beneficiariesArr,
      in_title: values.title,
      in_validators: validatorsArr,
      in_will_id: will[0].id,
    })

    if(!error) {
      router.push('/wills')
    }else {
      console.log(error)
    }
  }

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { error } = await supabase
      .from('wills')
      .delete()
      .eq('id', will[0].id)

      if(!error) {
        router.push('/wills')
      }
  }

  return (
    <>
      <div className="container flex items-center justify-between pb-8">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Edit Will
        </h1>
      </div>
      <div className="container grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Will Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My First Will" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold tracking-tight transition-colors scroll-m-20">
                Beneficiaries
              </h2>
              <div className="grid items-end grid-cols-11 gap-4">
                <div className="grid w-full items-center gap-1.5 col-span-5">
                  <Label htmlFor="email">Beneficiary's Wallet Address</Label>
                  <Input
                    type="text"
                    name="field1"
                    placeholder="0x12345..."
                    value={beneficiaryInputVal}
                    onChange={handleBeneficiaryInputValChange}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 col-span-5">
                  <Label htmlFor="email">Division Percentage</Label>
                  <Input
                    type="number"
                    name="field2"
                    placeholder="100"
                    value={percentageInputVal}
                    onChange={handlePercentFieldChange}
                  />
                </div>
                <Button onClick={handleAddBeneficiary}>Add</Button>
              </div>
              <div className="grid gap-4">
                {beneficiariesArr.map((beneficiary, index) => (
                  <Card className="dark" key={beneficiary.user_id}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-12">
                        <p className="w-40 leading-7 truncate">
                          {beneficiary.profile?.first_name}{' '}
                          {beneficiary.profile?.last_name}
                        </p>
                        <p className="w-40 leading-7 truncate">
                          {beneficiary.profile?.wallet_address}
                        </p>
                        <p className="leading-7">{beneficiary.percentage}%</p>
                      </div>
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

            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold tracking-tight transition-colors scroll-m-20">
                Validators
              </h2>
              <div className="grid items-end grid-cols-11 gap-4">
                <div className="grid items-center w-full col-span-10 gap-2">
                  <Label htmlFor="email">Validator's Wallet Address</Label>
                  <Input
                    type="text"
                    name="field1"
                    placeholder="0x12345..."
                    value={validatorInputVal}
                    onChange={handleValidatorInputChange}
                  />
                </div>
                <Button
                  className="grid col-span-1"
                  onClick={handleAddValidator}
                >
                  Add
                </Button>
              </div>
              <div className="grid gap-4">
                {validatorsArr.map((validator, index) => (
                  <Card className="dark" key={index}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-12">
                        <p className="w-40 leading-7 truncate">
                          {validator.profile?.first_name}{' '}
                          {validator.profile?.last_name}
                        </p>
                      </div>
                      <Button
                        size={'sm'}
                        variant={'destructive'}
                        className="col-span-1"
                        onClick={(event) => handleDeleteValidator(event, index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex gap-[1rem] justify-end">
              <Button
                size={'lg'}
                variant="destructive"
                type="submit"
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button size={'lg'} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
