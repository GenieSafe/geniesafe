import Link from 'next/link'
import { Badge } from '../ui/badge'
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
import { ArrowRight } from 'lucide-react'

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

export default function InheritedWills({ data }: { data: any }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="font-medium">Inherited Wills</CardTitle>
          <Link href="/wills">
            <ArrowRight className="w-6 h-6 text-primary hover:text-primary-foreground" />
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-full space-y-1">
          {data.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Will Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Division</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((data: any) => (
                  <TableRow>
                    <TableCell className="flex gap-2 font-medium">
                      {data.wills.metadata.first_name}{' '}
                      {data.wills.metadata.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          data.wills.status === 'ACTIVE'
                            ? 'success'
                            : data.wills.status === 'INACTIVE'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {data.wills.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-primary-foreground/50">
              You are currently not inheriting any wills
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
