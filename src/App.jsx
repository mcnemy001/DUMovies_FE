import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/styles/index.css';
import Startup from './pages/Startup';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import QuizMood from './pages/QuizMood';
import QuizGenre from './pages/QuizGenre';
import QuizResult from './pages/QuizResult';
import Recommendations from './pages/Recommendations';
import Watchlist from './pages/Watchlist';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import PrivateRoute from './components/auth/PrivateRoute';
import { QuizProvider } from './context/QuizContext';

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Startup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route 
            path="/quizmood" 
            element={
              <PrivateRoute PrivateRoute blockWhenLoggedIn={true}>
                <QuizMood />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/quizgenre" 
            element={
              <PrivateRoute PrivateRoute blockWhenLoggedIn={true}>
                <QuizGenre />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/quizresult" 
            element={
              <PrivateRoute PrivateRoute blockWhenLoggedIn={true}>
                <QuizResult />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <PrivateRoute>
                <Recommendations />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <PrivateRoute>
                <Watchlist />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/moviedetail/:id"
            element={
              <PrivateRoute>
                <MovieDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;
