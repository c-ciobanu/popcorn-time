import { Eye, EyeOff, Heart, HeartOff, ListMinus, ListPlus } from 'lucide-react'
import { Book } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'
import { QUERY as BookQuery } from 'src/pages/BookPage/BookCell/BookCell'

type ActionsProps = {
  book: Book
}

const CREATE_BOOK_LIST_ITEM = gql`
  mutation CreateBookListItemMutation($input: CreateBookListItemInput!) {
    createBookListItem(input: $input) {
      id
    }
  }
`

const DELETE_BOOK_LIST_ITEM = gql`
  mutation DeleteBookListItemMutation($listName: DefaultBookList!, $bookId: Int!) {
    deleteBookListItem(listName: $listName, bookId: $bookId) {
      id
    }
  }
`

const Actions = ({ book }: ActionsProps) => {
  const { id: bookId, googleId, userInfo } = book
  const { favorited, read, inReadingList } = userInfo

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_BOOK_LIST_ITEM, {
    variables: { input: { bookId, listName: 'Favorites' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_BOOK_LIST_ITEM, {
    variables: { bookId, listName: 'Favorites' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createRead, { loading: createReadLoading }] = useMutation(CREATE_BOOK_LIST_ITEM, {
    variables: { input: { bookId, listName: 'Read' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteRead, { loading: deleteReadLoading }] = useMutation(DELETE_BOOK_LIST_ITEM, {
    variables: { bookId, listName: 'Read' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createToRead, { loading: createToReadLoading }] = useMutation(CREATE_BOOK_LIST_ITEM, {
    variables: { input: { bookId, listName: 'Reading_List' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteToRead, { loading: deleteToReadLoading }] = useMutation(DELETE_BOOK_LIST_ITEM, {
    variables: { bookId, listName: 'Reading_List' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })

  const toggleFavoritedStatus = () => {
    if (favorited) {
      deleteFavorited()
    } else {
      createFavorited()
    }
  }

  const toggleReadStatus = () => {
    if (read) {
      deleteRead()
    } else {
      createRead()
    }
  }

  const toggleToReadStatus = () => {
    if (inReadingList) {
      deleteToRead()
    } else {
      createToRead()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={toggleReadStatus}
        disabled={createReadLoading || deleteReadLoading}
        variant="outline"
        size="xl"
        className={cn(
          'justify-start gap-4 border-teal-500 px-2 text-base uppercase',
          read
            ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600 hover:text-white'
            : 'text-teal-500 hover:bg-teal-500 hover:text-white'
        )}
      >
        {read ? <Eye /> : <EyeOff />}
        <span>{read ? 'Read' : 'Set as read'}</span>
      </Button>

      {read ? null : (
        <Button
          onClick={toggleToReadStatus}
          disabled={createToReadLoading || deleteToReadLoading}
          variant="outline"
          size="xl"
          className={cn(
            'justify-start gap-4 border-sky-500 px-2 text-base uppercase',
            inReadingList
              ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white'
              : 'text-sky-500 hover:bg-sky-500 hover:text-white'
          )}
        >
          {inReadingList ? <ListPlus /> : <ListMinus />}
          <span>{inReadingList ? 'Listed on reading list' : 'Add to reading list'}</span>
        </Button>
      )}

      <Button
        onClick={toggleFavoritedStatus}
        disabled={createFavoritedLoading || deleteFavoritedLoading}
        variant="outline"
        size="xl"
        className={cn(
          'justify-start gap-4 border-red-500 px-2 text-base uppercase',
          favorited
            ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600 hover:text-white'
            : 'text-red-500 hover:bg-red-500 hover:text-white'
        )}
      >
        {favorited ? <Heart /> : <HeartOff />}
        <span>{favorited ? 'Favorited' : 'Add to favorites'}</span>
      </Button>
    </div>
  )
}

export default Actions
