// TMDB'den veri çekmek için API anahtarı
const API_KEY = '03a59a2e377bc40c5a5aad3ce45a3116'

// TMDB ana URL
const BASE_URL = 'https://api.themoviedb.org/3'

// Film aramak için istek atar
// query: Aranacak film ismi
// page: Sayfa numarası (varsayılan 1)
export async function searchMovies(query: string, page = 1) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`)
  return res.json()
}

// Film detay bilgisi almak için istek atar
// id: Filmin ID'si
export async function getMovieDetail(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
  return res.json()
}
