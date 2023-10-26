import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ConnectWallet, useAddress, useWallet } from '@thirdweb-dev/react'

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(30, { message: 'Password cannot be more than 30 characters' }),
  first_name: z.string(),
  last_name: z.string(),
  ic_number: z.string().regex(/^(\d{6}-\d{2}-\d{4})$/),
})

export default function Register() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)
  const address = useAddress()
  const wallet = useWallet()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      ic_number: '',
    },
  })

  async function signUpWithEmail(values: z.infer<typeof registerSchema>) {
    const { data: signup_data, error: signup_error } =
      await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            address: address,
          },
        },
      })

    if (!signup_error && signup_data) {
      const { error } = await supabase.from('profiles').insert({
        id: signup_data.user?.id,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        wallet_address: address,
        ic_number: values.ic_number,
      })

      !error ? router.push('/') : console.log(error)
    }
  }

  useEffect(() => {
    if (user) router.push('/')
  }, [user])

  useEffect(() => {
    wallet?.disconnect()
  }, [])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(signUpWithEmail)}
          className="grid gap-4 lg:gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>Create a geniesafe account</CardDescription>
              </div>
              <ConnectWallet
                dropdownPosition={{
                  side: 'bottom',
                  align: 'center',
                }}
              />
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center w-full space-x-2">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="********"
                            {...field}
                          />
                          <Button
                            size="icon"
                            type="button"
                            onClick={handleShowPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your first name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <FormField
                control={form.control}
                name="wallet_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your wallet address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="ic_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I/C Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your I/C number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <Button className="w-full">Register</Button>
              <Button variant={'link'} size={'sm'} asChild>
                <Link href="/">Sign in to your account</Link>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  )
}
