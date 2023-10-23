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

export default function WalletBalance() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="font-medium">Your Balance</CardTitle>
          <Wallet className='w-6 h-6 text-primary'/>
        </CardHeader>
        <CardContent className='space-y-1'>
          <div className="text-2xl font-bold">100 ETH</div>
          <p className="text-primary-foreground/50">
            ~ $170,000
          </p>
        </CardContent>
      </Card>
    </>
  )
}
