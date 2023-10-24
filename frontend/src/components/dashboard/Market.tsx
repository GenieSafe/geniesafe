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

const coinsData = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image:
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
    current_price: 34406,
    market_cap: 673740052650,
    market_cap_rank: 1,
    fully_diluted_valuation: 724724192530,
    total_volume: 41969946269,
    high_24h: 35066,
    low_24h: 30446,
    price_change_24h: 3915.08,
    price_change_percentage_24h: 12.83996,
    market_cap_change_24h: 76344265851,
    market_cap_change_percentage_24h: 12.77951,
    circulating_supply: 19522656,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -50.18084,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 50627.0775,
    atl_date: '2013-07-06T00:00:00.000Z',
    roi: null,
    last_updated: '2023-10-24T10:40:21.444Z',
    price_change_percentage_24h_in_currency: 12.839957588474379,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
    current_price: 1826.53,
    market_cap: 219884398984,
    market_cap_rank: 2,
    fully_diluted_valuation: 219884398984,
    total_volume: 28775821453,
    high_24h: 1844.54,
    low_24h: 1664.99,
    price_change_24h: 153.55,
    price_change_percentage_24h: 9.17804,
    market_cap_change_24h: 18278336419,
    market_cap_change_percentage_24h: 9.06636,
    circulating_supply: 120265514.426766,
    total_supply: 120265514.426766,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -62.56953,
    ath_date: '2021-11-10T14:24:19.604Z',
    atl: 0.432979,
    atl_change_percentage: 421619.43362,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: {
      times: 69.95953079088581,
      currency: 'btc',
      percentage: 6995.953079088581,
    },
    last_updated: '2023-10-24T10:40:22.125Z',
    price_change_percentage_24h_in_currency: 9.178038169483987,
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image:
      'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
    current_price: 0.9998,
    market_cap: 84184115651,
    market_cap_rank: 3,
    fully_diluted_valuation: 84184115651,
    total_volume: 63097444314,
    high_24h: 1.055,
    low_24h: 0.99386,
    price_change_24h: -0.000373615330439003,
    price_change_percentage_24h: -0.03736,
    market_cap_change_24h: 88669141,
    market_cap_change_percentage_24h: 0.10544,
    circulating_supply: 84165234500.6047,
    total_supply: 84165234500.6047,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.43479,
    ath_date: '2018-07-24T00:00:00.000Z',
    atl: 0.572521,
    atl_change_percentage: 74.63111,
    atl_date: '2015-03-02T00:00:00.000Z',
    roi: null,
    last_updated: '2023-10-24T10:40:00.669Z',
    price_change_percentage_24h_in_currency: -0.03735505596465063,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image:
      'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
    current_price: 229.93,
    market_cap: 35463990946,
    market_cap_rank: 4,
    fully_diluted_valuation: 46100192870,
    total_volume: 1032545254,
    high_24h: 236.45,
    low_24h: 218.29,
    price_change_24h: 10.34,
    price_change_percentage_24h: 4.70874,
    market_cap_change_24h: 1535486928,
    market_cap_change_percentage_24h: 4.52565,
    circulating_supply: 153856150,
    total_supply: 153856150,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -66.49685,
    ath_date: '2021-05-10T07:24:17.097Z',
    atl: 0.0398177,
    atl_change_percentage: 577367.62096,
    atl_date: '2017-10-19T00:00:00.000Z',
    roi: null,
    last_updated: '2023-10-24T10:40:14.053Z',
    price_change_percentage_24h_in_currency: 4.708735811035042,
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image:
      'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442',
    current_price: 0.549309,
    market_cap: 29313847624,
    market_cap_rank: 5,
    fully_diluted_valuation: 54852702238,
    total_volume: 1789072160,
    high_24h: 0.557209,
    low_24h: 0.525615,
    price_change_24h: 0.01889186,
    price_change_percentage_24h: 3.5617,
    market_cap_change_24h: 1026240004,
    market_cap_change_percentage_24h: 3.62788,
    circulating_supply: 53441027384,
    total_supply: 99988362642,
    max_supply: 100000000000,
    ath: 3.4,
    ath_change_percentage: -83.83505,
    ath_date: '2018-01-07T00:00:00.000Z',
    atl: 0.00268621,
    atl_change_percentage: 20351.06541,
    atl_date: '2014-05-22T00:00:00.000Z',
    roi: null,
    last_updated: '2023-10-24T10:40:19.841Z',
    price_change_percentage_24h_in_currency: 3.5616989312512906,
  },
]

export default function Market() {
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
              {coinsData.map((coin) => (
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
                  <TableCell className={coin.price_change_percentage_24h > 0 ? "text-success" : "text-destructive" }>{coin.price_change_percentage_24h.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
