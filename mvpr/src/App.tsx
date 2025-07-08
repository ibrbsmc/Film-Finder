import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  )
}
