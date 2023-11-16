import { Info, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function InheritableFund({
  balance,
  ethUsd,
}: {
  balance: number
  ethUsd: number
}) {
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
                  <p>Your inheritable fund and its value in USD ($) TO CHANGE!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Inheritable Fund
          </CardTitle>
          <Wallet className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <div className="text-2xl font-bold">{balance} ETH</div>
          {balance > 0 ? (
            <p className="text-primary-foreground/50">
              ~${(balance * ethUsd).toFixed(2)}
            </p>
          ) : (
            <p className="text-primary-foreground/50">~$0</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
