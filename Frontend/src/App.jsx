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
import Navbar from "./components/Navbar.jsx";

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
  
  return !isAuthenticated ? children : <Navigate to="/dashboard/home" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Show Navbar only when authenticated */}
      {isAuthenticated && <Navbar />}
      
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
              <Navigate to="/dashboard/home" />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/home" 
          element={
            <ProtectedRoute>
              <>
                <Home />
                {/* <Taskbar activeSection="home" /> */}
              </>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/stories" 
          element={
            <ProtectedRoute>
              <>
                <StoriesContainer />
                <Taskbar activeSection="stories" />
              </>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/friend-suggestions" 
          element={
            <ProtectedRoute>
              <>
                <Friends />
                <Taskbar activeSection="friend-suggestions" />
              </>
            </ProtectedRoute>
          } 
        /> 
        
        <Route 
          path="/dashboard/posts" 
          element={
            <ProtectedRoute>
              <>
                <CreatePostPage />
                <Taskbar activeSection="post" />
              </>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/profile" 
          element={
            <ProtectedRoute>
              <>
                <Profile />
                <Taskbar activeSection="profile" />
              </>
            </ProtectedRoute>
          } 
        />

        {/* 404 Fallback */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard/home" />
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