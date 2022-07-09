import React, { useState } from 'react'
import AccessDenied from 'components/auth/AccessDenied'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import { useSession, getSession } from 'next-auth/react'
import Capture from 'components/game/Capture'
import Intro from 'components/game/intro/Intro'

import type { Session } from 'next-auth'

export default function Home({
  completedTasks,
  session,
}: {
  completedTasks: Array<string>
  session: Session
}) {
  const { status } = useSession()
  const loading = status === 'loading'
  const [tasks, setTasks] = useState([])

  /*
    redirect to different pages
    depending on what's completed

    - intro -> when completed add to completed tasks
    - capture/battle screen

    -- options to go to inventory and stuff // if you go to the inventory and your
      pokemon was on the screen then don't lose it, save the encounter (maybe don't redirect completely)
  */

  if (loading) {
    return <div>loading...</div>
  }

  if (!session) {
    return <AccessDenied />
  }

  // intro game state
  // only goes through if completed tasks doesn't have
  // intro
  if (
    !completedTasks.find((t) => t === 'intro') &&
    !tasks.find((t) => t === 'intro')
  ) {
    return <Intro session={session} setTasks={setTasks} />
  }

  // normal game state -- capture pokemon
  return (
    <div className='game-screen'>
      <Capture session={session} />
    </div>
  )
}

// SERVER
export const getServerSideProps: GetServerSideProps<{
  session: Session | null
}> = async (context) => {
  const prisma = new PrismaClient()
  const session = await getSession(context)

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    })

    if (user) {
      const completedTasks = user.completedTasks
      return {
        props: {
          completedTasks,
          session,
        },
      }
    }
  }

  return {
    props: {
      session,
    },
  }
}
