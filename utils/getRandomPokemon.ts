export const getRandomPokemon = () => {
  const MAX_NUMBER: number = 493

  return Math.floor(Math.random() * (MAX_NUMBER - 1) + 1);
}