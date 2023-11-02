import { ArrowRight, Info, Plus, UserCheck, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export default function WillStatus({ will }: { will: any }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="flex items-center justify-center font-medium">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 mr-2 text-primary-foreground/50 hover:text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Current will status and the number of beneficiaries and
                    validators
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Will Status
          </CardTitle>
          {will != null ? (
            <Link href="/wills">
              <ArrowRight className="w-6 h-6 text-primary hover:text-primary-foreground" />
            </Link>
          ) : (
            <Link href="/wills/create">
              <Plus className="w-6 h-6 text-primary hover:text-primary-foreground" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full space-y-1">
          {will != null ? (
            <>
              <Badge
                className="text-sm"
                variant={
                  will.status === 'ACTIVE'
                    ? 'success'
                    : will.status === 'INACTIVE'
                    ? 'destructive'
                    : 'default'
                }
              >
                {will.status}
              </Badge>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {will.beneficiaries.length}
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  {will.validators.length}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-primary-foreground/50">
                No will created yet
              </p>
              <p className="text-sm text-center text-primary-foreground/50">
                Create one by clicking the + icon
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
