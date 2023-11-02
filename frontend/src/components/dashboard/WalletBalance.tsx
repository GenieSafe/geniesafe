import { Info, Wallet } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

// TODO: getServerSideProps here

export default function WalletBalance({
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
                  <p>
                    Your transferable Metamask wallet balance and its value in
                    USD ($)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Transferable Fund
          </CardTitle>
          <Wallet className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <div className="text-2xl font-bold">{balance} ETH</div>
          <p className="text-primary-foreground/50">
            ~${(balance * ethUsd).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </>
  )
}
