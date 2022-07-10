import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRandomPokemon } from 'utils/getRandomPokemon'
import { trpc } from 'utils/trpc'
import type { Session } from 'next-auth'
import TextPrompt from 'components/ui/TextPrompt'
import { Button } from '@chakra-ui/react'

export default function Capture({
  session,
}: {
  session: Session
}): JSX.Element {
  // spawn a random pokemon to capture
  const [id, setId] = useState(() => getRandomPokemon())
  const updateCurrentlyFacingPokemon = trpc.useMutation([
    'update-currently-facing-pokemon',
  ])
  const capturePokemon = trpc.useMutation(['capture-pokemon'])

  const pokeballThrowDuration: number = 1.5

  // capture logic
  const [isCapturing, setIsCapturing] = useState(false)
  const [isInside, setIsInside] = useState(false)
  const [captureIsLoading, setCaptureIsLoading] = useState(false)
  const [captureResult, setCaptureResult] = useState(false)

  useEffect(() => {
    if (
      // @ts-ignore
      typeof capturePokemon?.data?.captured === 'boolean' && // @ts-ignore
      capturePokemon?.data?.captured === false
    ) {
      setIsCapturing(false)
    }
  }, [capturePokemon])

  const pokemonAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.8 } },
    inside: {
      scale: 0,
      opacity: 1,
      x: '-10vw',
      y: '-10vh',
      transition: {
        type: 'spring',
        delay: pokeballThrowDuration + 0.4,
        duration: 0.9,
      },
    },
  }

  const pokeballVariants = {
    noCapture: { opacity: 0, x: 0, y: 900, scale: 0 },
    capture: {
      opacity: 1,
      scale: [0, 1, '.5'],
      x: ['-50%', '-60%', '-85%'],
      y: ['90vh', '-60vh', '-60vh', '-50vh'],
      rotate: 1550,
      transition: { type: 'spring', duration: pokeballThrowDuration, delay: 0 },
    },
  }

  const onPokemonInside = () => {
    if (isCapturing) {
      setIsInside(true)
    }
  }

  const onPokeballEnd = () => {
    if (!session?.user?.email) {
      setCaptureIsLoading(false)
      return
    }

    capturePokemon.mutate({
      userEmail: session?.user?.email,
      pokemonId: pokemon,
    })

    setIsInside(false)
    setIsCapturing(false)
    setCaptureResult(true)
    setCaptureIsLoading(false)
  }

  const handleCapturing = () => {
    setCaptureIsLoading(true)
    setIsCapturing(!isCapturing)
  }

  const handleReset = () => {
    setId(() => getRandomPokemon())

    updateCurrentlyFacingPokemon.mutate({
      userEmail: session?.user?.email || '',
      pokemonId: getRandomPokemon(),
    })

    setCaptureResult(false)
  }

  let pokemon = id
  let user = null

  // logic to keep showing the same pokemon you encountered until
  // you take action
  // save currently facing pokemon in the db and if it's NULL then get a random one
  if (session?.user?.email) {
    user = trpc.useQuery(['get-user-by-email', { email: session?.user?.email }])

    if (
      user &&
      user.status === 'success' &&
      !user.data?.currentlyFacingPokemonId
    ) {
      updateCurrentlyFacingPokemon.mutate({
        userEmail: session?.user?.email,
        pokemonId: pokemon,
      })
    } else if (
      user &&
      user.status === 'success' &&
      user.data?.currentlyFacingPokemonId
    ) {
      pokemon = user.data.currentlyFacingPokemonId
    }
  }

  let pokemonToDisplay = trpc.useQuery(['get-pokemon-by-id', { id: pokemon }])

  if (!pokemonToDisplay || pokemonToDisplay.isLoading)
    return <div>Loading...</div>

  if (!pokemonToDisplay.data) return <div>No data</div>

  if (captureResult)
    return (
      <>
        <motion.div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-slate-500 to-gray-800 text-white'>
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
                  <span className='capitalize'>
                    {pokemonToDisplay.data.name}
                  </span>
                </span>
              </>
            )}
            {capturePokemon?.data?.capturedPokemons?.length && (
              <>
                <span>
                  <span className='capitalize'>
                    {pokemonToDisplay.data.name}
                  </span>{' '}
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

  return (
    <>
      <div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-indigo-500 to-green-400'>
        <div className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'>
          <motion.img
            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon}.png`}
            width='400'
            height='400'
            initial='hidden'
            animate={isCapturing ? 'inside' : 'visible'}
            variants={pokemonAnimation}
            className='max-w-full'
            onAnimationComplete={onPokemonInside}
            alt={pokemonToDisplay?.data?.name || 'image'}
          />
          <h2 className='text-6xl text-black italic font-extrabold capitalize'>
            {pokemonToDisplay.data.name}{' '}
          </h2>
        </div>
        {isCapturing && !isInside && (
          <div className='pokeball-container relative w-screen h-screen'>
            <motion.img
              className='left-1/2 text-center absolute bottom-0 '
              src='/images/pokeball.png'
              alt='pokeball'
              animate={isCapturing ? 'capture' : 'noCapture'}
              variants={pokeballVariants}
            />
          </div>
        )}
        {isInside && (
          <div className='pokeball-container relative w-screen h-screen'>
            <motion.img
              className='left-1/2 text-center absolute bottom-0 '
              src='/images/pokeball.png'
              alt='pokeball'
              animate={{
                x: ['-85%', '-50%'],
                y: ['-50vh', '-50vh'],
                scale: ['.5', '.8'],
                rotate: [1550, 1445],
                transition: {
                  duration: 2,
                  type: 'spring',
                },
              }}
              onAnimationComplete={onPokeballEnd}
            />
          </div>
        )}
      </div>
      <TextPrompt>
        <h2>
          A wild{' '}
          <span className='capitalize font-extrabold text-black'>
            {pokemonToDisplay.data.name}
          </span>{' '}
          appeared, what would you like to do?
        </h2>
        <div className='grid grid-cols-2 gap-3 mt-2'>
          <Button
            onClick={handleCapturing}
            isLoading={captureIsLoading}
            colorScheme='teal'
            variant='solid'
          >
            Capture!
          </Button>
          <Button>Flee</Button>
        </div>
      </TextPrompt>
    </>
  )
}
