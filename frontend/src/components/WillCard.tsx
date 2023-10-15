import Link from 'next/link'

import { CheckCircle2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Badge } from './ui/badge'

import { Will } from '../../types/interfaces'

// type CardProps = React.ComponentProps<typeof Card>

export function WillCard({ will }: { will: Will }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`wills/edit/${will.id}`}>
            <Card className="dark">
              <CardHeader className="grid grid-cols-2">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{will.title}</CardTitle>
                  <CardDescription className="text-foreground">
                    Will contract deployed to
                    {will.deployedAtBlock !== null ? (
                      <span className="font-semibold">
                        {' '}
                        {will.deployedAtBlock}
                      </span>
                    ) : (
                      <span className="font-semibold"> N/A</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-start justify-end">
                  {will.isValidated ? (
                    <Badge variant={'success'}>Active</Badge>
                  ) : (
                    <Badge className="" variant={'destructive'}>
                      Unactive
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4">
                  <p className="font-bold">Beneficiaries</p>
                  <div className="flex gap-4 overflow-x-auto">
                    {will.Beneficiaries ? (
                      will.Beneficiaries.map((Beneficiary) => (
                        <Card key={Beneficiary.User.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row gap-8">
                              <div className="flex flex-col w-24">
                                <p className="text-lg font-semibold truncate">
                                  {`${Beneficiary.User.firstName} ${Beneficiary.User.lastName}`}
                                </p>
                                <p className="truncate">
                                  {Beneficiary.User.walletAddress}
                                </p>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-bold">
                                  {Beneficiary.percentage}%
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="">No beneficiaries found.</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-bold">Validators</p>
                  <div className="flex gap-4 overflow-x-auto">
                    {will.Validators ? (
                      will.Validators.map((Validator) => (
                        <Card key={Validator.User.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row items-center gap-8">
                              <div className="flex flex-col w-24">
                                <p className="text-lg font-semibold truncate">
                                  {`${Validator.User.firstName} ${Validator.User.lastName}`}
                                </p>
                                <p className="truncate">
                                  {Validator.User.walletAddress}
                                </p>
                              </div>

                              {Validator.isValidated ? (
                                <CheckCircle2 className="text-success"></CheckCircle2>
                              ) : (
                                <CheckCircle2 className="text-destructive"></CheckCircle2>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="">No validators found.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to edit will</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
