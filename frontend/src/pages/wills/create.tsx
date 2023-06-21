'use client'

import { ChangeEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Label } from '@radix-ui/react-label'
import { Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Beneficiary, Validator, Will } from '../../../types/interfaces'
import { useAccount } from 'wagmi'
import { currentUserId } from '../../lib/global'

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/will?willId=${context.query.id}`
    )
    const data = await res.json()

    return { props: { data } }
  } catch (err) {
    console.error('Failed to fetch data:', err)
    return {
      props: {
        data: context.query.id,
      },
    }
  }
}

const formSchema = z.object({
  title: z.string({ required_error: 'Will title is required' }).min(5).max(30),
})

export default function EditWill({ data }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const router = useRouter()

  const [beneficiariesArr, setBeneficiariesArr] = useState<Beneficiary[]>([])
  const [beneficiariesCardArr, setBeneficiariesCardArr] = useState<
    tempBeneficiary[]
  >([])
  const [beneficiaryInputVal, setBeneficiaryInputVal] = useState('')
  const [percentageInputVal, setPercentageInputVal] = useState('')
  const [totalPercentage, setTotalPercentage] = useState(0)

  const handleBeneficiaryInputValChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBeneficiaryInputVal(e.target.value)
  }
  const handlePercentFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageInputVal(e.target.value)
  }

  interface tempBeneficiary {
    beneficiaryName: string
    percentage: number
    walletAddress: string
  }

  const handleAddBeneficiary = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    if (beneficiaryInputVal !== '' && parseInt(percentageInputVal) !== 0) {
      if (totalPercentage + parseInt(percentageInputVal) <= 100) {
        try {
          const response = await fetch(
            'http://localhost:3000/api/user?walletAddress=' +
              beneficiaryInputVal,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          if (response.ok) {
            const data = await response.json()
            const newObj: Beneficiary = {
              beneficiaryUserId: data.data.id,
              percentage: parseInt(percentageInputVal),
            }

            const tempBeneficiary: tempBeneficiary = {
              beneficiaryName: data.data.firstName + ' ' + data.data.lastName,
              percentage: parseInt(percentageInputVal),
              walletAddress: data.data.walletAddress,
            }

            setBeneficiariesArr([...beneficiariesArr, newObj])
            setTotalPercentage(totalPercentage + parseInt(percentageInputVal))
            setBeneficiariesCardArr([...beneficiariesCardArr, tempBeneficiary])
          } else {
            console.log('user fetch fail')
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Total percentage cannot exceed 100%')
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
    const newCardArr = [...beneficiariesCardArr]
    setTotalPercentage(totalPercentage - newArr[index].percentage)
    newArr.splice(index, 1)
    newCardArr.splice(index, 1)
    setBeneficiariesArr(newArr)
    setBeneficiariesCardArr(newCardArr)
  }

  const [validatorsArr, setValidatorsArr] = useState<Validator[]>([])
  const [validatorsNameArr, setValidatorsNameArr] = useState<string[]>([])
  const [validatorInputVal, setValidatorInputVal] = useState('')

  const handleValidatorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidatorInputVal(e.target.value)
  }

  const handleAddValidator = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (validatorInputVal.trim() !== '') {
      try {
        const response = await fetch(
          'http://localhost:3000/api/user?walletAddress=' + validatorInputVal,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          const newObj: Validator = {
            validatorUserId: data.data.id,
          }
          setValidatorsArr([...validatorsArr, newObj])
          setValidatorsNameArr([
            ...validatorsNameArr,
            data.data.firstName + ' ' + data.data.lastName,
          ])

          if (validatorsNameArr.length >= 2) {
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
    }
  }

  const handleDeleteValidator = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const upValidatorsArr = [...validatorsArr]
    const upValidatorsNameArr = [...validatorsNameArr]
    upValidatorsArr.splice(index, 1)
    upValidatorsNameArr.splice(index, 1)
    setValidatorsArr(upValidatorsArr)
    setValidatorsNameArr(upValidatorsNameArr)
  }

  // Get the current account address
  const { address } = useAccount()

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const will: Will = {
      ownerUserId: currentUserId,
      title: values.title,
      walletAddress: address as string,
      beneficiaries: beneficiariesArr,
      validators: validatorsArr,
    }
    console.log(will)

    try {
      const res = await fetch('http://localhost:3000/api/will', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(will),
      })
      if (res.ok) {
        // API call was successful
        // Do something with the response
        router.push('/wills')
      } else {
        // API call failed
        // Handle the error
        console.log('fail')
      }
    } catch (err) {
      console.log(err)
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
            {/* <FormField
            control={form.control}
            name="willTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Will Title</FormLabel>
                <FormControl>
                  <Input placeholder="My First Will" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
                {beneficiariesCardArr.map((beneficiary, index) => (
                  <Card className="dark" key={index}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-12">
                        {/* TODO: Refactor style into a CSS class */}
                        <p
                          className="leading-7 "
                          style={{
                            minWidth: '10rem',
                            maxWidth: '10rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {beneficiary.beneficiaryName}
                        </p>
                        <p
                          className="leading-7 "
                          style={{
                            maxWidth: '10rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {beneficiary.walletAddress}
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
                {validatorsNameArr.map((validator, index) => (
                  <Card className="dark" key={index}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-12">
                        {/* TODO: Refactor style into a CSS class */}
                        <p
                          className="leading-7 "
                          style={{
                            minWidth: '10rem',
                            maxWidth: '10rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {validator}
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
                // onClick={''}
              >
                Delete
              </Button>
              <Button size={'lg'} type="submit" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
