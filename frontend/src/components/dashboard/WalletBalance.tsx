import { Wallet } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'

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
          <CardTitle className="font-medium">Your Balance</CardTitle>
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
