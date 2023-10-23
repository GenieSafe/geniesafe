import { useSession, useUser } from '@supabase/auth-helpers-react'
import Login from './auth/login'
import WalletBalance from '../components/dashboard/WalletBalance'
import ETHPrice from '../components/dashboard/ETHPrice'
import WillStatus from '../components/dashboard/WillStatus'
import { GetServerSidePropsContext } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import SafeguardStatus from '../components/dashboard/SafeguardStatus'

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

  return {
    props: {
      initialSession: session,
      will: will_data,
      config: config_data,
    },
  }
}

export default function Home({ will, config }: { will: any; config: any }) {
  const user = useUser()

  if (!user) return <Login />

  return (
    <>
      <div className="grid grid-rows-3">
        <div className="grid grid-cols-4 gap-6">
          <WalletBalance />
          <ETHPrice />
          <WillStatus will={will} />
          <SafeguardStatus config={config} />
        </div>
      </div>
    </>
  )
}
