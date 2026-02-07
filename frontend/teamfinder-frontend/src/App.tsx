import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Suspense } from 'react'
import Loading from './modules/core/components/Loading'
import 'react-image-crop/dist/ReactCrop.css'
import { ThemeProvider } from './components/themeProvider'

import LandingPage from './modules/landingPage/components/LandingPage'
import LandingPagev1 from './modules/landingPage/components/LandingPagev1'

import Login from './modules/authentication/components/Login'
import Signup from './modules/authentication/components/Signup'
import { AuthProvider } from './modules/core/components/AuthContext'
import Verification from './modules/authentication/components/Verification'
import Profile from './modules/profile/components/Profile'
import ChangePasswordVerification from './modules/authentication/components/ChangePasswordVerification'
import ChangePassword from './modules/authentication/components/ChangePassword'

import ShowInterest from './modules/showInterest/ShowInterest'
import FindTeammates from './modules/find/FindTeammates'
import FindTeammatesPeople from './modules/find/FindTeammatesPeople'

import PostTeamLandingPage from './modules/teams/components/PostTeamLandingPage'
import FindTeams from './modules/teams/components/FindTeam'
import FindActualTeams from './modules/teams/components/FindActualTeams'
import { AllChatsPage } from './modules/chat/AllChatsPage'

function App() {

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/changePasswordVerify" element={<ChangePasswordVerification />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/profile" element={<Profile />} />

              {/* Home */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/launch" element={<LandingPagev1 />} />

              {/* Show Interest */}
              <Route path="/show-interest" element={<ShowInterest />} />
              <Route path="/find-teammates" element={<FindTeammates />} />
              <Route path="/find-teammates/events/:eventId" element={<FindTeammatesPeople />} />

              {/* Find Teams */}
              <Route path="/post-your-team" element={<PostTeamLandingPage />} />
              <Route path="/find-team" element={<FindTeams />} />
              <Route path="/find-team/events/:eventId" element={<FindActualTeams />} />

              {/* Chats */}
              <Route path="/chats" element={<AllChatsPage />} />

            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
