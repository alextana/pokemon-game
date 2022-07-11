import React, { useState } from 'react'
import { motion } from 'framer-motion'
import TextPrompt from 'components/ui/TextPrompt'
import { Button } from '@chakra-ui/react'
import Link from 'next/link'

export default function CapturingScreen({
  capturePokemon,
  pokemonToDisplay,
  handleReset,
}: {
  capturePokemon: any
  pokemonToDisplay: any
  handleReset: any
}) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <>
      <motion.div
        exit={{ opacity: 0 }}
        className='w-screen break-normal h-screen overflow-hidden bg-gradient-to-t from-white to-gray-400 text-gray-800'
      >
        <motion.div
          className='pokemon-container text-2xl break-normal top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto text-center'
          animate={{
            opacity: 1,
            transformOrigin: '100%',
            translateX: '-50%',
            transition: {
              type: 'spring',
              duration: 2,
            },
          }}
        >
          {capturePokemon?.data?.captured === false && (
            <>
              <span className='font-extrabold tracking-tighter italic'>
                <p className='mb-2'>
                  Could not capture{' '}
                  <span className='capitalize'>
                    {pokemonToDisplay.data.name}
                  </span>
                </p>
              </span>
              <Link className='mt-2 text-lg' href='/inventory'>
                <Button
                  isLoading={isLoading}
                  onClick={() => setIsLoading(true)}
                  colorScheme='teal'
                  variant='solid'
                >
                  View inventory
                </Button>
              </Link>
            </>
          )}
          {capturePokemon?.data?.capturedPokemons?.length && (
            <>
              <span className='font-extrabold tracking-tighter italic'>
                <span className='capitalize'>{pokemonToDisplay.data.name}</span>{' '}
                has been captured!
              </span>
              <p className='text-lg'>
                You now have {capturePokemon?.data?.capturedPokemons?.length}{' '}
                Pokemons!
              </p>
              <Link className='mt-2 text-lg' href='/inventory'>
                <Button
                  isLoading={isLoading}
                  onClick={() => setIsLoading(true)}
                  colorScheme='teal'
                  variant='solid'
                >
                  View inventory
                </Button>
              </Link>
            </>
          )}
        </motion.div>
        <TextPrompt>
          {capturePokemon?.data?.captured === false && (
            <>
              <h2>
                Unlucky..{' '}
                <span className='capitalize'>{pokemonToDisplay.data.name}</span>{' '}
                ran away.
              </h2>
              <div className='flex mt-2 justify-center'>
                <Button
                  onClick={handleReset}
                  colorScheme='teal'
                  variant='solid'
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {capturePokemon?.data?.capturedPokemons?.length && (
            <>
              <h2>Nicely done! What would you like to do?</h2>
              <div className='flex mt-2 justify-center'>
                <Button
                  onClick={handleReset}
                  colorScheme='teal'
                  variant='solid'
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </TextPrompt>
      </motion.div>
    </>
  )
}
