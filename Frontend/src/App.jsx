import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import Home from "./pages/Home.jsx";
import Friends from "./pages/FriendSuggestions.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import StoriesContainer from "./components/StoriesContainer.jsx";

import LeftSidebar from "./components/LeftSidebar.jsx";
import RightSidebar from "./components/RightSidebar.jsx";
import "./App.css"; // For layout styling

// ✅ Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f172a",
          color: "#94a3b8",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ✅ Public Route (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f172a",
          color: "#94a3b8",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/home" />;
};

// ✅ Layout wrapper for pages WITH bottom navigation
const LayoutWithNavigation = ({ children }) => {
  return <div className="app-layout">{children}</div>;
};

// ✅ Layout wrapper for Home page (with sidebars)
const HomeLayout = () => {
  return (
    <div className="home-layout">
      <div className="left-sidebar">
        <LeftSidebar />
      </div>

      <div className="main-content">
        <Home />
      </div>

      <div className="right-sidebar">
        <RightSidebar />
      </div>
    </div>
  );
};

// ✅ App Content
function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
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

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/home" />
          </ProtectedRoute>
        }
      />

      {/* Home Page with both Sidebars */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      />

      {/* Friends */}
      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <LayoutWithNavigation>
              <Friends />
            </LayoutWithNavigation>
          </ProtectedRoute>
        }
      />

      {/* Create Post */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <LayoutWithNavigation>
              <CreatePostPage />
            </LayoutWithNavigation>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/home/profile"
        element={
          <ProtectedRoute>
            <LayoutWithNavigation>
              <Profile />
            </LayoutWithNavigation>
          </ProtectedRoute>
        }
      />

      {/* Stories */}
      <Route
        path="/stories"
        element={
          <ProtectedRoute>
            <LayoutWithNavigation>
              <StoriesContainer />
            </LayoutWithNavigation>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/home" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// ✅ Main App Wrapper
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
