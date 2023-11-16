import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '@/components/WillCard'
import { Button } from '@/components/ui/button'
import { ethers } from 'ethers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InheritedWillsTable from '@/components/InheritedWillsTable'
import { useState } from 'react'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)

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
  const { data: will, error: willError } = await supabase
    .from('wills')
    .select(
      `
      id, title, deployed_at_block, status, eth_amount,
      beneficiaries(percentage, profiles(first_name, last_name, wallet_address)),
      validators(has_validated, profiles(first_name, last_name, wallet_address))
      `
    )
    .eq('user_id', session.user.id)
    .single()

  // Get ETH price in USD
  const ethUsd = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
    .then((res) => res.json())
    .then((res) => (res ? res.ethereum.usd : 0.0))

  // Get inherited wills data
  const { data: inheritedWillsData, error: inheritedWillsError } =
    await supabase
      .from('beneficiaries')
      .select(
        `
        id, percentage, wills(id, status, profiles(id, wallet_address, first_name, last_name),
        beneficiaries(id, percentage, profiles(first_name, last_name, wallet_address, email)),
        validators(id, has_validated, profiles(first_name, last_name, email)))
        `
      )
      .eq('user_id', session.user.id)

  const balance =
    will !== null && will.eth_amount !== null
      ? parseFloat(will.eth_amount)
      : '0.0000'

  return {
    props: {
      initialSession: session,
      will: will,
      inheritedWillsData: inheritedWillsData,
      balance: balance,
      ethUsd: ethUsd,
    },
  }
}

export default function Wills({
  will,
  inheritedWillsData,
  balance,
  ethUsd,
}: {
  will: any
  inheritedWillsData: any
  balance: number
  ethUsd: number
}) {
  const [defaultTab, setDefaultTab] = useState('will')

  return (
    <>
      <Tabs defaultValue={defaultTab} className="flex flex-col">
        <TabsList className="self-center w-fit">
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
        <TabsContent value="will" className="mt-6">
          <div className="flex items-center justify-between pb-12">
            <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
              Your Will
            </h1>
            {!will && (
              <Button asChild>
                <Link href="/wills/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create new will
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-16">
            {will ? (
              <WillCard will={will} balance={balance} ethUsd={ethUsd} />
            ) : (
              <p className="text-2xl font-bold text-center">No will found</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="inherited" className="mt-6">
          <div className="flex items-center justify-between pb-12">
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
