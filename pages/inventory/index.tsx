import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GetServerSideProps } from 'next'
import { Session } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { trpc } from 'utils/trpc'
import Link from 'next/link'
import { Button } from '@chakra-ui/react'
import Image from 'next/image'

export default function Inventory({ session }: { session: Session }) {
  const [userData, setUserData] = useState<any>(undefined)
  const [loading, setIsLoading] = useState<boolean>(false)

  trpc.useQuery(['get-user-by-email', { email: session?.user?.email || '' }], {
    onSuccess: setUserData,
  })

  const handleImageNumber = (pokemon: number) => {
    // add 00 if < 10 and 0 if < 100 but > 10
    if (pokemon < 10) {
      return `00${pokemon}`
    } else if (pokemon > 10 && pokemon < 100) {
      return `0${pokemon}`
    } else {
      return pokemon
    }
  }

  return (
    <>
      <motion.div
        exit={{ opacity: 0 }}
        className='w-screen break-normal min-h-screen grid place-content-center bg-gradient-to-t from-white to-gray-200 text-gray-800'
      >
        <motion.div
          className='pokemon-container break-normal mx-auto text-center'
          animate={{
            opacity: 1,
            transition: {
              type: 'spring',
              duration: 2,
            },
          }}
        >
          <Link href='/'>
            <Button
              isLoading={loading}
              onClick={() => setIsLoading(true)}
              colorScheme='teal'
              variant='solid'
              className='mb-2'
            >
              Back
            </Button>
          </Link>
          <div
            className='inventory bg-white border-double border-4 border-gray-800 p-6 shadow-2xl overflow-y-scroll'
            style={{ maxHeight: '80vh' }}
          >
            <ul className='grid grid-cols-4 gap-2'>
              {userData?.capturedPokemons.map((pokemon: number) => (
                <li
                  className='inline p-2 border border-gray-200 rounded-2xl'
                  key={Math.random()}
                >
                  <Image
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${handleImageNumber(
                      pokemon
                    )}.png`}
                    width='120'
                    height='120'
                    className='max-w-full'
                    alt={`${pokemon}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </>
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

    if (!user) {
      await prisma.user.create({
        data: {
          email: session?.user?.email,
        },
      })
    }

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
