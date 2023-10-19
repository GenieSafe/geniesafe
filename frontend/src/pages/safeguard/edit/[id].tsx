import { useState, ChangeEvent } from 'react'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Label } from '../../../components/ui/label'
import { Progress } from '../../../components/ui/progress'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'

import { Trash2 } from 'lucide-react'

import { Database, Tables } from '../../../lib/database.types'

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
  `)

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

  const [verifiersArr, setVerifiersArr] = useState<Tables<'verifiers'>[]>(
    config[0].verifiers
  )
  const [verifierInputVal, setVerifierInputVal] = useState('')
  const [pkInputVal, setPkInputVal] = useState(config[0].private_key)

  const handleVerifierInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifierInputVal(e.target.value)
  }

  const handlePkInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPkInputVal(e.target.value)
  }

  const handleAddVerifier = async () => {
    if (verifierInputVal.trim() === '') {
      alert('Please fill in the field')
    } else if (verifiersArr.length >= 3) {
      alert('You can only have up to 3 verifiers')
    } else if (
      verifiersArr.some(
        (verifier) =>
          (verifier.metadata as Record<string, any>).wallet_address ===
          verifierInputVal
      )
    ) {
      alert('Verifier with the same wallet address already exists')
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', verifierInputVal)

      if (!error && data) {
        const newVerifier: any = {
          user_id: data[0].id,
          metadata: data[0],
        }

        setVerifiersArr([...verifiersArr, newVerifier])

        if (verifiersArr.length >= 2) {
          setVerifierInputVal('')
        }
      } else {
        // API call failed
        // Handle the error
        console.log(error)
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
      in_private_key: pkInputVal,
      in_config_id: config[0].id,
    })

    if (!error) {
      router.push('/safeguard')
    } else {
      console.log(error)
    }
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    const { error } = await supabase
      .from('wallet_recovery_config')
      .delete()
      .eq('id', config[0].id)

    if (!error) {
      router.push('/safeguard')
    }
  }

  return (
    <>
      <div className="container pb-8">
        <div className="flex flex-col gap-4">
          <p>Editing configuration</p>
          <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
            Safeguard your wallet
          </h1>
          <p className="leading-7 ">
            Worry you might lose access to your wallet? Assign trusted Verifiers
            to help safeguard your private key.
          </p>
        </div>
        <div className="grid items-center w-full gap-10 pt-8">
          <div className="grid w-full  items-center gap-1.5">
            <Label>Private Key</Label>
            <Input
              type="password"
              id="privateKey"
              placeholder=""
              onChange={handlePkInputChange}
              value={pkInputVal}
            />
          </div>
          <div className="grid gap-1.5">
            <Progress value={Math.floor((verifiersArr.length / 3) * 100)} />
            <Label className="justify-self-end">
              {verifiersArr.length}/3 Verifiers
            </Label>
          </div>
          <div className="grid w-full items-center gap-1.5">
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
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              onClick={handleDelete}
              variant={'destructive'}
            >
              Delete
            </Button>
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={verifiersArr.length === 3}
            >
              Confirm verifiers
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
