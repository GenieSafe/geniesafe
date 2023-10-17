import Link from 'next/link'

import { CheckCircle2, XCircle } from 'lucide-react'

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

import { will } from '../../types/interfaces'

export function WillCard({ will }: { will: will }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`wills/edit/${will.id}`}>
            <Card className="">
              <CardHeader className="grid grid-cols-2">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{will.title}</CardTitle>
                  <CardDescription className="text-foreground">
                    Will contract deployed to
                    {will.deployed_at_block !== null ? (
                      <span className="font-semibold">
                        {' '}
                        {will.deployed_at_block}
                      </span>
                    ) : (
                      <span className="font-semibold">&nbsp;N/A</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-start justify-end">
                  <Badge
                    variant={
                      will.status === 'ACTIVE'
                        ? 'success'
                        : will.status === 'INACTIVE'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {will.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4">
                  <p className="font-bold">Beneficiaries</p>
                  <div className="flex gap-4 overflow-x-auto">
                    {will.beneficiaries ? (
                      will.beneficiaries.map((beneficiary) => (
                        <Card key={beneficiary.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row gap-8">
                              <div className="flex flex-col w-24">
                                <p className="text-lg font-semibold truncate">
                                  {`${beneficiary.profile.first_name} ${beneficiary.profile.last_name}`}
                                </p>
                                <p className="truncate">
                                  {beneficiary.profile.wallet_address}
                                </p>
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
                    {will.validators ? (
                      will.validators.map((validator) => (
                        <Card key={validator.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-row items-center gap-8">
                              <div className="flex flex-col w-24">
                                <p className="text-lg font-semibold truncate">
                                  {`${validator.profile.first_name} ${validator.profile.last_name}`}
                                </p>
                                <p className="truncate">
                                  {validator.profile.wallet_address}
                                </p>
                              </div>

                              {validator.has_validated ? (
                                <CheckCircle2 className="text-success"></CheckCircle2>
                              ) : (
                                <XCircle className="text-destructive"></XCircle>
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
