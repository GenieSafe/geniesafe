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
  deceased: z.string().regex(/^(\d{6}-\d{2}-\d{4})$/),
})

const ActivateWill: NextPage = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deceased: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
      <div className="container flex flex-col gap-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
          Activate a will
        </h1>
        <p>
          By activating this person's will, you are declaring them deceased. The
          validators of the deceased shall be notified and prompted to validate
          this information before any inheritance is executed.
        </p>
      </div>
      <div className="container flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="deceased"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deceased Identity Number</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXXXX-XX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Start Activation Process</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default ActivateWill
