import { render, screen } from '@redwoodjs/testing/web'

import { standard } from 'src/pages/MoviePage/MovieCell/MovieCell.mock'

import Details, { formatMinutesToHoursAndMinutes } from './Details'

describe('Details', () => {
  it('renders successfully', () => {
    const movie = standard().movie
    render(<Details movie={movie} />)

    const runtimeText = formatMinutesToHoursAndMinutes(movie.runtime)

    expect(screen.getByText(movie.title)).toBeInTheDocument()
    expect(screen.queryByText(movie.runtime)).not.toBeInTheDocument()
    expect(screen.queryByText(runtimeText, { exact: false })).toBeInTheDocument()
  })
})
