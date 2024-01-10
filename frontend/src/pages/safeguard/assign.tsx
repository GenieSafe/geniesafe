import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'

import { Trash2 } from 'lucide-react'

import { Database, Tables } from '../../lib/database.types'
import { toast } from '@/components/ui/use-toast'
import { useAddress } from '@thirdweb-dev/react'

export default function AssignConfig() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const address = useAddress()

  const [verifiersArr, setVerifiersArr] = useState<Tables<'verifiers'>[]>([])
  const [verifierInputVal, setVerifierInputVal] = useState('')
  const [pkInputVal, setPkInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handlePkInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPkInputVal(e.target.value)
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
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', verifierInputVal)

      if (!error && data.length > 0) {
        const newVerifier: any = {
          user_id: data[0].id,
          metadata: data[0],
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
    setIsLoading(true)
    console.info('Retrieving encryption key...')

    setTimeout(() => {
      console.info('Encrypting private key...')
    }, 2000)

    setTimeout(async () => {
      const { data: config_data, error: config_error } = await supabase
        .from('wallet_recovery_config')
        .insert({
          private_key: pkInputVal as string,
          user_id: user?.id as string,
        })
        .select()

      if (!config_error) {
        verifiersArr.forEach(async (verifier) => {
          verifier.config_id = config_data[0].id as string
        })

        const { data: ver_data, error: ver_error } = await supabase
          .from('verifiers')
          .insert(verifiersArr)
          .select()

        if (!ver_error) {
          setIsLoading(false)
          toast({
            title: 'Safeguard configuration created successfully!',
            description:
              'Your private key has been encrypted and stored in our database.',
            variant: 'success',
          })
          router.push('/safeguard')
        } else {
          toast({
            title: 'Error creating safeguard configuration',
            description: ver_error.message,
            variant: 'destructive',
          })
        }
      }
    }, 10000)
  }

  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-5xl font-bold tracking-tight scroll-m-20">
          Create Safeguard Configuration
        </h1>
      </div>
      <Card>
        <CardContent className="p-12 space-y-8">
          <div className="grid items-center w-full gap-2">
            <Label>Private Key</Label>
            <Input
              type="password"
              id="privateKey"
              placeholder=""
              onChange={handlePkInputChange}
              value={pkInputVal}
            />
          </div>
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
          <div className="flex justify-end">
            {!isLoading ? (
              <Button
                type="submit"
                size={'lg'}
                onClick={onSubmit}
                disabled={verifiersArr.length < 3}
              >
                Create Safeguard
              </Button>
            ) : (
              <Button size={'lg'} disabled>
                <div className="loading-spinner"></div>
                Encrypting...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
