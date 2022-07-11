import Link from 'next/link'
import { Button } from '@chakra-ui/react'
import { BiLogIn } from 'react-icons/bi'

export default function AccessDenied() {
  return (
    <>
      <div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-white to-gray-300'>
        <div className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'>
          <h1 className='text-4xl font-bold tracking-tighter'>Welcome</h1>
          <h2>You must be logged in to play the game</h2>
          <div className='mt-2'>
            <Link href='/api/auth/signin'>
              <Button
                colorScheme='teal'
                variant='solid'
                rightIcon={<BiLogIn></BiLogIn>}
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
