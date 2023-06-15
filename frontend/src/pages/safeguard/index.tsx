import { NextPage } from 'next'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

const Safeguard: NextPage = () => {
  return (
    <>
      <div className="container pt-12 pb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
          Safeguard your wallet
        </h1>
        <h2 className="pb-2 mt-10 text-3xl font-semibold tracking-tight transition-colorsscroll-m-20 first:mt-0">
          Entrust Verifiers
        </h2>
        <p className="mb-4 leading-7">
          Worry you might lose access to your private key? Assign trusted
          Verifiers to help safeguard your private key
        </p>
        <Button asChild>
          <Link href="/safeguard/entrust">Assign Verifiers</Link>
        </Button>
        <h2 className="pb-2 mt-10 text-3xl font-semibold tracking-tight transition-colorsscroll-m-20 first:mt-0">
          Recover your key
        </h2>
        <p className="mb-4 leading-7">
          Lost access to your wallet? Notify your Verifiers to verify your
          identity to retrieve your private key
        </p>
        <Button asChild>
          <Link href="/safeguard/recover">Notify Verifiers</Link>
        </Button>
      </div>
    </>
  )
}

export default Safeguard
