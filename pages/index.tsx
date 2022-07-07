import React from 'react'
import AccessDenied from 'components/auth/AccessDenied'
import { useSession, getSession } from 'next-auth/react'
import type { Session } from "next-auth"
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

export default function Home() {

const { data: session, status } = useSession()

const loading = status === 'loading'

if (loading) { return <div>loading...</div>}

if (!session) { return <AccessDenied/>}
  return (
    <p>welcome {session?.user?.name}</p>
  )
}

export const getServerSideProps: GetServerSideProps<{session: Session | null}> = async (context) => {
  const prisma = new PrismaClient()
  const session = await getSession(context)

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      }
    })

    if (user) {
      return {
        props: {
          session
        }
      }
    }

    const createUser = await prisma.user.create({
      data: {
        email: session?.user?.email,
        name: session?.user?.name,
      },
    })
  }

  return {
    props: {
      session,
    },
  }
}