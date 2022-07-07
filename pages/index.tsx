import React from 'react'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import AccessDenied from 'components/auth/AccessDenied'

export default function Home({ session }) {

console.log(session)

// if (typeof window !== 'undefined' && loading) return null

if (!session) { return <AccessDenied/>}
  return (
    <p>welcome {session?.user?.name}</p>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  return {
    props: {
      session
    }
  }
}