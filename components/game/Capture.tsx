import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { getRandomPokemon } from 'utils/getRandomPokemon'
import { trpc } from 'utils/trpc'
import type { Session } from 'next-auth'
import Image from 'next/image'

export default function Capture({
  session,
}: {
  session: Session
}): JSX.Element {
  // spawn a random pokemon to capture
  const [id, _] = useState(() => getRandomPokemon())
  const updateCurrentlyFacingPokemon = trpc.useMutation([
    'update-currently-facing-pokemon',
  ])

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

  const pokemonToDisplay = trpc.useQuery(['get-pokemon-by-id', { id: pokemon }])

  if (!pokemonToDisplay || pokemonToDisplay.isLoading) return null

  if (!pokemonToDisplay.data) return

  return (
    <>
      <div className='w-screen h-screen overflow-hidden'>
        <div className='pokemon-container mx-auto w-max'>
          <Image
            src={pokemonToDisplay?.data?.sprites.front_default || ''}
            width='400'
            height='400'
            alt={pokemonToDisplay?.data?.name || 'image'}
          />
          <h2 className='text-6xl text-gray-700 italic font-extrabold capitalize'>
            {pokemonToDisplay.data.name}{' '}
          </h2>
        </div>
      </div>
    </>
  )
}
