import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import { ethers } from 'ethers'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import InheritedWillsTable from '../../components/InheritedWillsTable'
import { useState } from 'react'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
  let balance = 0

  // Get session data
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
  const { data: willData, error: willError } = await supabase
    .from('wills')
    .select(
      `
      id, title, contract_address, deployed_at_block, status,
      beneficiaries(percentage, profiles(first_name, last_name, wallet_address)),
      validators(has_validated, profiles(first_name, last_name, wallet_address))
      `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get user wallet address
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('id', session.user.id)
    .single()

  // Get user wallet balance
  if (willData !== null) {
    balance = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${userData?.wallet_address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => data.result)
  }

  // Get ETH price in USD
  const ethUsd = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
    .then((res) => res.json())
    .then((res) => res.ethereum.usd)

  // Get inherited wills data
  const { data: inheritedWillsData, error: inheritedWillsError } =
    await supabase
      .from('beneficiaries')
      .select(
        `
        id, percentage, wills(id, status, profiles(id, wallet_address, first_name, last_name),
        beneficiaries(percentage, profiles(first_name, last_name, wallet_address)),
        validators(has_validated))
        `
      )
      .eq('user_id', session.user.id)

  return {
    props: {
      initialSession: session,
      willData: willData,
      inheritedWillsData: inheritedWillsData,
      balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(4),
      ethUsd: ethUsd,
    },
  }
}

export default function Wills({
  willData,
  inheritedWillsData,
  balance,
  ethUsd,
}: {
  willData: any
  inheritedWillsData: any
  balance: number
  ethUsd: number
}) {
  const [defaultTab, setDefaultTab] = useState('will')

  return (
    <>
      <Tabs
        defaultValue={defaultTab}
        className="w-full md:col-span-8 xl:col-span-9"
      >
        <TabsList>
          <TabsTrigger value="will" onClick={() => setDefaultTab('will')}>
            Your Will
          </TabsTrigger>
          <TabsTrigger
            value="inherited"
            onClick={() => setDefaultTab('inherited')}
          >
            Inherited Wills
          </TabsTrigger>
        </TabsList>
        <TabsContent value="will">
          <div className="flex items-center justify-between py-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Your Will
            </h1>
            {!willData && (
              <Button asChild>
                <Link href="/wills/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create new will
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-16">
            {willData ? (
              <WillCard will={willData} balance={balance} ethUsd={ethUsd} />
            ) : (
              <p className="text-2xl font-bold text-center">No will found</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="inherited">
          <div className="flex items-center justify-between py-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Inherited Wills
            </h1>
          </div>
          <div className="flex flex-col gap-16">
            {inheritedWillsData.length > 0 ? (
              InheritedWillsTable({ data: inheritedWillsData })
            ) : (
              <p className="text-2xl font-bold text-center">No will found</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
