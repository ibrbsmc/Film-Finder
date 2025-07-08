import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetail } from '../services/tmdbApi'
import { motion } from 'framer-motion'

export default function DetailPage() {
  // URL'den film ID'sini al
  const { id } = useParams()
  const navigate = useNavigate()

  // Film detay bilgisi
  const [movie, setMovie] = useState<any>(null)

  // Yorum inputu ve yorum listesi
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<string[]>([])

  // Sayfa açılınca film detayını API'den çek
  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getMovieDetail(id!)
      setMovie(data)
    }
    fetchDetail()
  }, [id])

  // Sayfa açılınca localStorage'dan yorumları al
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`comments_${id}`) || '[]')
    setComments(stored)
  }, [id])

  // Yeni yorum ekle
  const handleAddComment = () => {
    if (comment.trim() === '') return
    const updated = [...comments, comment.trim()]
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated))
    setComments(updated)
    setComment('')
  }

  // Film yüklenene kadar gösterilecek
  if (!movie) return <div>Yükleniyor...</div>

  return (
    <motion.div
      className="main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='detail-div'>
        {/* Header */}
        <div className='mini-header'>
          <h1 className='header-title' onClick={() => navigate('/')}>FF</h1>
        </div>

        {/* Film bilgileri */}
        <h1 className='detail-title'>{movie.title}</h1>
        <p className='detail-date'>{movie.release_date}</p>
        <p className='detail-desc'>{movie.overview}</p>
        <img
          className='detail-img'
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/defmv2.jpg'
          }
          alt={movie.title}
        />

        {/* Yorum ekleme kutusu */}
        <div style={{ marginTop: '20px', width: '80%', maxWidth: '600px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            style={{ width: '100%', padding: '10px', background: 'transparent', color: 'white' }}
          ></textarea>
          <button
            className="com-button"
            onClick={handleAddComment}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </div>

        {/* Yorumlar listesi */}
        <div style={{ marginTop: '20px', width: '80%', maxWidth: '600px', color: 'white' }}>
          <h3 style={{ marginBottom: '5px' }}>Comments:</h3>
          {comments.length === 0 && <p>No comments yet.</p>}
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {comments.map((c, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
