import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './modules/landingPage/components/LandingPage'
import LandingPagev1 from './modules/landingPage/components/LandingPagev1'
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
import AllEvents from './modules/events/components/AllEvents'
import AllTeams from './modules/teams/components/AllTeams'
import MakeEvent from './modules/events/components/MakeEvent'
import EditEvents from './modules/events/components/EditEvents'
import 'react-image-crop/dist/ReactCrop.css'
import { ThemeProvider } from './components/themeProvider'
import ChangePasswordVerification from './modules/authentication/components/ChangePasswordVerification'
import ChangePassword from './modules/authentication/components/ChangePassword'

function App() {

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/launch" element={<LandingPagev1 />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:teamUrl" element={<ProfileTeam />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/changePasswordVerify" element={<ChangePasswordVerification />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="/colleges" element={<HomePage />} />
                <Route path="/events" element={<AllEvents />} />
                <Route path="/teams" element={<AllTeams />} />
                <Route path="/teams/:teamUrl" element={<TeamDetails />} />
                <Route path="/:collegeUrl" element={<Events />} />
                <Route path="/:collegeUrl/:eventUrl/edit" element={<EditEvents />} />
                <Route path="/:collegeUrl/:eventUrl" element={<Teams />} />
                <Route path="/:collegeUrl/makeEvent" element={<MakeEvent />} />
                <Route path="/:collegeUrl/:eventUrl/:teamUrl" element={<TeamDetails />} />
                <Route path="/:collegeUrl/:eventUrl/makeTeam" element={<MakeTeam />} />
              </Routes>
            </Suspense>
          </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
