import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { Edit3 } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'

export async function getStaticProps() {
  //TODO: replace with current session userId
  const tempId = '91944f58-def7-4ceb-bdab-7eb9e736176a'
  const res = await fetch(`http://localhost:3000/api/entrust?ownerId=${tempId}`)
  var data = await res.json()
  return { props: { data } }
}

const Safeguard = ({ data }: any) => {
  return (
    <>
      <div className="container flex flex-col gap-8 pb-8">
        {data.data.length > 0 ? (
          <>
            <div className="container pb-8">
              <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
                  Recover your wallet
                </h1>
                <p className="mb-4 leading-7">
                  Lost access to your wallet? Notify your Verifiers to verify
                  your identity and we’ll send you your private key.
                </p>
              </div>
              <div className="grid gap-8">
                <Card className="dark">
                  <CardHeader>
                    <CardTitle className="flex justify-between text-2xl">
                      Verifiers
                      <Button size={'sm'} className="">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    {data.data[0].Verifiers.map((verifier: any) => (
                      <Card className="bg-primary">
                        <CardContent className="grid pt-6">
                          <p className="text-secondary">
                            {verifier.User.firstName +
                              ' ' +
                              verifier.User.lastName}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="grid justify-end py-8">
                <Button size={'lg'}>Notify Verifiers</Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
              It seems like you don't have any wallet recovery method for now.
            </h1>
            <p className="leading-7">
              Worry you might lose access to your private key? Assign trusted
              Verifiers to help safeguard your private key.
            </p>
            <Button asChild className="self-start" size={'lg'}>
              <Link href="/safeguard/assign">Assign Verifiers</Link>
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default Safeguard
