import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getRandomPokemon } from 'utils/getRandomPokemon'
import { trpc } from 'utils/trpc'
import type { Session } from 'next-auth'
import TextPrompt from 'components/ui/TextPrompt'
import { Button } from '@chakra-ui/react'
import { User } from '@prisma/client'
import BouncyButton from 'components/ui/BouncyButton'
import CapturingScreen from './CapturingScreen'
import LoadingScreen from './LoadingScreen'

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

  const [userData, setUserData] = useState<any>(undefined)
  const [pokemon, setPokemon] = useState(0)

  const [isCapturing, setIsCapturing] = useState(false)
  const [isInside, setIsInside] = useState(false)
  const [captureIsLoading, setCaptureIsLoading] = useState(false)
  const [captureResult, setCaptureResult] = useState(false)

  const [fleeIsLoading, setFleeIsLoading] = useState(false)
  const [flee, setFlee] = useState(false)

  trpc.useQuery(['get-user-by-email', { email: session?.user?.email || '' }], {
    onSuccess: setUserData,
  })

  useEffect(() => {
    if (userData?.currentlyFacingPokemonId) {
      setPokemon(userData?.currentlyFacingPokemonId)
    } else {
      setPokemon(id)
    }
  }, [userData, id, pokemon])

  useEffect(() => {
    if (
      typeof capturePokemon?.data?.captured === 'boolean' &&
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

  // animation end listeners
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

  const handleFlee = () => {
    setFlee(true)
  }

  const handleReset = () => {
    setId(() => getRandomPokemon())

    updateCurrentlyFacingPokemon.mutate({
      userEmail: session?.user?.email || '',
      pokemonId: id,
    })

    setUserData((prevState: User) => ({
      ...prevState,
      currentlyFacingPokemonId: id,
    }))

    setFlee(false)
    setCaptureResult(false)
  }

  const handleImageNumber = () => {
    // add 00 if < 10 and 0 if < 100 but > 10
    if (pokemon < 10) {
      return `00${pokemon}`
    } else if (pokemon > 10 && pokemon < 100) {
      return `0${pokemon}`
    } else {
      return pokemon
    }
  }

  let pokemonToDisplay = trpc.useQuery(['get-pokemon-by-id', { id: pokemon }])

  if (!pokemonToDisplay || pokemonToDisplay.isLoading) return <LoadingScreen />

  if (!pokemonToDisplay.data) return <LoadingScreen />

  return (
    <>
      <AnimatePresence>
        {captureResult && (
          <CapturingScreen
            capturePokemon={capturePokemon}
            pokemonToDisplay={pokemonToDisplay}
            handleReset={handleReset}
          />
        )}
      </AnimatePresence>
      {!captureResult && (
        <>
          <div className='w-screen h-screen overflow-hidden bg-gradient-to-t from-green-600 to-green-400'>
            <div className='pokemon-container top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute mx-auto w-max text-center'>
              <AnimatePresence>
                {!flee && (
                  <>
                    <motion.img
                      key={'1'}
                      src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${handleImageNumber()}.png`}
                      width='400'
                      height='400'
                      initial='hidden'
                      animate={isCapturing ? 'inside' : 'visible'}
                      variants={pokemonAnimation}
                      exit={{ scale: 0 }}
                      className='max-w-full'
                      onAnimationComplete={onPokemonInside}
                      alt={pokemonToDisplay?.data?.name || 'image'}
                    />
                    <motion.h2
                      key={'2'}
                      className='text-6xl text-black italic font-extrabold capitalize'
                      exit={{ scale: 0 }}
                    >
                      {pokemonToDisplay.data.name}{' '}
                    </motion.h2>
                  </>
                )}
              </AnimatePresence>
            </div>
            {isCapturing && !isInside && (
              <div className='pokeball-container relative w-screen h-screen'>
                <motion.img
                  className='left-1/2 text-center absolute bottom-0 '
                  src='/images/pokeball.png'
                  alt='pokeball'
                  animate={isCapturing ? 'capture' : 'noCapture'}
                  exit={{ scale: 0 }}
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
            {flee && (
              <>
                <h2>
                  You have successfully ran away from{' '}
                  <span className='text-black capitalize'>
                    {pokemonToDisplay.data.name}
                  </span>
                </h2>
                <div className='mt-2 mx-auto text-center'>
                  <BouncyButton>
                    <Button
                      onClick={handleReset}
                      colorScheme='teal'
                      variant='solid'
                    >
                      Continue
                    </Button>
                  </BouncyButton>
                </div>
              </>
            )}

            {!flee && (
              <>
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
                  <Button onClick={handleFlee} isLoading={fleeIsLoading}>
                    Flee
                  </Button>
                </div>
              </>
            )}
          </TextPrompt>
        </>
      )}
    </>
  )
}
