import { Button } from './ui/button'
import {
  Edit3,
  CheckCircle2,
  XCircle,
  Copy,
  Unlock,
  BellRing,
  CheckCheck,
} from 'lucide-react'
import { Tables } from '../lib/database.types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function SafeguardCard({
  config,
  privateKey,
}: {
  config: any
  privateKey?: string | null
}) {
  const supabase = useSupabaseClient()
  const copyText = () => {
    privateKey && navigator.clipboard.writeText(privateKey)
  }

  async function onDialogClose() {
    const { error: config_error } = await supabase
      .from('wallet_recovery_config')
      .update({ status: 'INACTIVE' })
      .eq('id', config.id)

    const { error: verifiers_error } = await supabase
      .from('verifiers')
      .update({ has_verified: false })
      .eq('config_id', config.id)

    if (!config_error && !verifiers_error) {
      window.location.reload()
    }
  }

  return (
    <>
      <Card className="hover:shadow-[0px_0px_20px_0px_hsl(var(--primary))] transition-shadow duration-500 p-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <Link
            href={
              config.status === 'INACTIVE'
                ? `/safeguard/edit/${config.id}`
                : '#'
            }
            className={
              config.status === 'INACTIVE'
                ? 'pointer-events-auto'
                : 'pointer-events-none'
            }
          >
            <CardTitle className="text-3xl font-semibold tracking-tight scroll-m-20">
              Safeguard
            </CardTitle>
          </Link>
          {!privateKey && (
            <Button size={'sm'} disabled={config.status === 'ACTIVE'}>
              {config.status === 'INACTIVE' && (
                <BellRing className="w-4 h-4 mr-2" />
              )}
              {config.status === 'ACTIVE' && (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              {config.status === 'ACTIVE'
                ? 'Verifiers notified'
                : 'Notify verifiers'}
            </Button>
          )}
        </CardHeader>
        <CardContent
          className={`flex justify-center gap-4 ${
            privateKey ? 'flew-row' : 'flex-col'
          }`}
        >
          {privateKey ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-fit">
                    <Unlock className="w-4 h-4 mr-2" />
                    Reveal private key
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="flex flex-col"
                  onInteractOutside={(e) => {
                    e.preventDefault()
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Here is your private key</DialogTitle>
                    <DialogDescription className="text-destructive">
                      You can only view this{' '}
                      <span className="font-bold">ONCE</span> and will need to
                      go through the same process once this window is closed.
                      Please save this private key somewhere safe.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center w-full space-x-2">
                    <Input
                      type="text"
                      value={privateKey}
                      readOnly
                      id="pkInput"
                    />
                    <Button
                      type="button"
                      size={'icon'}
                      variant={'outline'}
                      onClick={() => copyText()}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      variant={'destructive'}
                      onClick={() => onDialogClose()}
                    >
                      Close
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">Verifiers</p>
              <div className="flex gap-4">
                {config.verifiers.map((verifier: any, index: number) => (
                  <Card key={index} className="">
                    <CardContent className="flex items-center gap-6 pt-6">
                      <div className="flex flex-col w-24">
                        <p className="text-lg font-semibold truncate">
                          {verifier.profiles.first_name}{' '}
                          {verifier.profiles.last_name}
                        </p>
                        <p className="truncate">
                          {verifier.profiles.wallet_address}
                        </p>
                      </div>
                      {verifier.has_verified ? (
                        <CheckCircle2 className="text-success"></CheckCircle2>
                      ) : (
                        <XCircle className="text-destructive"></XCircle>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
