import { Wallet } from 'lucide-react'
import ETH from '../../../public/icons/ethereum-icon.svg'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

// TODO: getServerSideProps here

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
          <CardTitle className="font-medium">Ethereum Price</CardTitle>
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
