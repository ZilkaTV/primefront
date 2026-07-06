import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import League from './pages/League'
import LeagueApply from './pages/LeagueApply'
import Clans from './pages/Clans'
import ClanDetail from './pages/ClanDetail'
import Tournaments from './pages/Tournaments'
import ClanFinder from './pages/ClanFinder'
import Maps from './pages/Maps'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Rules from './pages/Rules'
import About from './pages/About'
import Admin from './pages/Admin'
import PlayerRegister from './pages/PlayerRegister'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/league" element={<League />} />
        <Route path="/league/apply" element={<LeagueApply />} />
        <Route path="/clans" element={<Clans />} />
        <Route path="/clans/:id" element={<ClanDetail />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/clan-finder" element={<ClanFinder />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<PlayerRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
