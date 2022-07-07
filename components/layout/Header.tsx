import { Avatar } from '@chakra-ui/react'
import Link from "next/link"
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'
import { useSession, getSession } from 'next-auth/react'
import type { Session } from "next-auth"

export default function Header() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <div className="flex justify-end gap-3 items-center w-screen container py-2">
        <Avatar src={session?.user?.image || ''} name={session?.user?.name || ''} />
        <div className="logout">
          <Link href="/api/auth/signout">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Link href="/api/auth/signin">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    </Link>
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