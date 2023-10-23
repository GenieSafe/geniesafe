import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../../components/ui/button'

const formSchema = z.object({
  icNumber: z
    .string()
    .min(12, 'Must be 12 characters')
    .max(12, 'Must be 12 characters'),
})

export default function Activate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <>
      <div className="flex items-center justify-between pb-12">
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
                <FormLabel>I/C Number</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., 010101-01-0101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button size={'lg'} type="submit">
              Activate
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
