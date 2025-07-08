import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import StarIcon from '@mui/icons-material/Star'
import Alert from '@mui/material/Alert'

// Poster yoksa kullanılacak varsayılan görsel
const DEFAULT_POSTER = '/defmv2.jpg'

export default function FavoritesPage() {
  // Favori film listesi
  const [favorites, setFavorites] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Sayfa ilk açıldığında localStorage'dan favorileri al
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favs)
  }, [])

  // Kart tıklanınca detay sayfasına git
  const handleSelectMovie = (id: number) => {
    navigate(`/detail/${id}`)
  }

  // Poster URL'si hazırla
  const getPoster = (poster_path: string | null) =>
    poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : DEFAULT_POSTER

  // Favoriden çıkar (yıldız simgesine basınca)
  const toggleFavorite = (movie: any, e: React.MouseEvent) => {
    e.stopPropagation() // Kart tıklamasını engelle
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]')
    const updated = stored.filter((m: any) => m.id !== movie.id)
    localStorage.setItem('favorites', JSON.stringify(updated))
    setFavorites(updated)

    // Alert mesajı ver
    setMessage(`"${movie.title}" has been removed from favorites.`)

    // 3 saniye sonra mesajı temizle
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo header */}
      <div className="mini-header">
        <h1 className="header-title" onClick={() => navigate('/')}>FF</h1>
      </div>

      {/* ALERT */}
      {message && (
        <div style={{ width: '80%', maxWidth: '600px', margin: '20px auto', position:'relative', top:'30px' }}>
          <Alert variant="outlined" severity="success"  sx={{color: 'white',borderColor: 'blue'}}>
            {message}
          </Alert>
        </div>
      )}

      {/* Favori yoksa mesaj */}
      {favorites.length === 0 && (
        <p style={{ textAlign: 'center', color: 'white', position: 'relative', top: '60px' }}>
          You don't have any favorite movies yet.
        </p>
      )}

      {/* Favori film kartları */}
      <div className="listpage-card-list">
        {favorites.map(movie => (
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
                    {/* Favoriden çıkarma ikonu */}
                    <div
                      onClick={(e) => toggleFavorite(movie, e)}
                      style={{ cursor: 'pointer', marginTop: '10px' }}
                    >
                      <StarIcon style={{ color: 'gold' }} />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
