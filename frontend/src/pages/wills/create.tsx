'use client'

import React, { ChangeEvent, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

import { Button } from '../../components/ui/button'
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
import { Label } from '../../components/ui/label'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import useConfirmationPrompt from '../../utils/useConfirmationPrompt'

const formSchema = z.object({
  willTitle: z
    .string({ required_error: 'Will title is required' })
    .min(5)
    .max(30),
  identityNumber: z
    .string({ required_error: 'Identity Number is required' })
    .regex(/^(\d{6}-\d{2}-\d{4})$/, {
      message: `Identity number must contain '-'`,
    }),
  walletAddress: z
    .string({ required_error: 'Wallet address is required' })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Invalid Ethereum wallet address',
    }),
})

interface Beneficiary {
  name: string
  walletAddress: string
  percentage: number
}
interface Validator {
  name: string
  walletAddress: string
}

interface Will {
  willTitle: string
  identityNumber: string
  walletAddress: string
  beneficiaries: Beneficiary[]
  validators: Validator[]
}

const CreateWill = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      willTitle: '',
      identityNumber: '',
      walletAddress: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    
    const will: Will = {
      willTitle: values.willTitle,
      identityNumber: values.identityNumber,
      walletAddress: values.walletAddress,
      beneficiaries: beneficiariesArr,
      validators: validatorsArr,
    }

    console.log(will)
  }

  // const [isDirty, setIsDirty] = useState(false)
  // useConfirmationPrompt(isDirty)
  // const handleInputChange = () => {
  //   setIsDirty(true)
  // }

  //adding beneficiaries
  const [beneficiariesArr, setBeneficiariesArr] = useState<Beneficiary[]>([])
  const [benWalletAddressFieldVal, setBenWalletAddressFieldVal] = useState('')
  const [percentFieldVal, setPercentFieldVal] = useState('')
  const [totalPercent, setTotalPercent] = useState(0)

  const handleBenWalletAddressFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBenWalletAddressFieldVal(e.target.value)
  }
  const handlePercentFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentFieldVal(e.target.value)
  }

  const handleAddBeneficiary = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (benWalletAddressFieldVal !== '' && parseInt(percentFieldVal) !== 0) {
      if (totalPercent + parseInt(percentFieldVal) <= 100) {
        const newObj: Beneficiary = {
          name: 'test', //replace with name after fetch from API
          walletAddress: benWalletAddressFieldVal,
          percentage: parseInt(percentFieldVal),
        }
        setBeneficiariesArr([...beneficiariesArr, newObj])
        setTotalPercent(totalPercent + parseInt(percentFieldVal))
      } else {
        alert('Total percentage cannot exceed 100%')
      }
    }

    // Clear the input fields
    setBenWalletAddressFieldVal('')
    setPercentFieldVal('')
  }

  const handleDeleteBeneficiary = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const newArr = [...beneficiariesArr]
    setTotalPercent(totalPercent - newArr[index].percentage)
    newArr.splice(index, 1)
    setBeneficiariesArr(newArr)
  }

  //adding validators
  const [validatorsArr, setValidatorsArr] = useState<Validator[]>([])
  const [valWalletAddressFieldVal, setValWalletAddressFieldVal] = useState('')

  const handleValWalletAddressFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValWalletAddressFieldVal(e.target.value)
  }

  const handleAddValidator = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (validatorsArr.length < 3) {
      if (valWalletAddressFieldVal !== '') {
        const newObj: Validator = {
          name: 'test', //replace with name after fetch from API
          walletAddress: valWalletAddressFieldVal,
        }
        setValidatorsArr([...validatorsArr, newObj])
      }
    } else {
      alert('Maximum number of validators reached')
    }

    // Clear the input fields
    setValWalletAddressFieldVal('')
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

  return (
    <>
      <div className="container flex items-center justify-between pb-8">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Create a will
        </h1>
      </div>
      <div className="container grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
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
            />
            <FormField
              control={form.control}
              name="identityNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Number</FormLabel>
                  <FormControl>
                    <Input placeholder="012345-11-4032" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold tracking-tight transition-colorsscroll-m-20">
                Beneficiaries
              </h2>
              <div className="grid items-end grid-cols-11 gap-4">
                <div className="grid w-full items-center gap-1.5 col-span-5">
                  <Label htmlFor="email">Beneficiary's Wallet Address</Label>
                  <Input
                    type="text"
                    name="field1"
                    placeholder="0x12345..."
                    value={benWalletAddressFieldVal}
                    onChange={handleBenWalletAddressFieldChange}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5 col-span-5">
                  <Label htmlFor="email">Division Percentage</Label>
                  <Input
                    type="number"
                    name="field2"
                    placeholder="100%"
                    value={percentFieldVal}
                    onChange={handlePercentFieldChange}
                  />
                </div>
                <Button onClick={handleAddBeneficiary}>Add</Button>
              </div>
              <div className="grid gap-4">
                {beneficiariesArr.map((ben, index) => (
                  <>
                    <Card className="dark" key={index}>
                      <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-12">
                          <p className="leading-7 ">{ben.name}</p>
                          <p className="leading-7 ">{ben.walletAddress}</p>
                          <p className="leading-7">{ben.percentage}%</p>
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
                  </>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold tracking-tight transition-colorsscroll-m-20">
                Validators
              </h2>
              <div className="grid items-end grid-cols-11 gap-4">
                <div className="grid items-center w-full col-span-10 gap-2">
                  <Label htmlFor="email">Validator's Wallet Address</Label>
                  <Input
                    type="text"
                    name="field1"
                    placeholder="0x12345..."
                    value={valWalletAddressFieldVal}
                    onChange={handleValWalletAddressFieldChange}
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
                {validatorsArr.map((val, index) => (
                  <>
                    <Card className="dark" key={index}>
                      <CardContent className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-12">
                          <p className="leading-7 ">{val.walletAddress}</p>
                        </div>
                        <Button
                          size={'sm'}
                          variant={'destructive'}
                          className="grid col-span-1"
                          onClick={(event) =>
                            handleDeleteValidator(event, index)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                ))}
              </div>
            </div>
            <div className="grid justify-end">
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

export default CreateWill
