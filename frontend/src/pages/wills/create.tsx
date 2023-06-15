'use client'

import { NextPage } from 'next'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { cn } from '../../lib/utils'

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

const formSchema = z.object({
  willTitle: z.string().min(5).max(30),
  identityNumber: z.string().regex(/^(\d{6}-\d{2}-\d{4})$/),
  walletAddress: z.string(),
  beneficiaries: z.object({
    name: z.string(),
    // walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/g),
    // relationship: z.string(),
  }),
  // validators: z.object({
  //   name: z.string(),
  // }),
})

const CreateWill: NextPage = () => {
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
    console.log(values)
  }
  
  // function onAdd(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values)
  //   will.push(values)
  //   console.log(will)
  // }

  return (
    <>
      <div className="container flex items-center justify-between pt-12 pb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
          Create a will
        </h1>
      </div>
      <div className="container flex flex-col gap-4">
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
            {/* <div className="flex flex-col">
              <h1 className="pb-4 text-2xl font-bold tracking-tight scroll-m-20">
                Beneficiaries
              </h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="beneficiaries.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My First Will" {...field} name="name" onChange={handleChange}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </Form>
              {showResult && (
                <div>
                  <h2>Form Data:</h2>
                  <p>Name: {formData.name}</p>
                </div>
              )}
            </div> */}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateWill
