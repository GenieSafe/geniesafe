import { useState, ChangeEvent } from 'react'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Label } from '../../../components/ui/label'
import { Progress } from '../../../components/ui/progress'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'

import { Trash2 } from 'lucide-react'

import { Database, Tables } from '../../../lib/database.types'
import { toast } from '@/components/ui/use-toast'
import { useAddress } from '@thirdweb-dev/react'

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
  const { data, error } = await supabase.from('wallet_recovery_config').select(`
    id, private_key, status,
    verifiers(user_id, has_verified, verified_at, metadata:user_id(first_name, last_name, wallet_address))
  `).eq('user_id', session.user.id).single()

  return {
    props: {
      initialSession: session,
      config: data ?? error,
    },
  }
}

export default function EditConfig({ config }: { config: any }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const address = useAddress()

  const [verifiersArr, setVerifiersArr] = useState<Tables<'verifiers'>[]>(
    config.verifiers
  )
  const [verifierInputVal, setVerifierInputVal] = useState('')

  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handleAddVerifier = async () => {
    if (verifierInputVal.trim() === '') {
      toast({
        title: 'Error',
        description: `Please fill in a verifier wallet address.`,
        variant: 'destructive',
      })
    } else if (verifiersArr.length >= 3) {
      toast({
        title: 'Error',
        description: `You can only have up to 3 verifiers.`,
        variant: 'destructive',
      })
    } else if (
      verifiersArr.some(
        (verifier) =>
          (verifier.metadata as Record<string, any>).wallet_address ===
          verifierInputVal
      )
    ) {
      toast({
        title: 'Error',
        description: `Verifier with the same wallet address already exists.`,
        variant: 'destructive',
      })
    } else if (address === verifierInputVal) {
      toast({
        title: 'Error',
        description: 'You cannot add yourself as a verifier.',
        variant: 'destructive',
      })
    }else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', verifierInputVal).single()

      if (!error && data) {
        const newVerifier: any = {
          user_id: data.id,
          metadata: data,
        }

        setVerifiersArr([...verifiersArr, newVerifier])

        if (verifiersArr.length >= 2) {
          setVerifierInputVal('')
        }
      } else {
        toast({
          title: 'Error',
          description: `User with the address does not exist.`,
          variant: 'destructive',
        })
      }
    }

    setVerifierInputVal('')
  }

  const handleDeleteVerifier = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault()
    const upVerifiersArr = [...verifiersArr]
    upVerifiersArr.splice(index, 1)
    setVerifiersArr(upVerifiersArr)
  }

  const onSubmit = async () => {
    let { data, error } = await supabase.rpc('update_config', {
      in_verifiers: verifiersArr,
      in_config_id: config.id,
    })

    if (!error) {
      toast({
        title: 'Success'
        description: 'Safeguard configuration updated successfully!',
        variant: 'success',
      })
      router.push('/safeguard')
    } else {
      toast({
        title: 'Error updating safeguard configuration',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    const { error } = await supabase
      .from('wallet_recovery_config')
      .delete()
      .eq('id', config.id)

    if (!error) {
      toast({
        title: 'Safeguard configuration updated deleted successfully!',
        variant: 'success',
      })
      router.push('/safeguard')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Edit Safeguard Configuration
        </h1>
      </div>
      <Card>
        <CardContent className="p-12 space-y-8">
          <div className="grid gap-2">
              <Label className="justify-self-end">
                {verifiersArr.length}/3 verifiers
              </Label>
              <Progress value={Math.floor((verifiersArr.length / 3) * 100)} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid items-center w-full gap-2">
              <Label>Verifier's Wallet Address</Label>
              <div className="flex items-center w-full space-x-4">
                <Input
                  type="text"
                  placeholder="0x12345..."
                  value={verifierInputVal}
                  onChange={handleVerifierInputChange}
                  disabled={verifiersArr.length === 3}
                />
                <Button
                  type="submit"
                  onClick={handleAddVerifier}
                  disabled={verifiersArr.length === 3}
                >
                  Assign
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {verifiersArr.map((verifier, index) => (
                <Card className="dark" key={index}>
                  <CardContent className="pt-6">
                    <div className="flex flex-row items-center justify-between">
                      <p>
                        {(verifier.metadata as Record<string, any>).first_name}{' '}
                        {(verifier.metadata as Record<string, any>).last_name}
                      </p>
                      <Button
                        size={'sm'}
                        variant={'destructive'}
                        onClick={(event) => handleDeleteVerifier(event, index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              size={'lg'}
              onClick={handleDelete}
              variant={'destructive'}
            >
              Delete
            </Button>
            <Button
              type="submit"
              size={'lg'}
              onClick={onSubmit}
              disabled={verifiersArr.length < 3}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
