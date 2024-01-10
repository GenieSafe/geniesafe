import { Info, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function InheritableFund({
  inheritableFund,
  ethUsd,
  willStatus,
}: {
  inheritableFund: number
  ethUsd: number
  willStatus: string
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
                  <p>Fund stored in your will and its value in USD ($)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Inheritable Fund
          </CardTitle>
          <Wallet className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          {inheritableFund !== null ? (
            <>
              <div className="text-2xl font-bold">
                {willStatus === 'EXECUTED' ? 0 : inheritableFund} ETH
              </div>
              <p className="text-primary-foreground/50">
                ~${(inheritableFund * ethUsd).toFixed(2)}
              </p>
            </>
          ) : (
            <>
              <p className="text-center text-primary-foreground/50">
                No will created yet
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
