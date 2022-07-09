import React from 'react'
import { motion } from 'framer-motion'
import TextPrompt from 'components/ui/TextPrompt'
import { useState } from 'react'
import { trpc } from 'utils/trpc'
import ChangeName from './prompts/ChangeName'
import NameCheck from './prompts/NameCheck'
import { Button } from '@chakra-ui/react'
import { CgBolt } from 'react-icons/cg'

export default function Intro({ session, setTasks }: any) {
  const [changeName, setChangeName] = useState(false)
  const [name, setName] = useState('')
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [hasChosenName, setHasChosenName] = useState(false)

  const handleStart = () => {
    updateUserTasks.mutate({
      userEmail: user.email,
      completedTasks: 'intro',
    })
    setTasks(['intro'])
  }

  const setChosenName = trpc.useMutation(['set-chosen-name'])
  const updateUserTasks = trpc.useMutation(['add-task-to-user'])
  const user = session.user

  const playerAnimation = {
    hidden: { opacity: 0, translateX: -400 },
    visible: { opacity: 1, translateX: 50, transition: { duration: 2 } },
  }

  const handleNameChange = async () => {
    setIsButtonLoading(true)

    setChosenName.mutate({
      userEmail: user.email,
      chosenName: name || user.name,
    })
    setIsButtonLoading(false)
    setHasChosenName(true)
  }

  return (
    <div className='intro-screen h-screen relative grid place-content-center'>
      <motion.img
        src='images/trainer.png'
        initial='hidden'
        animate='visible'
        variants={playerAnimation}
        className='bg-gray-400 rounded-md
        '
      />
      <TextPrompt>
        {!hasChosenName && (
          <>
            {!changeName && (
              <NameCheck
                handleNameChange={handleNameChange}
                isButtonLoading={isButtonLoading}
                user={user}
                setChangeName={setChangeName}
                setHasChosenName={setHasChosenName}
              />
            )}
            {changeName && (
              <ChangeName
                setName={setName}
                isButtonLoading={isButtonLoading}
                setIsButtonLoading={setIsButtonLoading}
                setChosenName={setChosenName}
                name={name}
                user={user}
                setHasChosenName={setHasChosenName}
              />
            )}
          </>
        )}
        {hasChosenName && (
          <>
            <h1>
              Great! <span className='font-bold text-black'>{name}</span>, let
              {"'"}s begin!
            </h1>
            <div className='flex justify-center mt-2'>
              <Button
                rightIcon={<CgBolt />}
                variant='solid'
                colorScheme='teal'
                onClick={handleStart}
              >
                GO
              </Button>
            </div>
          </>
        )}
      </TextPrompt>
    </div>
  )
}
