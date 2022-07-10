import React from 'react'
import { motion } from 'framer-motion'
import TextPrompt from 'components/ui/TextPrompt'
import { Button } from '@chakra-ui/react'

export default function CapturingScreen({
  capturePokemon,
  pokemonToDisplay,
  handleReset,
}: {
  capturePokemon: any
  pokemonToDisplay: any
  handleReset: any
}) {
  return (
    <>
      <motion.div
        exit={{ opacity: 0 }}
        className='w-screen h-screen overflow-hidden bg-gradient-to-t from-slate-500 to-gray-800 text-white'
      >
        <motion.div
          className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'
          animate={{
            opacity: 1,
            scale: 2,
            transformOrigin: '100%',
            transition: {
              type: 'spring',
              duration: 2,
            },
          }}
        >
          {capturePokemon?.data?.captured === false && (
            <>
              <span>
                Could not capture{' '}
                <span className='capitalize'>{pokemonToDisplay.data.name}</span>
              </span>
            </>
          )}
          {capturePokemon?.data?.capturedPokemons?.length && (
            <>
              <span>
                <span className='capitalize'>{pokemonToDisplay.data.name}</span>{' '}
                has been captured!
              </span>
              <p>
                You now have {capturePokemon?.data?.capturedPokemons?.length}{' '}
                Pokemons!
              </p>
            </>
          )}
        </motion.div>
        <TextPrompt>
          {capturePokemon?.data?.captured === false && (
            <>
              <h2>Unlucky.. {pokemonToDisplay.data.name} ran away.</h2>
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
