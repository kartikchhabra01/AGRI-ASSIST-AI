import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AccountSettings from './pages/AccountSettings'
import ComponentShowcase from './pages/ComponentShowcase'
import AIChat from './pages/AIChat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<AccountSettings />} />
      <Route path="/components" element={<ComponentShowcase />} />
      <Route path="/chat" element={<AIChat />} />
    </Routes>
  )
}

export default App
