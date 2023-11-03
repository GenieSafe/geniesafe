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
    beneficiaries(percentage, profiles(first_name, last_name, wallet_address)),
    validators(has_validated, profiles(first_name, last_name, wallet_address))
  `
    )
    .eq('user_id', session.user.id)
    .single()

  const { data: user_data, error: user_error } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('id', session.user.id)
    .single()

  if (will_data !== null) {
    balance = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${user_data?.wallet_address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEYF}`
    )
      .then((res) => res.json())
      .then((data) => data.result)
  }

  const ethUsd = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
    .then((res) => res.json())
    .then((res) => res.ethereum.usd)

  // Get inherited wills data
  const { data: inherited_wills_data, error: inherited_wills_error } =
    await supabase
      .from('beneficiaries')
      .select(
        `id, percentage, wills(id, status, profiles(first_name, last_name))`
      )
      .eq('user_id', session.user.id)

  return {
    props: {
      initialSession: session,
      willData: will_data,
      inheritedWillsData: inherited_wills_data,
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
