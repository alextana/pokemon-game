import React from 'react'
import { Button } from '@chakra-ui/react'

export default function NameCheck({
  handleNameChange,
  isButtonLoading,
  setChangeName,
  user,
}: any) {
  return (
    <>
      <h1>
        Welcome, is <span className='font-bold text-black'>{user.name}</span>{' '}
        your name?
      </h1>
      <div className='flex gap-1 justify-center w-full flex-wrap lg:flex-nowrap mt-2'>
        <Button
          onClick={handleNameChange}
          colorScheme='teal'
          variant='solid'
          isLoading={isButtonLoading}
        >
          Yes
        </Button>
        <Button
          onClick={() => setChangeName(true)}
          colorScheme='teal'
          variant='outline'
        >
          No
        </Button>
      </div>
    </>
  )
}
