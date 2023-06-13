import { NextPage } from 'next'
import React from 'react'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import Will from '../api/will'

const Wills: NextPage = () => {

  return (
    <>
      <div className="container flex items-center justify-between pt-12 pb-8">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20 lg:text-5xl">
          Your Wills
        </h1>
        <Button variant={'outline'} className="dark" asChild>
          <Link href="/wills/create">
            <Plus className="w-4 h-4 mr-2" />
            Create new will
          </Link>
        </Button>
      </div>
      <div className="container flex flex-col">
        <WillCard />
      </div>
    </>
  )
}

export default Wills
