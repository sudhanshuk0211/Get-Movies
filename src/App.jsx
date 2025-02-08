import { useState } from 'react'
import Search from './components/search'

import './App.css'
import { useEffect } from 'react'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'

const API_BASE_URL= 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTION ={
  method : 'GET',
  headers :{
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage , seterrorMessage] = useState("")
  const [movies,setMovie] = useState([])
  const [isLoading,setIsLoading] =useState(false)
 

  
  

  const fetchMovies =async(query="")=>{
    setIsLoading(true)
    seterrorMessage("")
    try {
      const endpoint = query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`   : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint,API_OPTION)

      if(!response.ok){
        throw new Error('failed to fetch movies')
      }
      const data =await response.json()



      if(data.response === "False"){
        seterrorMessage( data.error || "failed to fetch movies")
        setMovie([])
        return; 
      }
      setMovie(data.results || [])
    } 
    catch (error) {
      console.log(`error fecting movies: ${error}`)
      seterrorMessage(`please try again later`)
    } finally {setIsLoading(false)}
  }
  useEffect(() =>{
    fetchMovies(searchTerm)
  },[searchTerm])
  return (
    <main>

      <div className="pattern"></div>
    <div className="wrapper">
      <header>
        <img src='./hero.png' alt = "hero-banner"></img>
        <h1>Find Some Good <span className='text-gradient'>Movies</span> To Watch  </h1>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      </header>

      <section className='all-movies'>
        <h2 className='mt-[40px]'>All movies</h2>

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage} </p>
         ): (
          <ul>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
         )}

      </section>
      
    </div>
  
  
  </main>
  )
}

export default App
