import React, { useEffect, useState } from 'react'

import { Plus } from 'lucide-react'

import { WillCard } from '../../components/WillCard'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

function getWills(userId: string) {
  return fetch(`http://localhost:3000/api/will?ownerId=${userId}`, {
    method: 'GET',
  }).then((res) => res.json())
}

const Wills = () => {
  // TODO: Replace with current session's user ID
  const tempUserId = '1136348d-3ec7-4d12-95f2-234748b26213'
  const [wills, setWills] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getWills(tempUserId)
        if (response.data) {
          setWills(response.data)
        } else {
          console.error('No data found in the response.')
        }
      } catch (error) {
        console.error('Error fetching wills:', error)
      }
    }

    fetchData()
  }, [])

  console.log(wills)

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
        {wills.length > 0 ? (
          wills.map((will) => <WillCard data={will} />)
        ) : (
          <p className="text-2xl font-bold">No wills found.</p>
        )}
      </div>
    </>
  )
}

export default Wills
