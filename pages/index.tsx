import React from 'react'
import AccessDenied from 'components/auth/AccessDenied'
import { useSession } from 'next-auth/react'

export default function Home() {

const { data: session, status } = useSession()

const loading = status === 'loading'

if (loading) { return <div>loading...</div>}

if (!session) { return <AccessDenied/>}
  return (
    <div className="game-screen container mx-auto">
      <p>welcome {session?.user?.name}</p>
    </div>
  )
}
