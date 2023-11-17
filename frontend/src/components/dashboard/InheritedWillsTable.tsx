import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { ArrowRight, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export default function InheritedWills({ data }: { data: any }) {
  return (
    <>
      <Card className={data.length < 4 ? '' : 'h-full'}>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="flex items-center justify-center font-medium">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 mr-2 text-primary-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wills you are currently inheriting</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Inherited Wills
          </CardTitle>
          <Link href="/wills">
            <ArrowRight className="w-6 h-6 text-primary hover:text-primary-foreground" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col h-full space-y-1">
          {data.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Will Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Division</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((data: any) => (
                  <TableRow>
                    <TableCell className="flex gap-2 font-medium">
                      {data.wills.metadata.first_name}{' '}
                      {data.wills.metadata.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          data.wills.status === 'ACTIVE'
                            ? 'success'
                            : data.wills.status === 'INACTIVE'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {data.wills.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-primary-foreground/50">
              You are currently not inheriting any wills
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
