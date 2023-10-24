import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { AreaChart } from '@tremor/react'

const chartdata = [
  {
    date: 'Jan 22',
    Price: 2890,
  },
  {
    date: 'Feb 22',
    Price: 2756,
  },
  {
    date: 'Mar 22',
    Price: 3322,
  },
  {
    date: 'Apr 22',
    Price: 3470,
  },
  {
    date: 'May 22',
    Price: 3475,
  },
  {
    date: 'Jun 22',
    Price: 3129,
  },
]

const customTooltip = ({ payload, active }: { payload: any; active: any }) => {
  if (!active || !payload) return null
  return (
    <div className="w-56 p-2 shadow-none rounded-tremor-default text-tremor-default glass">
      {payload.map((category: any, idx: any) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div
            className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
          />
          <div className="">
            <p className="text-tremor-content">{category.dataKey}</p>
            <p className="font-medium text-tremor-content ">
              $ {category.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) 
}

export default function ETHPriceChart() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="font-medium">
            Ethereum Price Over Time (USD)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <AreaChart
            className="mt-4 h-72"
            data={chartdata}
            index="date"
            categories={['Price']}
            colors={['violet']}
            customTooltip={customTooltip}
          />
        </CardContent>
      </Card>
    </>
  )
}
