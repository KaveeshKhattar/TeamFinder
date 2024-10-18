import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './modules/landingPage/components/LandingPage'
import Verification from './modules/authentication/components/Verification'
import HomePage from './modules/home/components/HomePage'
import Login from './modules/authentication/components/Login'
import Signup from './modules/authentication/components/Signup'
import { AuthProvider } from './modules/core/components/AuthContext'
import Profile from './modules/profile/components/Profile'
import Events from './modules/events/components/Events'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/colleges" element={<HomePage />} />
          <Route path="/:collegeUrl" element={<Events />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
