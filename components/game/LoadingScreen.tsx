import React from 'react'
import { Spinner } from '@chakra-ui/react'

export default function LoadingScreen() {
  return (
    <div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-white to-gray-300'>
      <div className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'>
        <Spinner size='xl' />
      </div>{' '}
    </div>
  )
}
