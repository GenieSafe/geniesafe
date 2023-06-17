import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'
// import { LocalFaucetButton } from '../LocalFaucetButton'
import { Head, MetaProps } from './Head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { Button, buttonVariants } from '../ui/button'
import { LogOut } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const session = useSession()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      // Redirect or perform additional actions after signout
    }
  }

  return (
    <>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      ) : (
        <>
          <Head customMeta={customMeta} />
          <header>
            <div className="container flex items-center justify-between py-4">
              <div className="flex items-center justify-between">
                <Link className={buttonVariants({ variant: 'link' })} href="/">
                  Dashboard
                </Link>
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/wills"
                >
                  Will
                </Link>
                {/* <Link className={buttonVariants({ variant: 'link' })} href="">
                  Asset
                </Link>
                <Link className={buttonVariants({ variant: 'link' })} href="">
                  Inheritance
                </Link> */}
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/safeguard"
                >
                  Safeguard
                </Link>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <small className="text-sm font-medium leading-none">
                  Hi, {session.user.email}!
                </small>
                <Button variant={'ghost'} onClick={handleSignOut}>
                  Logout
                  <LogOut className="w-4 h-4 ml-2" />
                </Button>
                {/* <ConnectButton /> */}
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading'
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated')

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <Button onClick={openConnectModal} type="button">
                                Connect Wallet
                              </Button>
                            )
                          }

                          if (chain.unsupported) {
                            return (
                              <Button onClick={openChainModal} type="button">
                                Wrong network
                              </Button>
                            )
                          }

                          return (
                            <div style={{ display: 'flex', gap: 12 }}>
                              <Button
                                onClick={openChainModal}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 12,
                                      height: 12,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 12, height: 12 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </Button>

                              <Button onClick={openAccountModal} type="button">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''}
                              </Button>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </header>
          <main>
            <div className="container mx-auto my-12">{children}</div>
          </main>
          <footer></footer>
        </>
      )}
    </>
  )
}
