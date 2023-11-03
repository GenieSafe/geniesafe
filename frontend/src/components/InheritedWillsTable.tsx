import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
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
} from './ui/alert-dialog'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '../lib/database.types'
import { useRouter } from 'next/router'
import { useToast } from './ui/use-toast'
import { Button } from './ui/button'
import { useContract, useContractWrite } from '@thirdweb-dev/react'

export default function InheritedWillsTable({ data }: { data: any }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const { toast } = useToast()

  const willContract = process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS
  const { contract } = useContract(willContract)
  const { mutateAsync: createWill, isLoading } = useContractWrite(
    contract,
    'createWill'
  )

  async function handleActivateWill(id: string) {
    // Initialize empty arrays for beneficiaries and percentages
    const _beneficiaries: string[] = []
    const _percentages: number[] = []

    // Get will data based on id
    const will = data.filter((item: any) => item.wills.id === id)[0]

    // Get beneficiaries array from will
    const beneficiaries = will.wills.beneficiaries

    // Extract beneficiaries and percentages from beneficiaries array
    // Data is formatted for WillContract
    for (const beneficiary of beneficiaries) {
      _beneficiaries.push(beneficiary.profiles.wallet_address)
      _percentages.push(beneficiary.percentage)
    }

    // Create will on WillContract
    try {
      const data = await createWill({
        args: [id, _beneficiaries, _percentages],
      })
      console.info('Create will successful', data)
    } catch (error) {
      console.error('Create will failed', error)
    }

    // Update will DB status to ACTIVE
    const { error } = await supabase
      .from('wills')
      .update({ status: 'ACTIVE' })
      .eq('id', id)
    if (error) console.error('Update status failed', error)

    // Show toast and reload page after 2 seconds
    window.setTimeout(() => {
      toast({
        title: 'Will activated successfully!',
        description: 'Validators will be notified via email.',
      })
      window.setTimeout(() => {
        router.reload()
      }, 2000)
    }, 500)
  }

  return (
    <Table>
      <TableCaption>A list of your inherited wills.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Will Owner</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Validation Status</TableHead>
          <TableHead className="text-center">Division</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: any, i: number) => (
          <TableRow key={i}>
            <TableCell>
              {item.wills.profiles.first_name} {item.wills.profiles.last_name}
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
            <TableCell className="text-center ">{item.percentage}%</TableCell>
            <TableCell className="text-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {item.wills.status === 'ACTIVE' ? (
                    <Button variant="ghost" disabled>
                      Activated
                    </Button>
                  ) : connectionStatus === 'disconnected' ? (
                    <Button variant="ghost" disabled>
                      Disconnected
                    </Button>
                  ) : (
                    <Button variant="ghost">Activate</Button>
                  )}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Activate will?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Activate this will only upon the owner's death. Once
                      activated, validators will receive email notifications for
                      will validation.
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
  )
}
