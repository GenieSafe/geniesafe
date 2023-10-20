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

import { Tables } from '../lib/database.types'

import Image from 'next/image'

export function WillCard({ will }: { will: any }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`wills/edit/${will.id}`}>
            <Card className="hover:shadow-[0px_0px_20px_0px_hsl(var(--primary))] transition-shadow duration-500">
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
                      will.beneficiaries.map(
                        (
                          beneficiary: Tables<'beneficiaries'>,
                          index: number
                        ) => (
                          <Card key={index} className="shadow-none">
                            <CardContent className="pt-6">
                              <div className="flex flex-row gap-8">
                                <div className="flex flex-col w-24">
                                  <p className="text-lg font-semibold truncate">
                                    {
                                      (
                                        beneficiary.metadata as Record<
                                          string,
                                          any
                                        >
                                      ).first_name
                                    }{' '}
                                    {
                                      (
                                        beneficiary.metadata as Record<
                                          string,
                                          any
                                        >
                                      ).last_name
                                    }
                                  </p>
                                  <p className="truncate">
                                    {
                                      (
                                        beneficiary.metadata as Record<
                                          string,
                                          any
                                        >
                                      ).wallet_address
                                    }
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
                        )
                      )
                    ) : (
                      <p className="">No beneficiaries found.</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-bold">Validators</p>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex gap-4 overflow-x-auto">
                      {will.validators ? (
                        will.validators.map(
                          (validator: Tables<'validators'>, index: number) => (
                            <Card key={index} className="shadow-none">
                              <CardContent className="pt-6">
                                <div className="flex flex-row items-center gap-8">
                                  <div className="flex flex-col w-24">
                                    <p className="text-lg font-semibold truncate">
                                      {
                                        (
                                          validator.metadata as Record<
                                            string,
                                            any
                                          >
                                        ).first_name
                                      }{' '}
                                      {
                                        (
                                          validator.metadata as Record<
                                            string,
                                            any
                                          >
                                        ).last_name
                                      }
                                    </p>
                                    <p className="truncate">
                                      {
                                        (
                                          validator.metadata as Record<
                                            string,
                                            any
                                          >
                                        ).wallet_address
                                      }
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
                          )
                        )
                      ) : (
                        <p className="">No validators found.</p>
                      )}
                    </div>
                    <div className='p-4'>
                      <Image
                        src="img/ethereum-eth-logo.svg"
                        width={50}
                        height={50}
                        alt="ETH logo"
                      />
                    </div>
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
