import { useSession } from '@supabase/auth-helpers-react'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { ethers } from 'ethers'
import Login from './auth/login'
import InheritableFund from '../components/dashboard/InheritableFund'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'
import InheritedWills from '../components/dashboard/InheritedWillsTable'
import TrendOverviewChart from '../components/dashboard/TrendOverviewChart'
import { toast } from '@/components/ui/use-toast'
import { useEffect } from 'react'
import { ToastAction } from '@/components/ui/toast'
import { useRouter } from 'next/router'

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
  const { data: will, error: getWillError } = await supabase
    .from('wills')
    .select(
      `
      id, title, deployed_at_block, status, eth_amount,
      beneficiaries(percentage, metadata:user_id(first_name, last_name, wallet_address)),
      validators(has_validated, metadata:user_id(first_name, last_name, wallet_address))
      `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get config data
  const { data: config, error: getConfigError } = await supabase
    .from('wallet_recovery_config')
    .select(
      `
      id, status,
      verifiers(has_verified, verified_at, metadata:user_id(first_name, last_name, wallet_address))
      `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get inheritable fund
  const inheritableFund =
    will !== null && will.eth_amount !== null
      ? parseFloat(will.eth_amount)
      : null

  // Get inherited wills data
  const { data: inheritedWills, error: getInheritedWillsError } = await supabase
    .from('beneficiaries')
    .select(
      `percentage, wills(status, metadata:user_id(first_name, last_name))`
    )
    .eq('user_id', session.user.id)
    .limit(4)

  // Get ETH price
  const ethPriceData = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
  ).then((res) => res.json())
  const ethUsd = ethPriceData.ethereum.usd
  const eth24hrChange = ethPriceData.ethereum.usd_24h_change

  // Get ETH price trend
  const ethPriceTrend = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`
  ).then((res) => res.json())

  // Get wallet balance
  let balance = '0.0000'
  const { data: user, error: getUserError } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('id', session.user.id)
    .single()
  if (!getUserError) {
    const address = user?.wallet_address
    balance = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        return parseFloat(ethers.utils.formatEther(data.result)).toFixed(4)
      })
  }

  return {
    props: {
      initialSession: session,
      will: will,
      config: config,
      inheritableFund: inheritableFund,
      balance: balance,
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
  inheritableFund,
  balance,
  ethUsd,
  eth24hrChange,
  ethPriceTrend,
  inheritedWills,
}: {
  will: any
  config: any
  inheritableFund: number
  balance: number
  ethUsd: number
  eth24hrChange: number
  ethPriceTrend: any
  inheritedWills: any
}) {
  const session = useSession()
  const router = useRouter()

  if (!session) return <Login />

  useEffect(() => {
    if (will === null || config === null) {
      setTimeout(() => {
        toast({
          title: 'Hello there!',
          description: `Let's set up your will and safeguard config.`,
          duration: 100000,
          action: (
            <div className="space-y-2">
              <ToastAction
                altText="Will"
                className="w-full"
                disabled={will !== null}
                onClick={() => router.push('/wills/create')}
              >
                Will
              </ToastAction>
              <ToastAction
                altText="Safeguard"
                className="w-full"
                disabled={config !== null}
                onClick={() => router.push('/safeguard/assign')}
              >
                Safeguard
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
          <InheritableFund
            inheritableFund={inheritableFund}
            ethUsd={ethUsd}
            willStatus={will !== null ? will.status : null}
          />
          <SafeguardStatus config={config} />
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
