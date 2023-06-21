import { CheckCircle2, Edit, Edit2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Badge } from './ui/badge'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Separator } from './ui/separator'

type CardProps = React.ComponentProps<typeof Card>

export function WillCard({ className, will }: CardProps) {
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
                      will.Beneficiaries.map((beneficiary) => (
                        <Card key={beneficiary.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row gap-8">
                              <div className="flex flex-col">
                                {/* TODO: Refactor style into a CSS class */}
                                <p
                                  className="text-lg font-semibold"
                                  style={{
                                    maxWidth: '6rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {`${beneficiary.User.firstName} ${beneficiary.User.lastName}`}
                                </p>
                                <p
                                  style={{
                                    maxWidth: '6rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {beneficiary.User.walletAddress}
                                </p>
                                <p>{beneficiary.relation}</p>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-bold">
                                  {beneficiary.percentage}%
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
                      will.Validators.map((validator) => (
                        <Card key={validator.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row gap-8">
                              <div className="flex flex-col">
                                {/* TODO: Refactor style into a CSS class */}
                                <p
                                  className="text-lg font-semibold"
                                  style={{
                                    maxWidth: '6rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {`${validator.User.firstName} ${validator.User.lastName}`}
                                </p>
                                <p
                                  style={{
                                    maxWidth: '6rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {validator.User.walletAddress}
                                </p>
                                <p>{validator.relation}</p>
                              </div>

                              {validator.isValidated ? (
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
