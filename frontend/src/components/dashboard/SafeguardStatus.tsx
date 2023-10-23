import {
  ArrowRight,
  CheckCircle2,
  Plus,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { Tables } from '../../lib/database.types'

export default function SafeguardStatus({ config }: { config: any }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="font-medium">Safeguard Status</CardTitle>
          {config != null ? (
            <Link href="/safeguard">
              <ArrowRight className="w-6 h-6 text-primary hover:text-primary-foreground" />
            </Link>
          ) : (
            <Link href="/safeguard/assign">
              <Plus className="w-6 h-6 text-primary hover:text-primary-foreground" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="flex flex-col space-y-1">
          {config != null ? (
            <>
              {config.verifiers.map(
                (verifier: Tables<'verifiers'>, index: number) => (
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate max-w-[11rem]">
                      {(verifier.metadata as Record<string, any>).first_name}{' '}
                      {(verifier.metadata as Record<string, any>).last_name}
                    </p>
                    {verifier.has_verified ? (
                      <CheckCircle2 className="w-4 h-4 text-success"></CheckCircle2>
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive"></XCircle>
                    )}
                  </div>
                )
              )}
            </>
          ) : (
            <>
              <p className="text-center text-primary-foreground/50">
                No safeguard set up yet
              </p>
              <p className="text-sm text-center text-primary-foreground/50">
                Create one by clicking the + icon
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
