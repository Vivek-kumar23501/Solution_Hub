import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Taskbar from "./components/Taskbar.jsx";
import Home from "./pages/Home.jsx";
import Friends from "./pages/FriendSuggestions.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import StoriesContainer from "./components/StoriesContainer.jsx";
// import Navbar from "./components/Navbar.jsx";
// import Search from "./pages/Search.jsx";
// import Challenges from "./pages/Challenges.jsx";
// import Notifications from "./pages/Notifications.jsx";
// import Messages from "./pages/Messages.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// Layout component for pages with bottom navigation
const LayoutWithNavigation = ({ children, activeSection }) => {
  return (
    <div className="app-layout">
      {children}
      <Taskbar activeSection={activeSection} />
    </div>
  );
};

// Layout for Home page (no bottom navigation as it has fixed sidebars)
const HomeLayout = ({ children }) => {
  return (
    <div className="home-layout">
      {children}
    </div>
  );
};

function AppContent() {
  // const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Show Navbar only when authenticated and not on Home page */}
      {/* {isAuthenticated && <Navbar />} */}
      
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes - Only accessible when logged in */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/home" />
            </ProtectedRoute>
          } 
        />
        
        {/* Home Route with fixed sidebars (no bottom navigation) */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeLayout>
                <Home  to="/home" />
              </HomeLayout>
            </ProtectedRoute>
          } 
        />

        {/* Search Route */}
        {/* <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="search">
                <Search />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        /> */}

        {/* Problems Route */}
        <Route 
          path="/problems" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="problems">
                <Friends />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        />

        {/* Challenges Route */}
        {/* <Route 
          path="/challenges" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="challenges">
                <Challenges />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        /> */}

        {/* Notifications Route */}
        {/* <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="notifications">
                <Notifications />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        /> */}

        {/* Create Post Route */}
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="create">
                <CreatePostPage />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        />

        {/* Messages Route */}
        {/* <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="messages">
                <Messages />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        /> */}

        {/* Profile Route */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="profile">
                <Profile />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        />

        {/* Stories Route (if needed separately) */}
        <Route 
          path="/stories" 
          element={
            <ProtectedRoute>
              <LayoutWithNavigation activeSection="stories">
                <StoriesContainer />
              </LayoutWithNavigation>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Fallback */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <Navigate to="/home" />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;