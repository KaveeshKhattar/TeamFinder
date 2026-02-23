import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Suspense, lazy } from 'react'
import Loading from './modules/core/components/Loading'
import 'react-image-crop/dist/ReactCrop.css'
import { ThemeProvider } from './components/themeProvider'

import { AuthProvider } from './modules/core/components/AuthContext'
import OrganizerRouteGuard from './modules/core/components/OrganizerRouteGuard'

const LandingPagev1 = lazy(() => import('./modules/landingPage/components/LandingPagev1'))
const Login = lazy(() => import('./modules/authentication/components/Login'))
const Signup = lazy(() => import('./modules/authentication/components/Signup'))
const Verification = lazy(() => import('./modules/authentication/components/Verification'))
const Profile = lazy(() => import('./modules/profile/components/Profile'))
const ChangePasswordVerification = lazy(() => import('./modules/authentication/components/ChangePasswordVerification'))
const ChangePassword = lazy(() => import('./modules/authentication/components/ChangePassword'))
const ShowInterest = lazy(() => import('./modules/showInterest/ShowInterest'))
const FindTeammates = lazy(() => import('./modules/find/FindTeammates'))
const FindTeammatesPeople = lazy(() => import('./modules/find/FindTeammatesPeople'))
const PostTeamLandingPage = lazy(() => import('./modules/teams/components/PostTeamLandingPage'))
const FindTeams = lazy(() => import('./modules/teams/components/FindTeam'))
const FindActualTeams = lazy(() => import('./modules/teams/components/FindActualTeams'))
const AllChatsPage = lazy(() =>
  import('./modules/chat/AllChatsPage').then((module) => ({ default: module.AllChatsPage }))
)
const OrganizerDashboard = lazy(() => import('./modules/organizer/components/OrganizerDashboard'))

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
              {/* <Route path="/" element={<LandingPage />} /> */}
              <Route path="/" element={<LandingPagev1 />} />

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
              <Route path="/organizer" element={
                <OrganizerRouteGuard>
                  <OrganizerDashboard />
                </OrganizerRouteGuard>
              } />

            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
