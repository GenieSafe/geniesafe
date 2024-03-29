import { Button, buttonVariants } from './ui/button'
import {
  CheckCircle2,
  XCircle,
  Copy,
  Unlock,
  BellRing,
  CheckCheck,
  Pencil,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import { Input } from './ui/input'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { cn } from '../lib/utils'
import { toast } from './ui/use-toast'
import { useState } from 'react'
import { render } from '@react-email/components'
import SafeguardVerificationPromptEmail from '@/../emails/SafeguardVerificationPromptEmail'
import { sendMail } from '@/lib/emailHelper'

export default function SafeguardCard({
  config,
  privateKey,
}: {
  config: any
  privateKey?: string | null
}) {
  const [configStatus, setConfigStatus] = useState(config.status)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useSupabaseClient()
  const copyText = () => {
    privateKey && navigator.clipboard.writeText(privateKey)
    toast({
      title: 'Private key copied!',
    })
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

  async function onNotify() {
    setIsLoading(true)

    // Update config status to ACTIVE
    try {
      console.info('Updating config status')
      const { error: updateConfigError } = await supabase
        .from('wallet_recovery_config')
        .update({ status: 'ACTIVE' })
        .eq('id', config.id)

      if (updateConfigError) {
        throw new Error(`${updateConfigError}`)
      }

      // Send email to verifiers
      console.info('Sending email to verifiers')

      for (const verifier of config.verifiers) {
        const verifierId = verifier.id
        const payload = {
          to: verifier.profiles.email,
          subject: `${config.profiles.first_name} is requesting your verification, ${verifier.profiles.first_name}`,
          html: render(
            SafeguardVerificationPromptEmail({
              redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/safeguard/verify/${config.id}/${verifierId}`,
            })
          ),
        }
        sendMail(payload)
      }

      setConfigStatus('ACTIVE')

      toast({
        title: 'Update config status success!',
        description: 'Verifiers have been notified.',
        variant: 'success',
      })
      window.location.reload()
    } catch (e) {
      toast({
        title: 'Update config status failed!',
        description: `Error: ${e}`,
        variant: 'destructive',
      })

      // Revert config status to INACTIVE
      console.info('Reverting config status')
      await supabase
        .from('wallet_recovery_config')
        .update({ status: 'INACTIVE' })
        .eq('id', config.id)
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="hover:shadow-[0px_0px_20px_0px_hsl(var(--primary))] transition-shadow duration-500 p-4">
        <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={`w-fit text-3xl font-semibold tracking-tight scroll-m-20 ${config.status == 'INACTIVE' ? "hover:bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] hover:from-violet-200 hover:via-violet-400 hover:to-violet-800 hover:text-transparent hover:bg-clip-text hover:transition-colors hover:duration-300 hover:ease-in-out" : ""}`}>
            <Link
              href={`/safeguard/edit/${config.id}`}
              className={
                config.status != 'INACTIVE'
                ? 'pointer-events-none'
                : 'flex items-center'
              }
              aria-disabled={config.status != 'INACTIVE'}
            >
              Safeguard
              {config.status == 'INACTIVE' && <Pencil className="w-6 h-6 ml-2" />}
            </Link>
          </CardTitle>
          {!privateKey && (
            <Button
              size={'sm'}
              disabled={configStatus !== 'INACTIVE' || isLoading}
              onClick={onNotify}
            >
              {configStatus === 'INACTIVE' &&
                (isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <BellRing className="w-4 h-4 mr-2" />
                    Notify verifiers
                  </>
                ))}
              {configStatus === 'ACTIVE' && (
                <>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Verifiers notified
                </>
              )}
              {configStatus === 'VERIFIED' && (
                <>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Verified
                </>
              )}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-fit">
                    <Unlock className="w-4 h-4 mr-2" />
                    Reveal private key
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="flex flex-col">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Here is your private key
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-destructive">
                      You can only view this{' '}
                      <span className="font-bold">ONCE</span> and will need to
                      go through the same process once this window is closed.
                      Please save this private key somewhere safe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
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
                  <AlertDialogFooter>
                    <AlertDialogAction
                      className={cn(
                        buttonVariants({ variant: 'destructive' }),
                        'w-full'
                      )}
                      onClick={() => onDialogClose()}
                    >
                      Close
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
