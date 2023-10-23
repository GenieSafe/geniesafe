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
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import { ConnectWallet } from '@thirdweb-dev/react'

export default function Navbar() {
  const router = useRouter()
  const user = useUser()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    }

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
                  Wills
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
          <span className="text-sm">Hi, {user?.email}!</span>
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
