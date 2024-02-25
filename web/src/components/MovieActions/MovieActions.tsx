import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { UserMovie } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { QUERY as MovieQuery } from 'src/components/MovieCell'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'

type MovieActionsProps = {
  id: number
  userState: UserMovie
}

const CREATE_FAVORITED_MOVIE = gql`
  mutation CreateFavoritedMovieMutation($input: CreateFavoritedMovieInput!) {
    createFavoritedMovie(input: $input) {
      id
    }
  }
`

const DELETE_FAVORITED_MOVIE = gql`
  mutation DeleteFavoritedMovieMutation($tmdbId: Int!) {
    deleteFavoritedMovie(tmdbId: $tmdbId) {
      id
    }
  }
`

const CREATE_WATCHED_MOVIE = gql`
  mutation CreateWatchedMovieMutation($input: CreateWatchedMovieInput!) {
    createWatchedMovie(input: $input) {
      id
    }
  }
`

const DELETE_WATCHED_MOVIE = gql`
  mutation DeleteWatchedMovieMutation($tmdbId: Int!) {
    deleteWatchedMovie(tmdbId: $tmdbId) {
      id
    }
  }
`

const MovieActions = ({ id, userState }: MovieActionsProps) => {
  const { favorited, watched } = userState

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_FAVORITED_MOVIE, {
    variables: { input: { tmdbId: id } },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_FAVORITED_MOVIE, {
    variables: { tmdbId: id },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [createWatched, { loading: createWatchedLoading }] = useMutation(CREATE_WATCHED_MOVIE, {
    variables: { input: { tmdbId: id } },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(DELETE_WATCHED_MOVIE, {
    variables: { tmdbId: id },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })

  const toggleFavoritedStatus = () => {
    if (favorited) {
      deleteFavorited()
    } else {
      createFavorited()
    }
  }

  const toggleWatchedStatus = () => {
    if (watched) {
      deleteWatched()
    } else {
      createWatched()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleWatchedStatus}
              disabled={createWatchedLoading || deleteWatchedLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-teal-500 px-2 py-3 uppercase',
                watched
                  ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600'
                  : 'text-teal-500 hover:bg-teal-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={watched ? faSolidEye : faRegularEye} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{watched ? 'Watched' : 'Set as watched'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{watched ? 'Remove from watched movies' : 'Set as watched'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleFavoritedStatus}
              disabled={createFavoritedLoading || deleteFavoritedLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-red-500 px-2 py-3 uppercase',
                favorited
                  ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
                  : 'text-red-500 hover:bg-red-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={favorited ? faSolidHeart : faRegularHeart} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{favorited ? 'Favorited' : 'Add to favorites'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-full">
            <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default MovieActions