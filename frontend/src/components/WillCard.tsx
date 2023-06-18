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
                      <span className="font-semibold"> {will.deployedAtBlock}</span>
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
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to edit will</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
