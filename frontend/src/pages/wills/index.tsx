import React, { useEffect, useState } from 'react'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

export async function getStaticProps(userId: string) {
  //TODO: replace with current session userId
  const tempId = '1136348d-3ec7-4d12-95f2-234748b26213'
  const res = await fetch(`http://localhost:3000/api/will?ownerId=${tempId}`)
  var data = await res.json()
  return { props: { data } }
}

const Wills = ({data}) => {
  return (
    <>
      <div className="container flex items-center justify-between pb-8">
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
      <div className="container flex flex-col space-y-4">
        {data.data.length > 0 ? (
          data.data.map((data) => <WillCard key={data.id} will={data} />)
        ) : (
          <p className="text-2xl font-bold">No wills found.</p>
        )}
      </div>
    </>
  )
}

export default Wills
