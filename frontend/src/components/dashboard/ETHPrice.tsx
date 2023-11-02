import { Info } from 'lucide-react'
import ETH from '../../../public/icons/ethereum-icon.svg'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export default function ETHPrice({
  ethUsd,
  eth24hrChange,
}: {
  ethUsd: number
  eth24hrChange: number
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
                  <p>
                    Current global price of Ethereum and the price change
                    percentage
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Ethereum Price
          </CardTitle>
          <ETH className="w-7 h-7 text-primary" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <div className="text-2xl font-bold">${ethUsd}</div>
          {eth24hrChange > 0 ? (
            <p className="text-success">+{eth24hrChange.toFixed(2)}%</p>
          ) : (
            <p className="text-destructive">{eth24hrChange.toFixed(2)}%</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
