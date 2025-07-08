import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchMovies } from '../services/tmdbApi'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import Alert from '@mui/material/Alert'

// Poster yoksa gösterilecek varsayılan görsel
const DEFAULT_POSTER = '/defmv2.jpg'

export default function SearchBar() {
  // Arama kutusundaki yazı
  const [query, setQuery] = useState('')
  // API'den gelen arama sonuçları
  const [results, setResults] = useState<any[]>([])
  // Favori film ID listesi (localStorage'dan gelir)
  const [favorites, setFavorites] = useState<number[]>([])
  // Alert mesajı
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  // Sayfa ilk yüklendiğinde favorileri localStorage'dan al
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favs.map((m: any) => m.id))
  }, [])

  // Input her değiştiğinde arama yap
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.length >= 2) {
      const data = await searchMovies(value)
      setResults(data.results.slice(0, 9))
    } else {
      setResults([])
    }
  }

  // Daha fazla sonuç butonu → list sayfasına git
  const handleMoreResults = () => {
    navigate(`/list?query=${query}`)
  }

  // Favoriler sayfasına git
  const handleShowFavorites = () => {
    navigate('/favorites')
  }

  // Film kartına tıklayınca detay sayfasına git
  const handleSelectMovie = (id: number) => {
    navigate(`/detail/${id}`)
  }

  // Poster URL'si hazırla, yoksa varsayılan resmi ver
  const getPoster = (poster_path: string | null) =>
    poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : DEFAULT_POSTER

  // Favoriye ekle/çıkar toggle
  const toggleFavorite = (movie: any, e: React.MouseEvent) => {
    e.stopPropagation() // Kart tıklamasını engelle
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
    const exists = favorites.includes(movie.id)
    let updated

    if (exists) {
      // Varsa favoriden çıkar
      updated = stored.filter((m: any) => m.id !== movie.id)
      setMessage(`"${movie.title}" has been removed from favorites.`)
    } else {
      // Yoksa favoriye ekle
      updated = [...stored, movie]
      setMessage(`"${movie.title}" has been added to favorites.`)
    }

    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated.map((m: any) => m.id))

    // 2 saniye sonra mesajı temizle
    setTimeout(() => {
      setMessage('')
    }, 2000)
  }

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='search-main-div'>
        {/* ALERT */}
        {message && (
          <div style={{ width: '80%', maxWidth: '600px', margin: '20px auto',position:'relative',top:'30px' }}>
            <Alert
              variant="outlined"
              severity="success"
              sx={{
                color: 'white',
                borderColor: 'blue'
              }}
            >
              {message}
            </Alert>
          </div>
        )}

        {/* Arama inputu */}
        <TextField
          className='input'
          label="Movie Name ..."
          variant="standard"
          value={query}
          onChange={handleInputChange}
          fullWidth
        />

        {/* Kart listesi */}
        <div className='card-list'>
          {results.map(movie => (
            <div
              key={movie.id}
              className="card-container"
              onClick={() => handleSelectMovie(movie.id)}
            >
              <div className="card-flip">
                {/* Kart ön yüzü */}
                <Card className="card-face card-front">
                  <CardMedia
                    component="img"
                    height="300"
                    image={getPoster(movie.poster_path)}
                    alt={movie.title}
                  />
                </Card>

                {/* Kart arka yüzü */}
                <Card
                  className="card-face card-back"
                  style={{
                    backgroundImage: `url(${getPoster(movie.poster_path)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="card-back-overlay">
                    <CardContent>
                      <Typography variant="h6" className="card-title">
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" className="card-subtitle">
                        Click to see details
                      </Typography>
                      {/* Yıldız toggle */}
                      <div
                        onClick={(e) => toggleFavorite(movie, e)}
                        style={{ cursor: 'pointer', marginTop: '10px' }}
                      >
                        {favorites.includes(movie.id) ? (
                          <StarIcon style={{ color: 'gold' }} />
                        ) : (
                          <StarBorderIcon style={{ color: 'white' }} />
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Alttaki butonlar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '60px' }}>
          <Button
            className='search-button'
            variant="outlined"
            onClick={handleMoreResults}
            disabled={!query}
          >
            Show More Movies
          </Button>

          <Button
            className='search-button'
            variant="outlined"
            onClick={handleShowFavorites}
          >
            Show Favorite Movies
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
