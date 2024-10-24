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
import Teams from './modules/teams/components/Teams'
import { Suspense } from 'react'
import Loading from './modules/core/components/Loading'
import TeamDetails from './modules/teams/components/TeamDetails'
import MakeTeam from './modules/teams/components/MakeTeam'
import ProfileTeam from './modules/profile/components/ProfileTeam'

function App() {

  return (
    <AuthProvider> 
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:teamUrl" element={<ProfileTeam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/colleges" element={<HomePage />} />
            <Route path="/:collegeUrl" element={<Events />} />
            <Route path="/:collegeUrl/:eventUrl" element={<Teams />} />
            <Route path="/:collegeUrl/:eventUrl/:teamUrl" element={<TeamDetails />} />
            <Route path="/:collegeUrl/:eventUrl/makeTeam" element={<MakeTeam />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
