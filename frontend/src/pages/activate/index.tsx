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

const formSchema = z.object({
  icNumber: z
    .string()
    .refine((icNumber) => /^\d{6}-\d{2}-\d{4}$/.test(icNumber), {
      message: 'Invalid I/C number format',
    }),
})

export default function Activate() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const formatICNumber = (icNumber: string) => {
    // Remove dashes and ensure it's a valid I/C number
    icNumber = icNumber.replace(/-/g, '')
    if (/^\d{12}$/.test(icNumber)) {
      // Insert dashes in the correct positions as the user types
      icNumber = icNumber.replace(/(\d{6})(\d{2})(\d{4})/, '$1-$2-$3')
    }
    return icNumber
  }

  const handleICNumberChange = (e: { target: { value: string } }) => {
    // Limit the input field to 12 characters
    const inputWithoutDashes = e.target.value.replace(/-/g, '').slice(0, 12)
    const formattedICNumber = formatICNumber(inputWithoutDashes)
    form.setValue('icNumber', formattedICNumber)
  }

  const onSubmit = (data: any) => {
    console.log(data)
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
                    onChange={handleICNumberChange}
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
            <Button size={'lg'} type="submit">
              Activate
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
