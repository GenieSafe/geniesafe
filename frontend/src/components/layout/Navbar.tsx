import Link from 'next/link'
import { Button } from '../ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu'
import React, { useEffect, useState } from 'react'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const user = useUser()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    }

    router.push('/')
  }

  return (
    <>
      <div className="flex items-center justify-between px-[5.5rem] py-4 rounded-none glass">
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
          <span className="text-sm">
            Hi, {user?.email}!
          </span>
          <Button variant={'link'} onClick={handleSignOut}>
            Logout
            <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
}
