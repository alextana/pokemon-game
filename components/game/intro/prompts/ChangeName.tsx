import React from 'react'
import { Input, Button } from '@chakra-ui/react'

export default function ChangeName({
  setIsButtonLoading,
  setChosenName,
  setName,
  user,
  name,
  isButtonLoading,
  setHasChosenName,
}: any) {
  const handleNameChange = async () => {
    setIsButtonLoading(true)

    setChosenName.mutate({
      userEmail: user.email,
      chosenName: name || user.name,
    })
    setHasChosenName(true)
    setIsButtonLoading(false)
  }
  return (
    <>
      <h1>Choose a new name</h1>
      <div className='flex gap-1 flex-wrap lg:flex-nowrap justify-center w-full mt-2'>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your name'
          size='md'
        />
        <Button
          colorScheme='teal'
          variant='solid'
          onClick={handleNameChange}
          isLoading={isButtonLoading}
        >
          Done
        </Button>
      </div>
    </>
  )
}
