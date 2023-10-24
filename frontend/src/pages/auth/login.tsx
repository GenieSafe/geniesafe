import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState } from 'react'
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
import { Eye, EyeOff, Github } from 'lucide-react'
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

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(30, { message: 'Password cannot be more than 30 characters' }),
})

export default function Login() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function signInWithEmail(values: z.infer<typeof signInSchema>) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    !error ? router.push('/') : console.log(error)
  }

  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    !error ? router.push('/') : console.log(error)
  }

  if (!user)
    return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signInWithEmail)}
            className="grid gap-4 lg:gap-6"
          >
            <Card className="w-96">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>Enter your email and password</CardDescription>
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
              </CardContent>
              <CardFooter className="flex flex-col items-center">
                <Button className="w-full">Sign in</Button>
                <Button variant={'link'} size={'sm'} asChild>
                  <Link href="#">Register for an account</Link>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </>
    )
}
