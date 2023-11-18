import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/lib/database.types'
import { useRouter } from 'next/router'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useConnectionStatus, useContract } from '@thirdweb-dev/react'
import { sendMail } from '@/lib/emailHelper'
import { Card, CardContent } from '@/components/ui/card'
import ValidationPromptEmail from '../../emails/ValidationPromptEmail'
import { render } from '@react-email/components'

export default function InheritedWillsTable({ data }: { data: any }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const { toast } = useToast()
  const connectionStatus = useConnectionStatus()

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  )

  async function handleActivateWill(id: string) {
    // Get will data based on id
    const will = data.find((item: any) => item.wills.id === id)

    if (!will) {
      console.error('Will not found for id:', id)
      toast({
        title: 'Will not found!',
        description: 'Please refresh and try again.',
        variant: 'destructive',
      })
      return
    }
    try {
      // Update will status to ACTIVE
      const { error: updateWillStatusError } = await supabase
        .from('wills')
        .update({
          status: 'ACTIVE',
          activated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateWillStatusError) {
        console.error('Update status failed', updateWillStatusError)
        toast({
          title: 'Update will status failed!',
          description: 'Please refresh and try again.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Will status updated successfully!',
          description: 'Validators will be notified via email.',
        })

        // Extract emails from will.wills.validators.profiles.email
        const validatorEmails = will.wills.validators
          .map((validator: any) => validator.profiles.email)
          .join(', ')

        const willId = will.wills.id
        for (const validator of will.wills.validators) {
          const validatorId = validator.id
          // Email validators
          const payload = {
            to: validator.profiles.email,
            subject: `${will.profiles.first_name}'s will is pending your validation, ${validator.profiles.first_name}`,
            html: render(
              ValidationPromptEmail({
                redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/wills/validate/${willId}/${validatorId}`,
              })
            ),
          }
          sendMail(payload)
        }

        setTimeout(() => {
          router.reload()
        }, 3000)
      }
    } catch (error) {
      console.error('Create will failed', error)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Will Owner</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Validation Status</TableHead>
              <TableHead className="text-center">Division</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, i: number) => (
              <TableRow key={i}>
                <TableCell>
                  {item.wills.profiles.first_name}{' '}
                  {item.wills.profiles.last_name}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      item.wills.status === 'ACTIVE'
                        ? 'success'
                        : item.wills.status === 'INACTIVE'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {item.wills.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {/* Display this badge if will status is active */}
                  {item.wills.status === 'ACTIVE' ? (
                    <Badge>
                      {`${
                        item.wills.validators.filter(
                          (validator: any) => validator.has_validated
                        ).length
                      }/${item.wills.validators.length} VALIDATED`}
                    </Badge>
                  ) : (
                    <Badge>N/A</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center ">
                  {item.percentage}%
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {item.wills.status === 'INACTIVE' ? (
                        <Button variant="ghost" size="sm" disabled>
                          Activate
                        </Button>
                      ) : connectionStatus === 'disconnected' ? (
                        <Button variant="ghost" size="sm" disabled>
                          Wallet disconnected
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          {item.wills.status.charAt(0).toUpperCase() +
                            item.wills.status.slice(1).toLowerCase()}
                        </Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Activate will?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Activate this will upon the owner's death. Once
                          activated, the will will be created on our smart
                          contract, and validators will receive email
                          notifications for will validation. Please note that
                          activation incurs a gas fee.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleActivateWill(item.wills.id)
                          }}
                        >
                          Activate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
