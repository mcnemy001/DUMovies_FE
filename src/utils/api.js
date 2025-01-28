const BASE_URL = import.meta.env.VITE_BACKEND_URL ||"https://dumovies-production.up.railway.app";

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

// Add this to utils/api.js
export const getMovieRecommendations = async (mood, genre1, genre2) => {
  try {
    console.log('Fetching recommendations with:', { mood, genre1, genre2 });
    
    const response = await fetch(`${BASE_URL}/movies/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mood: mood.toLowerCase(), // Explicitly convert to lowercase
        genre1, 
        genre2 
      }),
    });

    console.log('Recommendation response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Recommendation error:', errorData);
      throw new Error(errorData.message || 'Failed to get recommendations');
    }

    const data = await response.json();
    console.log('Recommendation response data:', data);
    return data;
  } catch (error) {
    console.error('Recommendation fetch error:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movies/details/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch movie details');
  }
  return response.json();
};

export const getSimilarMovies = async (movieId) => {
  const response = await fetch(`${BASE_URL}/movies/similar/${movieId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch similar movies');
  }
  return response.json();
};

export const getTrendingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies/trending`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch trending movies');
  }
  return response.json();
};

export const getUpcomingMovies = async () => {
  const response = await fetch(`${BASE_URL}/movies/upcoming`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch upcoming movies');
  }
  return response.json();
};

export const getMoviesByQuery = async (query) => {
  const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to search movies');
  }
  return response.json();
};

// Add to existing api.js
export const saveQuizResult = async (quizData) => {
  const response = await fetch(`${BASE_URL}/quiz/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save quiz result');
  }
  return response.json();
};

export const getQuizResult = async (userId) => {
  const response = await fetch(`${BASE_URL}/quiz/get?userId=${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to retrieve quiz result');
  }
  return response.json();
};

export const getWatchlist = async (userId) => {
  const response = await fetch(`${BASE_URL}/watchlist/watchlist/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch watchlist');
  }

  const data = await response.json();
  return data; // Mengembalikan data dari response backend
};


export const addToWatchlist = async (userId, movieId) => {
  const response = await fetch(`${BASE_URL}/watchlist/addwatchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, movie_id: movieId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add to watchlist');
  }

  return response.json();
};

export const removeFromWatchlist = async (userId, movieId) => {
  const response = await fetch(`${BASE_URL}/watchlist/removewatchlist`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, movie_id: movieId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove movie from watchlist');
  }

  return response.json();
};

export const savePreferences = async (preferences) => {
  try {
    const response = await fetch(`${BASE_URL}/api/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    // Log status dan teks respons untuk debugging
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Cek apakah respons kosong
    if (responseText.trim() === '') {
      throw new Error('Empty response from server');
    }

    // Coba parse JSON
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (jsonError) {
      console.error('JSON Parsing Error:', jsonError);
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error('Detailed save preferences error:', error);
    throw error;
  }
};

export const getUserPreferences = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/preferences/${userId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch preferences');
  }
  return response.json();
};


export const updateUserPreferences = async (preferences) => {
  try {
    const response = await fetch(`${BASE_URL}/api/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update preferences');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};