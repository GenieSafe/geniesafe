import { useSession } from '@supabase/auth-helpers-react'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { ethers } from 'ethers'
import Login from './auth/login'
import WalletBalance from '../components/dashboard/WalletBalance'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'
import InheritedWills from '../components/dashboard/InheritedWillsTable'
import TrendOverviewChart from '../components/dashboard/TrendOverviewChart'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'
import { ToastAction } from '@/components/ui/toast'
import Link from 'next/link'

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

  // Get will data
  const { data: will, error: willError } = await supabase
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

  // Get config data
  const { data: config, error: configError } = await supabase
    .from('wallet_recovery_config')
    .select(
      `
      id, status,
      verifiers(has_verified, verified_at, metadata:user_id(first_name, last_name, wallet_address))
      `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get inherited wills data
  const { data: inheritedWills, error: inheritedWillsError } = await supabase
    .from('beneficiaries')
    .select(
      `percentage, wills(status, metadata:user_id(first_name, last_name))`
    )
    .eq('user_id', session.user.id)
    .limit(4)

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

  // Get ETH price trend
  const ethPriceTrend = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily`
  ).then((res) => res.json())

  return {
    props: {
      initialSession: session,
      will: will,
      config: config,
      balance: parseFloat(ethers.utils.formatEther(balance.result)).toFixed(4),
      ethUsd: ethUsd,
      eth24hrChange: eth24hrChange,
      ethPriceTrend: ethPriceTrend,
      inheritedWills: inheritedWills,
    },
  }
}

export default function Home({
  will,
  config,
  balance,
  ethUsd,
  eth24hrChange,
  ethPriceTrend,
  inheritedWills,
}: {
  will: any
  config: any
  balance: number
  ethUsd: number
  eth24hrChange: number
  ethPriceTrend: any
  inheritedWills: any
}) {
  const session = useSession()
  const { toast } = useToast()

  if (!session) return <Login />

  useEffect(() => {
    if (will === undefined || config === undefined) {
      setTimeout(() => {
        toast({
          title: 'Finish setting up your account',
          description: 'Setup your will and safeguard config.',
          duration: 100000,
          action: (
            <div className="space-y-2">
              <ToastAction
                altText="Will"
                className="w-full"
                disabled={will !== undefined}
              >
                <Link href="/wills">Will</Link>
              </ToastAction>
              <ToastAction
                altText="Safeguard"
                className="w-full"
                disabled={config !== undefined}
              >
                <Link href="/safeguard">Safeguard</Link>
              </ToastAction>
            </div>
          ),
        })
      }, 1000)
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-2 pb-12">
        <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
          Dashboard
        </h1>
        <p className="leading-7">
          Your hub for seamless management and control of your digital assets,
          take charge of your financial legacy and safeguard your loved ones'
          future with just a few clicks.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <WillStatus will={will} />
          <SafeguardStatus config={config} />
          <WalletBalance balance={balance} ethUsd={ethUsd} />
          <ETHPrice ethUsd={ethUsd} eth24hrChange={eth24hrChange} />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <TrendOverviewChart
              ethPriceTrend={ethPriceTrend}
              balance={balance}
            />
          </div>
          <div className="col-span-4">
            <InheritedWills data={inheritedWills} />
          </div>
        </div>
      </div>
    </>
  )
}
