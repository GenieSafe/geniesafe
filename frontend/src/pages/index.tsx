import { useSession, useUser } from '@supabase/auth-helpers-react'
import Login from './auth/login'
import WalletBalance from '../components/dashboard/WalletBalance'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'
import ETHPriceChart from '../components/dashboard/ETHPriceChart'
import { ethers } from 'ethers'
import InheritedWills from '../components/dashboard/InheritedWillsTable'

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

  const { data: inherited_data, error: inherited_error } = await supabase
    .from('beneficiaries')
    .select(
      `percentage, wills(status, metadata:user_id(first_name, last_name))`
    )
    .eq('user_id', session.user.id).limit(4)

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

  return {
    props: {
      initialSession: session,
      will: will_data,
      config: config_data,
      balance: parseFloat(ethers.utils.formatEther(balance.result)).toFixed(4),
      ethUsd: ethUsd,
      eth24hrChange: eth24hrChange,
      inherited_wills: inherited_data,
    },
  }
}

export default function Home({
  will,
  config,
  balance,
  ethUsd,
  eth24hrChange,
  inherited_wills,
}: {
  will: any
  config: any
  balance: number
  ethUsd: number
  eth24hrChange: number
  inherited_wills: any
}) {
  const user = useUser()

  if (!user) return <Login />

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
            <InheritedWills data={inherited_wills} />
          </div>
        </div>
      </div>
    </>
  )
}
