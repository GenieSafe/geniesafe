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
import { Button } from './ui/button'

export function WillCard({ will }: { will: any }) {
  return (
    <Link href={`wills/edit/${will.id}`}>
      <Card className="hover:shadow-[0px_0px_20px_0px_hsl(var(--primary))] transition-shadow duration-500 p-4">
        <CardHeader className="grid grid-cols-2">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight scroll-m-20">
              {will.title}
            </CardTitle>
            <CardDescription>
              {will.deployed_at_block !== null ? (
                <Button variant={'link'} asChild>
                  <Link
                    href={`https://sepolia.etherscan.io/address/${will.deployed_at_block}`}
                  >
                    <CardDescription className="text-sm font-semibold text-primary-foreground/50">
                      {will.deployed_at_block}
                    </CardDescription>
                  </Link>
                </Button>
              ) : (
                <CardDescription className="text-sm font-semibold text-primary-foreground/50">
                  N/A
                </CardDescription>
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
        <CardContent className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4 overflow-clip">
            <p className="font-bold">Beneficiaries</p>
            <div className="flex gap-4 overflow-x-auto">
              {will.beneficiaries ? (
                will.beneficiaries.map(
                  (beneficiary: Tables<'beneficiaries'>, index: number) => (
                    <Card key={index} className="shadow-none">
                      <CardContent className="pt-6">
                        <div className="flex flex-row gap-8">
                          <div className="flex flex-col w-24">
                            <p className="text-lg font-semibold truncate">
                              {
                                (beneficiary.metadata as Record<string, any>)
                                  .first_name
                              }{' '}
                              {
                                (beneficiary.metadata as Record<string, any>)
                                  .last_name
                              }
                            </p>
                            <p className="truncate">
                              {
                                (beneficiary.metadata as Record<string, any>)
                                  .wallet_address
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
                                (validator.metadata as Record<string, any>)
                                  .first_name
                              }{' '}
                              {
                                (validator.metadata as Record<string, any>)
                                  .last_name
                              }
                            </p>
                            <p className="truncate">
                              {
                                (validator.metadata as Record<string, any>)
                                  .wallet_address
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-y-1">
            <CardDescription>Your balance:</CardDescription>
            <p className="text-5xl font-semibold tracking-tight scroll-m-20">
              100 ETH
            </p>
            <CardDescription className="text-sm text-primary-foreground/50">
              ~$167,400
            </CardDescription>
          </div>
          <div className="p-4">
            <Image
              src="img/ethereum-eth-logo.svg"
              width={50}
              height={50}
              alt="ETH logo"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
