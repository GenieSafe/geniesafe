import { CheckCircle2 } from 'lucide-react'

import { cn } from '../lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Badge } from './ui/badge'

type CardProps = React.ComponentProps<typeof Card>

interface WillProps {
  data: {
    title: string
    deployed: number
    type: string
    beneficiaries: {
      name: string
      address: string
      relationship: string
      percentage: string
    }[]
    validators: {
      name: string
      validated: boolean
    }[]
  }
}

export function WillCard({ className, ...props }: CardProps) {
  const { title, deployedAtBlock, isValidated } = props.data
  return (
    <Card className="dark">
      <CardHeader className="flex-row justify-between columns-2">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-white">
            Will contract deployed to
            {deployedAtBlock !== null ? (
              <span className="font-semibold">{deployedAtBlock}</span>
            ) : (
              <span className="font-semibold"> N/A</span>
            )}
          </CardDescription>
        </div>
        <div>
          {isValidated ? (
            <Badge className="bg-green-500">Validated</Badge>
          ) : (
            <Badge className="bg-red-500">Not Validated</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col gap-4 pb-4">
          <p className="font-bold">Beneficiaries</p>
          <div className="flex gap-4">
            {/* TODO: Retrieve list of beneficiaries before rendering these cards */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-row gap-8">
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Ali bin Abu</p>
                    <p>0x1234567890</p>
                    <p>Brother</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">50%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold">Validators</p>
          <div className="flex gap-4">
            {/* TODO: Retrieve list of validators before rendering these cards */}
            <Card className="">
              <CardContent className="pt-6">
                <div className="flex flex-row gap-8">
                  <p>Ali bin Abu</p>
                  <CheckCircle2 className="text-success"></CheckCircle2>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
