import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatchedMovie, deleteWatchedMovie } from './watchedMovies'
import type { StandardScenario } from './watchedMovies.scenarios'

describeScenario<StandardScenario>('watchedMovies', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a watched movie', async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createWatchedMovie({ input: { movieId: scenario.movie.parasite.id } })

    expect(result.movieId).toEqual(scenario.movie.parasite.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it("creates a watched movie and removes it from the user's watchlist", async () => {
    mockCurrentUser(scenario.user.john)

    const toWatchMovieCount = () =>
      db.toWatchMovie.count({
        where: { movieId: scenario.toWatchMovie.one.movieId, userId: scenario.user.john.id },
      })

    await expect(toWatchMovieCount()).resolves.toBe(1)

    await createWatchedMovie({ input: { movieId: scenario.toWatchMovie.one.movieId } })

    await expect(toWatchMovieCount()).resolves.toBe(0)
  })

  it('does not allow a logged out user to create a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await createWatchedMovie({ input: { movieId: 1 } })).rejects.toThrow(AuthenticationError)
  })

  it('deletes a watched movie', async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteWatchedMovie({ movieId: scenario.watchedMovie.one.movieId })
    const result = await db.watchedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteWatchedMovie({ movieId: 1 })).rejects.toThrow(AuthenticationError)
  })
})
