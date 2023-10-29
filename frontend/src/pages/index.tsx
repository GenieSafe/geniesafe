import { useSession, useUser } from '@supabase/auth-helpers-react'
import Login from './auth/login'
import WalletBalance from '../components/dashboard/WalletBalance'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'
import ETHPriceChart from '../components/dashboard/ETHPriceChart'
import Market from '../components/dashboard/Market'
import { ethers } from 'ethers'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }

  // Run queries with RLS on the server
  const { data: will_data, error: will_error } = await supabase
    .from('wills')
    .select(
      `
    id, title, contract_address, deployed_at_block, status,
    beneficiaries(percentage, metadata:user_id(first_name, last_name, wallet_address)),
    validators(has_validated, metadata:user_id(first_name, last_name, wallet_address))
  `
    )
    .eq('user_id', session.user.id)
    .single()

  const { data: config_data, error: config_error } = await supabase
    .from('wallet_recovery_config')
    .select(
      `
    id, status,
    verifiers(has_verified, verified_at, metadata:user_id(first_name, last_name, wallet_address))
  `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get ETH balance
  const etherscanApiKey = '2Y2V7T5HCBPXU6MUME8HHQJSBK84ISZT23'
  const address = '0x19882AfC7913B21E2E414F8219eA3bdF3202aB99'
  const balance = await fetch(
    `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${etherscanApiKey}`
  ).then((res) => res.json())

  // Get ETH price
  const ethPriceData = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
  ).then((res) => res.json())
  const ethUsd = ethPriceData.ethereum.usd
  const eth24hrChange = ethPriceData.ethereum.usd_24h_change

  // Get top 5 coins market data
  const top5coinsData = await fetch(
    '	https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h%2C%207d&locale=en'
  ).then((res) => res.json())

  return {
    props: {
      initialSession: session,
      will: will_data,
      config: config_data,
      balance: parseFloat(ethers.utils.formatEther(balance.result)).toFixed(4),
      ethUsd: ethUsd,
      eth24hrChange: eth24hrChange,
      top5coinsData: top5coinsData,
    },
  }
}

export default function Home({
  will,
  config,
  balance,
  ethUsd,
  eth24hrChange,
  top5coinsData,
}: {
  will: any
  config: any
  balance: number
  ethUsd: number
  eth24hrChange: number
  top5coinsData: any
}) {
  const user = useUser()

  if (!user) return <Login />

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <WalletBalance balance={balance} ethUsd={ethUsd} />
          <ETHPrice ethUsd={ethUsd} eth24hrChange={eth24hrChange} />
          <WillStatus will={will} />
          <SafeguardStatus config={config} />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <ETHPriceChart />
          </div>
          <div className="col-span-4">
            <Market data={top5coinsData}/>
          </div>
        </div>
      </div>
    </>
  )
}
