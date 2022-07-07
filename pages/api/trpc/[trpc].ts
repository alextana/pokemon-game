import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { PokemonClient } from 'pokenode-ts';
import { prisma } from '../../../utils/prisma'

export const appRouter = trpc
  .router()
  .query("get-user-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({input}) {
      const user = await prisma.user.findMany({
        where: {
          id: input.id,
        }
      })
      return user
    }
  })
  .mutation("capture-pokemon", {
      input: z.object({ userId: z.number(), pokemonId: z.number() }),
      async resolve({ input }) {
        const updateUser = await prisma.user.update({
          where: {
            id: input.userId
          },
          data: {
            capturedPokemons: {
              push: input.pokemonId,
            }
          }
        })

        return updateUser
      }
  })
  .query("get-pokemon-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const api = new PokemonClient()

      const pokemon = await api
      .getPokemonById(input.id);
      return pokemon
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});