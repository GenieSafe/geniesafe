import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import Image from 'next/image'

type CoinData = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null
  last_updated: string
  price_change_percentage_24h_in_currency: number
}

export default function Market({ data }: { data: any }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="font-medium">Market</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Price (USD)</TableHead>
                <TableHead>24h %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((coin: CoinData) => (
                <TableRow>
                  <TableCell className="flex gap-2 font-medium">
                    <Image
                      src={coin.image}
                      width={20}
                      height={20}
                      alt={coin.name}
                    ></Image>
                    {coin.symbol.toUpperCase()}
                  </TableCell>
                  <TableCell>{coin.current_price.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      coin.price_change_percentage_24h > 0
                        ? 'text-success'
                        : 'text-destructive'
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
