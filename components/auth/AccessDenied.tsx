import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function AccessDenied() {
  return (
    <>
      <div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-green-600 to-green-400'>
        <div className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'>
          <h1 className='text-4xl font-bold tracking-tighter'>Access Denied</h1>
          <p>
            <Link
              href='/api/auth/signin'
              onClick={(e) => {
                e.preventDefault()
                signIn()
              }}
            >
              You must be signed in to view this page
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
