import { useSession } from '@supabase/auth-helpers-react'
import Login from './auth/login'
import WalletBalance from '../components/dashboard/WalletBalance'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'
import ETHPriceChart from '../components/dashboard/ETHPriceChart'
import Market from '../components/dashboard/Market'
import { metamaskWallet, useAddress, useConnect } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'

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

  const { data: user_data, error: user_error } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('id', session.user.id)
    .single()

  return {
    props: {
      initialSession: session,
      user: user_data,
      will: will_data,
      config: config_data,
    },
  }
}

export default function Home({
  user,
  will,
  config,
}: {
  user: any
  will: any
  config: any
}) {
  const session = useSession()
  const connect = useConnect()
  const address = useAddress()
  const [currentAddress, setCurrentAddress] = useState('')

  // Check if the auto-connected address is the same as the user's wallet address on first render
  // TODO: Find a way to verify address mismatch when user connects wallet
  useEffect(() => {
    connect(metamaskWallet(), { chainId: 11155111 }).then((wallet) => {
      if (address) setCurrentAddress(address)
      wallet?.getAddress().then((address) => {
        if (address !== user.wallet_address) {
          wallet?.disconnect()
          setCurrentAddress('')
          console.error(
            'Disconnected wallet due to address mismatch',
            address,
            user.wallet_address
          )
        }
      })
    })
  }, [])

  if (!session) return <Login />

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-6">
          <WalletBalance />
          <ETHPrice />
          <WillStatus will={will} />
          <SafeguardStatus config={config} />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <ETHPriceChart />
          </div>
          <div className="col-span-4">
            <Market />
          </div>
        </div>
      </div>
    </>
  )
}
