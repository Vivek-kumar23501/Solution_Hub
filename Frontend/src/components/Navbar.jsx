/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

// SVG Icons (keep all your existing icons the same)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ProblemsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const RankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const ChallengesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 15 2 2 4-4"></path>
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
  </svg>
);

const FriendsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const AboutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuthStatus
  };
};

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Get active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/problems')) return 'problems';
    if (path.startsWith('/rank')) return 'rank';
    if (path.startsWith('/challenges')) return 'challenges';
    if (path.startsWith('/friends')) return 'friends';
    return '';
  };

  const activeItem = getActiveItem();

  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
    { id: "problems", label: "Problems", icon: <ProblemsIcon />, path: "/problems" },
    { id: "rank", label: "Rank", icon: <RankIcon />, path: "/rank" },
    { id: "challenges", label: "Challenges", icon: <ChallengesIcon />, path: "/challenges" },
    { id: "friends", label: "Friends", icon: <FriendsIcon />, path: "/friends" }
  ];

  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: <ProfileIcon />, path: "/profile" },
    { id: "settings", label: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { id: "help", label: "Help & Support", icon: <HelpIcon />, path: "/help" },
    { id: "about", label: "About", icon: <AboutIcon />, path: "/about" }
  ];

  // Enhanced navigation handler
  const handleNavigation = (path, _itemId) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // Enhanced logout function
  const handleLogout = () => {
    setSidebarOpen(false);
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
    }
  };

  // Don't render navbar if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          
          {/* Left Section - Logo */}
          <div className="nav-left">
            <Link to="/" className="nav-brand">
              <div className="logo">
                <span className="logo-icon">⚡</span>
              </div>
              <div className="brand-text">
                <h1 className="brand-name">CodeMaster</h1>
              </div>
            </Link>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="nav-center">
            <div className="nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Profile and Notification */}
          <div className="nav-right">
            <div className="nav-actions">
              {/* Notification Bell */}
              <button 
                className="action-btn notification-btn"
                onClick={() => handleNavigation('/notifications', 'notifications')}
              >
                <NotificationIcon />
                <span className="notification-badge">5</span>
              </button>

              {/* Profile Button */}
              <button 
                className="profile-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <div className="avatar">
                  <ProfileIcon />
                </div>
                <span className="profile-text">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
           onClick={() => setSidebarOpen(false)}>
        <div className="sidebar" onClick={(e) => e.stopPropagation()}>
          
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">
                <ProfileIcon />
              </div>
              <div className="user-details">
                <h3 className="user-name">{user?.name || 'John Doe'}</h3>
                <span className="user-email">{user?.email || 'john.doe@example.com'}</span>
                <span className="user-status">Pro Member</span>
              </div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Sidebar Menu */}
          <div className="sidebar-menu">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Sidebar Footer with Logout */}
          <div className="sidebar-footer">
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              <span className="logout-icon">
                <LogoutIcon />
              </span>
              <span className="logout-label">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;