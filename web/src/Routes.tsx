// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'

import UnauthenticatedRoute from 'src/components/UnauthenticatedRoute/UnauthenticatedRoute'
import AppLayout from 'src/layouts/AppLayout/AppLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={AppLayout}>
        <Set wrap={UnauthenticatedRoute}>
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          {/* <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" /> */}
          {/* <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" /> */}

          <Route path="/" page={HomePage} name="home" />
        </Set>

        <Route path="/search/{entity:String}" page={SearchPage} name="search" />
        <Route path="/movies/{tmdbId:Int}" page={MoviePage} name="movie" />
        <Route path="/books/{googleId:String}" page={BookPage} name="book" />

        <PrivateSet unauthenticated="home">
          <Route path="/dashboard" page={DashboardPage} name="dashboard" />
          <Route path="/dashboard/favorites/movies" page={UserFavoriteMoviesPage} name="userFavoriteMovies" />
          <Route path="/dashboard/history/movies" page={UserWatchedMoviesPage} name="userWatchedMovies" />
          <Route path="/dashboard/watchlist/movies" page={UserMoviesWatchlistPage} name="userMoviesWatchlist" />
          <Route path="/dashboard/favorites/books" page={UserFavoriteBooksPage} name="userFavoriteBooks" />
          <Route path="/dashboard/history/books" page={UserReadBooksPage} name="userReadBooks" />
          <Route path="/dashboard/readinglist/books" page={UserBooksReadingListPage} name="userBooksReadingList" />
          <Route path="/documents" page={DocumentsPage} name="documents" />
        </PrivateSet>
      </Set>

      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
