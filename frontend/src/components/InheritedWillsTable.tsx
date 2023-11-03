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

export default function InheritedWillsTable({ data }: { data: any }) {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const { toast } = useToast()

  // Update will status to ACTIVE
  async function handleActivateWill(id: string) {
    const { error } = await supabase
      .from('wills')
      .update({ status: 'INACTIVE' })
      .eq('id', id)
    if (error) {
      console.log(error)
    }

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
            <TableCell className="text-center ">{item.percentage}%</TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {item.wills.status === 'INACTIVE' && (
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
