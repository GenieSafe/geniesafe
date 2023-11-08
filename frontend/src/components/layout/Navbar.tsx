import Link from 'next/link'
import { Button } from '../ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu'
import React from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import {
  ConnectWallet,
  useAddress,
  useConnectionStatus,
  useWallet,
} from '@thirdweb-dev/react'
import { toast } from '@/components/ui/use-toast'

export default function Navbar({ name }: { name?: string }) {
  const router = useRouter()
  const user = useUser()
  const supabase = useSupabaseClient()
  const wallet = useWallet()
  const address = useAddress()
  const connectionStatus = useConnectionStatus()

  // Disconnect wallet if address does not match user address in DB
  if (
    connectionStatus === 'connected' &&
    address !== undefined &&
    wallet !== undefined
  ) {
    if (address !== user?.user_metadata?.address) {
      toast({
        title: 'Wallet mismatch!',
        description: `This wallet address does not match your address in our record. Check the connected account on your Metamask.`,
        variant: 'destructive',
      })
      wallet.disconnect()
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    }

    wallet?.disconnect()
    router.reload()
  }

  return (
    <>
      <div className="flex items-center justify-between px-[5.5rem] py-4 rounded-none glass">
        <ConnectWallet
          dropdownPosition={{
            side: 'bottom',
            align: 'center',
          }}
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/wills" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Will
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/safeguard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Safeguard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm">Hello, {name}!</span>
          <Button
            variant={'link'}
            className="font-bold"
            onClick={handleSignOut}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
