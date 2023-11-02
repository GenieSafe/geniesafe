import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { Button } from '../ui/button'
import { AreaChart } from '@tremor/react'
import { ArrowLeftRight, Info } from 'lucide-react'

const customTooltip = ({
  payload,
  active,
  label,
}: {
  payload: any
  active: any
  label: any
}) => {
  if (!active || !payload) return null
  return (
    <div className="p-2 shadow-none w-52 rounded-tremor-default text-tremor-default glass">
      {payload.map((category: any) => (
        <div key={label} className="flex flex-1 space-x-2.5">
          <div
            className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
          />
          <div className="">
            <p className="font-medium text-tremor-content">{label}</p>
            <p className="text-tremor-content">
              {category.dataKey}:&nbsp;
              <span className="font-medium">${category.value}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TrendOverviewChart({
  ethPriceTrend,
  balance,
}: {
  ethPriceTrend: any
  balance: number
}) {
  const chartData = ethPriceTrend.prices.map(
    ([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toLocaleString('default', {
        month: 'short',
        day: 'numeric',
      }),
      'Wallet Value': (price * balance).toFixed(2),
      'ETH Price': price.toFixed(2),
    })
  )
  const [isWallet, setIsWallet] = useState(true)

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
                    Area chart depicting the trend of your Metamask wallet value{' '}
                    <br /> based on Ethereum prices for the past 30 days.
                    <br />
                    You can toggle between wallet value and Ethereum price.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Trend Overview (USD)
          </CardTitle>
          <Button
            size={'sm'}
            variant={'outline'}
            onClick={() => (isWallet ? setIsWallet(false) : setIsWallet(true))}
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            {isWallet ? 'Ethereum Price' : 'Wallet Value'}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <AreaChart
            className="h-72"
            data={chartData}
            index="date"
            categories={isWallet ? ['Wallet Value'] : ['ETH Price']}
            colors={isWallet ? ['violet'] : ['blue']}
            customTooltip={customTooltip}
          />
        </CardContent>
      </Card>
    </>
  )
}
