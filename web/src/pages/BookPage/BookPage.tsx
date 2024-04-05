import { Metadata } from '@redwoodjs/web'

import BookCell from 'src/components/BookCell'

type BookPageProps = {
  googleId: string
}

const BookPage = ({ googleId }: BookPageProps) => {
  return (
    <>
      <Metadata title="Book" description="Book page" />

      <BookCell googleId={googleId} />
    </>
  )
}

export default BookPage