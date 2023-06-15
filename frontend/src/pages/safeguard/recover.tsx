import { NextPage } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Edit3 } from 'lucide-react'
import { Button } from '../../components/ui/button'

const Recover: NextPage = () => {
  return (
    <>
      <div className="container pt-12 pb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
            Recover your wallet
          </h1>
          <p className="mb-4 leading-7">
            Lost access to your wallet? Notify your Verifiers to verify your
            identity and we’ll send you your private key.
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
              <Card className="bg-primary">
                <CardContent className="grid pt-6">
                  <p className="text-secondary">Ali bin Abu</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
        <div className="grid justify-end py-8">
          <Button>Notify Verifiers</Button>
        </div>
      </div>
    </>
  )
}

export default Recover
