import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchMovies } from '../services/tmdbApi'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'

// Poster yoksa kullanılacak varsayılan görsel
const DEFAULT_POSTER = '/defmv2.jpg'

export default function ListPage() {
  // API'den gelen film listesi
  const [movies, setMovies] = useState<any[]>([])
  // Şu anki sayfa numarası
  const [page, setPage] = useState(1)
  // Toplam sayfa sayısı
  const [totalPages, setTotalPages] = useState(1)
  // Favori film ID listesi
  const [favorites, setFavorites] = useState<number[]>([])

  const location = useLocation()
  const navigate = useNavigate()
  // URL'den arama sorgusunu al
  const query = new URLSearchParams(location.search).get('query') || ''

  // Sayfa değişince film listesini API'den getir
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await searchMovies(query, page)
      setMovies(data.results)
      setTotalPages(data.total_pages)
    }
    fetchMovies()
  }, [query, page])

  // Favorileri localStorage'dan al
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favs.map((m: any) => m.id))
  }, [])

  // Poster URL'si hazırla
  const getPoster = (poster_path: string | null) =>
    poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : DEFAULT_POSTER

  // Film detay sayfasına git
  const handleSelectMovie = (id: number) => {
    navigate(`/detail/${id}`)
  }

  // Favori ekle/çıkar toggle
  const toggleFavorite = (movie: any, e: React.MouseEvent) => {
    e.stopPropagation() // Kart tıklamasını engelle
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
    const exists = favorites.includes(movie.id)
    let updated

    if (exists) {
      // Varsa favoriden çıkar
      updated = stored.filter((m: any) => m.id !== movie.id)
    } else {
      // Yoksa favoriye ekle
      updated = [...stored, movie]
    }

    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated.map((m: any) => m.id))
  }

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='main-div'>
        {/* Üst logo başlık */}
        <div className='mini-header'>
          <h1 className='header-title' onClick={() => navigate('/')}>FF</h1>
        </div>

        {/* Film kartları listesi */}
        <div className='listpage-card-list'>
          {movies.map(movie => (
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

        {/* Sayfa geçiş butonları */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
          <Button
            className="search-button"
            variant="outlined"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            className="search-button"
            variant="outlined"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>

        {/* Şu anki sayfa bilgisi */}
        <p className='listpage-text' style={{ textAlign: 'center', color: 'white' }}>
          Page: {page} / {totalPages}
        </p>
      </div>
    </motion.div>
  )
}
