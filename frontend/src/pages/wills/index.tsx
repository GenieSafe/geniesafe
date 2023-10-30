import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import { ethers } from 'ethers'
import { useAddress } from '@thirdweb-dev/react'
import { useUser } from '@supabase/auth-helpers-react'

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
    beneficiaries(percentage, metadata:user_id(first_name, last_name, wallet_address)),
    validators(has_validated, metadata:user_id(first_name, last_name, wallet_address))
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
    const etherscanApiKey = '2Y2V7T5HCBPXU6MUME8HHQJSBK84ISZT23'
    balance = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${user_data?.wallet_address}&tag=latest&apikey=${etherscanApiKey}`
    )
      .then((res) => res.json())
      .then((data) => data.result)
  }

  const ethUsd = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  )
    .then((res) => res.json())
    .then((res) => res.ethereum.usd)

  return {
    props: {
      initialSession: session,
      data: will_data,
      balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(4),
      ethUsd: ethUsd,
    },
  }
}

export default function Wills({
  data,
  balance,
  ethUsd,
}: {
  data: any
  balance: number
  ethUsd: number
}) {
  return (
    <>
      <div className="flex items-center justify-between pb-12">
        <h1 className="text-4xl font-bold tracking-tight shadow scroll-m-20 lg:text-5xl">
          Your Will
        </h1>
        {!data && (
          <Button asChild>
            <Link href="/wills/create">
              <Plus className="w-4 h-4 mr-2" />
              Create new will
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-16">
        {data ? (
          <WillCard will={data} balance={balance} ethUsd={ethUsd} />
        ) : (
          <p className="text-2xl font-bold text-center">No will found</p>
        )}
      </div>
    </>
  )
}
