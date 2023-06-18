import React, { useEffect, useState } from 'react'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../../utils/supabase'

export async function getStaticProps() {
  //TODO: replace with current session userId. How to retrieve?
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // const currentUserId = user?.id
  const currentUserId = '994474fa-d558-4cd4-90e8-d72ae10b884f' // Gus

  const res = await fetch(
    `http://localhost:3000/api/will?ownerId=${currentUserId}`
  )
  const data = await res.json()
  return { props: { data } }
}

const Wills = ({ data }) => {
  const session = useSession()

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
        {data.data ? (
          data.data.map((data) => <WillCard key={data.id} will={data} />)
        ) : (
          <p className="text-2xl font-bold">No wills found.</p>
        )}
      </div>
    </>
  )
}

export default Wills
